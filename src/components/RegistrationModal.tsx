import { useEffect, useState } from "react";
import {
  captureUtmAttribution,
  getVisitorId,
  trackInitiateCheckout,
  trackLeadSubmitted,
  trackPaymentDropoff,
  trackVerifiedPurchase
} from "../lib/pixel";

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
  totalSeats: number;
  remainingSeats: number;
  onSeatConfirmed: (newEnrolled: number, newRemaining: number) => void;
  onDoneClose?: () => void;
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
  totalSeats,
  remainingSeats,
  onSeatConfirmed,
  onDoneClose
}: SharedFormProps) {
  const [step, setStep] = useState<FlowStep>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("student");
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
          description: "3-Day FDE Live Workshop (Starts 12th Dec)",
          order_id: orderData.orderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: `+91${phone.replace(/\D/g, "").slice(-10)}`
          },
          theme: {
            color: "#9E6E1A"
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
          city: "",
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

  const buttonPriceText =
    pricing.gstPercent > 0
      ? `₹${pricing.baseInr.toLocaleString("en-IN")} + GST`
      : `₹${pricing.baseInr.toLocaleString("en-IN")}`;

  const inputClass =
    "h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-well)] px-4 text-[15px] text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:border-[var(--accent-gold)] focus:bg-[var(--bg-surface)] focus:outline-none transition-colors";

  return (
    <div className="space-y-4">
      {step === "form" && (
        <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
          {generalError && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500"
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
            <label className="block text-sm font-semibold text-[var(--ink-secondary)] mb-1.5">
              Full Name <span className="text-[var(--accent-gold)]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputClass}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--ink-secondary)] mb-1.5">
              WhatsApp / Mobile <span className="text-[var(--accent-gold)]">*</span>
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
              <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--ink-secondary)] mb-1.5">
              Email ID <span className="text-[var(--accent-gold)]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com (Receipt & link sent here)"
              className={inputClass}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--ink-secondary)] mb-1.5">
              I am a
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className={inputClass}
            >
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="industrialist">Industrialist</option>
              <option value="others">Others</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || remainingSeats <= 0}
            className="btn-gold-3d flex min-h-13 w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold disabled:opacity-50"
          >
            {isSubmitting
              ? "Opening Razorpay Payment..."
              : remainingSeats <= 0
                ? "All 50 Seats Booked"
                : `Reserve Seat Now · ${buttonPriceText}`}
          </button>

          <p className="text-center text-xs text-[var(--ink-muted)]">
            100% Secure Razorpay Live Checkout · UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking
          </p>
        </form>
      )}

      {step === "sandbox_checkout" && (
        <div className="space-y-3.5">
          <div className="surface-well rounded-xl p-3.5 text-sm text-[var(--ink-primary)]">
            <strong>Checkout Preview:</strong> Order{" "}
            <code className="font-mono-tech">{orderId}</code> created for ₹
            {pricing.totalInr.toLocaleString("en-IN")}. Select payment method below:
          </div>

          <div className="space-y-2">
            {[
              { id: "upi" as const, label: "UPI (Google Pay / PhonePe / Paytm)" },
              { id: "card" as const, label: "Debit / Credit Card" },
              { id: "netbanking" as const, label: "NetBanking" }
            ].map((m) => (
              <label
                key={m.id}
                className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border px-4 py-2 text-sm font-semibold ${
                  sandboxMethod === m.id
                    ? "border-[var(--accent-gold)] bg-[var(--pill-gold-bg)] text-[var(--ink-primary)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--ink-secondary)]"
                }`}
              >
                <span>{m.label}</span>
                <input
                  type="radio"
                  checked={sandboxMethod === m.id}
                  onChange={() => setSandboxMethod(m.id)}
                  className="accent-[var(--accent-gold)]"
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
              className="btn-gold-3d min-h-12 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold"
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
              className="btn-outline-3d min-h-12 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "abandoned" && (
        <div className="space-y-3.5">
          <div className="rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] p-4 text-sm text-[var(--ink-primary)]">
            Your details are saved! Only <strong>{remainingSeats} seats</strong> remain for the 12th
            December batch. Complete payment below to lock your seat.
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => startPaymentForRegistration(registrationId)}
            className="btn-gold-3d min-h-12 w-full cursor-pointer rounded-xl px-5 py-3 text-base font-bold"
          >
            Resume Payment · ₹{pricing.totalInr.toLocaleString("en-IN")}
          </button>
        </div>
      )}

      {step === "confirmed" && receipt && (
        <div className="space-y-4 text-center">
          <div className="rounded-2xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] p-5">
            <div
              style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
              className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full font-bold"
            >
              ✓
            </div>
            <div className="font-mono-tech text-xs font-bold text-[var(--accent-gold)]">
              SEAT #{receipt.seatNumber} / {totalSeats} CONFIRMED
            </div>
            <div className="font-heading mt-1 text-2xl font-bold text-[var(--ink-primary)]">
              Welcome, {name}! See you live on 12th December.
            </div>
          </div>

          <div className="surface-well rounded-xl p-4 text-sm space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Seat Number</span>
              <span className="font-mono-tech font-bold text-[var(--accent-gold)]">
                #{receipt.seatNumber} of {totalSeats}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Registration ID</span>
              <span className="font-mono-tech font-semibold text-[var(--ink-primary)]">
                {receipt.registrationId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-secondary)]">Payment Reference</span>
              <span className="font-mono-tech font-semibold text-[var(--ink-primary)]">
                {receipt.paymentId}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2">
              <span className="text-[var(--ink-secondary)]">Amount Paid</span>
              <span className="font-mono-tech font-bold text-[var(--accent-gold)]">
                ₹{receipt.amountInr.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--ink-muted)]">
            A confirmation receipt email has been sent to <strong>{email}</strong>.
          </p>

          {onDoneClose && (
            <button
              type="button"
              onClick={onDoneClose}
              className="btn-gold-3d min-h-11 w-full cursor-pointer rounded-xl px-5 py-2.5 text-sm font-bold"
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
  totalSeats,
  remainingSeats,
  onSeatConfirmed
}: {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingInfo;
  totalSeats: number;
  remainingSeats: number;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card-featured relative my-auto w-full max-w-md rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--bg-well)] px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                STARTS 12TH DEC · LIVE IN TAMIL
              </span>
              <span className="rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-gold)] tabular-nums">
                {remainingSeats} Left
              </span>
            </div>
            <h2
              id="fde-modal-title"
              className="font-heading mt-0.5 text-2xl font-bold text-[var(--ink-primary)]"
            >
              Register for the Live Batch
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="btn-outline-3d inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto bg-[var(--bg-surface)]">
          <EnrollmentFormWidget
            pricing={pricing}
            totalSeats={totalSeats}
            remainingSeats={remainingSeats}
            onSeatConfirmed={onSeatConfirmed}
            onDoneClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
