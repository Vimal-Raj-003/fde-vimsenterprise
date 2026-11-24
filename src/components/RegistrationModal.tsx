import { useEffect, useState } from "react";
import {
  captureUtmAttribution,
  getVisitorId,
  trackInitiateCheckout,
  trackLeadSubmitted,
  trackPaymentDropoff,
  trackVerifiedPurchase
} from "../lib/pixel";
import { LiveSeatAndCountdownCard } from "./CountdownBanner";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: unknown) => void) => void;
    };
  }
}

export interface PricingInfo {
  baseInr: number;
  gstPercent: number;
  gstInr: number;
  totalInr: number;
  totalPaise: number;
}

interface SharedFormProps {
  pricing: PricingInfo;
  enrolledSeats: number;
  totalSeats: number;
  targetIso: string;
  onSeatConfirmed: (newEnrolled: number, newRemaining: number) => void;
  onDoneClose?: () => void;
  showSeatHeader?: boolean;
}

type FlowStep = "form" | "sandbox_checkout" | "abandoned" | "confirmed";

function loadRazorpaySdk(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function EnrollmentFormWidget({
  pricing,
  enrolledSeats,
  totalSeats,
  targetIso,
  onSeatConfirmed,
  onDoneClose,
  showSeatHeader = false
}: SharedFormProps) {
  const [step, setStep] = useState<FlowStep>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("student");
  const [city, setCity] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registrationId, setRegistrationId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [sandboxMethod, setSandboxMethod] = useState<"upi" | "card" | "netbanking">("upi");

  const [receipt, setReceipt] = useState<{
    seatNumber: number;
    paymentId: string;
    registrationId: string;
    amountInr: number;
  } | null>(null);

  const remainingSeats = Math.max(0, totalSeats - enrolledSeats);

  async function startPaymentForRegistration(regId: string) {
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const orderRes = await fetch("/api/fde/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: regId })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setGeneralError(orderData.error || "Unable to start payment. Please retry.");
        setIsSubmitting(false);
        return;
      }

      setOrderId(orderData.orderId);
      trackInitiateCheckout(orderData.checkoutEventId || `ic_${regId}`, pricing.totalInr);

      if (orderData.mode === "razorpay" && orderData.keyId) {
        const sdkReady = await loadRazorpaySdk();
        if (!sdkReady || !window.Razorpay) {
          setGeneralError("Could not load Razorpay Checkout. Check your internet connection.");
          setIsSubmitting(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "VIMS Academy",
          description: "FDE Live Batch (Starts 12th Dec)",
          order_id: orderData.orderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: `+91${phone.replace(/\D/g, "").slice(-10)}`
          },
          theme: {
            color: "#1D4ED8"
          },
          handler: async (response: Record<string, string>) => {
            await completeVerification(regId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              setStep("abandoned");
              trackPaymentDropoff("razorpay_modal_dismissed");
              void fetch("/api/fde/payment-dropoff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId: regId, reason: "modal_dismissed" })
              });
            }
          }
        });

        rzp.on("payment.failed", () => {
          setIsSubmitting(false);
          setStep("abandoned");
          trackPaymentDropoff("razorpay_payment_failed");
          void fetch("/api/fde/payment-dropoff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ registrationId: regId, reason: "payment_failed" })
          });
        });

        rzp.open();
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setStep("sandbox_checkout");
    } catch {
      setGeneralError("Network error. Please retry.");
      setIsSubmitting(false);
    }
  }

  async function completeVerification(
    regId: string,
    payload: {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      sandbox_method?: string;
    }
  ) {
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const verifyRes = await fetch("/api/fde/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId,
          ...payload
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setGeneralError(verifyData.error || "Payment verification failed.");
        setIsSubmitting(false);
        return;
      }

      if (!verifyData.alreadyVerified) {
        trackVerifiedPurchase(
          verifyData.purchaseEventId,
          verifyData.amountInr,
          verifyData.paymentId,
          verifyData.seatNumber
        );
      }

      onSeatConfirmed(verifyData.enrolledSeats, verifyData.remainingSeats);
      setReceipt({
        seatNumber: verifyData.seatNumber,
        paymentId: verifyData.paymentId,
        registrationId: verifyData.registrationId,
        amountInr: verifyData.amountInr
      });
      setStep("confirmed");
    } catch {
      setGeneralError("Error confirming your payment. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/fde/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          profile,
          city,
          utm: captureUtmAttribution(),
          visitorId: getVisitorId(),
          fde_hp_trap: honeypot
        })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setGeneralError(data.error || "Please check the fields below.");
        setIsSubmitting(false);
        return;
      }

      setRegistrationId(data.registrationId);
      trackLeadSubmitted(data.leadEventId, profile);
      await startPaymentForRegistration(data.registrationId);
    } catch {
      setGeneralError("Could not connect to server. Please try again.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none";

  return (
    <div className="space-y-4">
      {showSeatHeader && step !== "confirmed" && (
        <LiveSeatAndCountdownCard
          targetIso={targetIso}
          enrolledSeats={enrolledSeats}
          totalSeats={totalSeats}
          compact
        />
      )}

      {step === "form" && (
        <form onSubmit={handleFormSubmit} noValidate className="space-y-3.5">
          {generalError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {generalError}
            </div>
          )}

          <input
            type="text"
            name="fde_hp_trap"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Mobile <span className="text-blue-600">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className={inputClass}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Chennai / Coimbatore"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email ID <span className="text-blue-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com (Class link sent here)"
              className={inputClass}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">I am a</label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className={inputClass}
            >
              <option value="student">College Student / Recent Graduate</option>
              <option value="working_it">Working Professional (IT / Software)</option>
              <option value="working_core">Working Professional (Core / Non-IT)</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-xs flex items-center justify-between">
            <span className="text-slate-600">
              Fee: <strong>₹{pricing.baseInr.toLocaleString("en-IN")}</strong> + 18% GST
            </span>
            <span className="font-mono-tech font-bold text-blue-700 tabular-nums">
              Total: ₹{pricing.totalInr.toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || remainingSeats <= 0}
            className="btn-primary-trust flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-sm sm:text-base font-bold disabled:opacity-50"
          >
            {isSubmitting
              ? "Connecting to Payment..."
              : remainingSeats <= 0
                ? "All 50 Seats Booked"
                : `Register Now · ₹${pricing.baseInr.toLocaleString("en-IN")} + GST`}
          </button>

          <p className="text-center text-[11px] text-slate-500">
            100% Secure Razorpay Checkout · UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking
          </p>
        </form>
      )}

      {step === "sandbox_checkout" && (
        <div className="space-y-3.5">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-950">
            <strong>Checkout Preview:</strong> Order <code className="font-mono-tech">{orderId}</code>{" "}
            created for ₹{pricing.totalInr.toLocaleString("en-IN")}. Select payment method below:
          </div>

          <div className="space-y-2">
            {[
              { id: "upi" as const, label: "UPI (Google Pay / PhonePe / Paytm)" },
              { id: "card" as const, label: "Debit / Credit Card" },
              { id: "netbanking" as const, label: "NetBanking" }
            ].map((m) => (
              <label
                key={m.id}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-4 py-2 text-sm font-medium ${
                  sandboxMethod === m.id
                    ? "border-blue-600 bg-blue-50/70 text-slate-900"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <span>{m.label}</span>
                <input
                  type="radio"
                  checked={sandboxMethod === m.id}
                  onChange={() => setSandboxMethod(m.id)}
                  className="accent-blue-600"
                />
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                completeVerification(registrationId, {
                  razorpay_order_id: orderId,
                  sandbox_method: sandboxMethod
                })
              }
              className="btn-primary-trust min-h-11 cursor-pointer rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold"
            >
              {isSubmitting ? "Confirming..." : `Pay ₹${pricing.totalInr.toLocaleString("en-IN")}`}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setStep("abandoned");
                trackPaymentDropoff("sandbox_cancelled");
                void fetch("/api/fde/payment-dropoff", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ registrationId, reason: "sandbox_cancelled" })
                });
              }}
              className="min-h-11 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "abandoned" && (
        <div className="space-y-3.5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
            Your details are saved! Only <strong>{remainingSeats} seats</strong> remain for the 12th
            December batch. Complete payment below to lock your seat.
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => startPaymentForRegistration(registrationId)}
            className="btn-primary-trust min-h-11 w-full cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold"
          >
            Resume Payment · ₹{pricing.totalInr.toLocaleString("en-IN")}
          </button>
        </div>
      )}

      {step === "confirmed" && receipt && (
        <div className="space-y-3.5 text-center">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
              ✓
            </div>
            <div className="font-mono-tech text-xs font-bold text-emerald-800">
              SEAT #{receipt.seatNumber} / {totalSeats} CONFIRMED
            </div>
            <div className="mt-1 text-base font-bold text-slate-900">
              Welcome, {name}! See you live on 12th December.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs space-y-1.5 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Seat Number</span>
              <span className="font-mono-tech font-bold text-blue-700">
                #{receipt.seatNumber} of {totalSeats}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registration ID</span>
              <span className="font-mono-tech font-semibold text-slate-900">
                {receipt.registrationId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-mono-tech font-bold text-emerald-700">
                ₹{receipt.amountInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {onDoneClose && (
            <button
              type="button"
              onClick={onDoneClose}
              className="min-h-11 w-full cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white"
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegistrationModal({
  isOpen,
  onClose,
  pricing,
  enrolledSeats,
  totalSeats,
  startIso: _startIso,
  endIso,
  onSeatConfirmed
}: {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingInfo;
  enrolledSeats: number;
  totalSeats: number;
  startIso: string;
  endIso: string;
  onSeatConfirmed: (newEnrolled: number, newRemaining: number) => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fde-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div>
            <span className="font-mono-tech text-[11px] font-bold uppercase text-blue-700">
              STARTS 12TH DECEMBER · LIVE IN TAMIL
            </span>
            <h2 id="fde-modal-title" className="text-lg font-extrabold text-slate-900">
              Register Your Seat
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto">
          <EnrollmentFormWidget
            pricing={pricing}
            enrolledSeats={enrolledSeats}
            totalSeats={totalSeats}
            targetIso={endIso}
            onSeatConfirmed={onSeatConfirmed}
            onDoneClose={onClose}
            showSeatHeader
          />
        </div>
      </div>
    </div>
  );
}
