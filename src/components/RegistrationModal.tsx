import { useEffect, useState } from "react";
import {
  captureUtmAttribution,
  getVisitorId,
  trackInitiateCheckout,
  trackLeadSubmitted,
  trackPaymentDropoff,
  trackVerifiedPurchase
} from "../lib/pixel";
import { ModalCohortStatusPanel } from "./CountdownBanner";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: unknown) => void) => void;
    };
  }
}

interface PricingInfo {
  baseInr: number;
  gstPercent: number;
  gstInr: number;
  totalInr: number;
  totalPaise: number;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: PricingInfo;
  enrolledSeats: number;
  totalSeats: number;
  startIso: string;
  endIso: string;
  onSeatConfirmed: (newEnrolled: number, newRemaining: number) => void;
}

type ModalStep = "form" | "sandbox_checkout" | "abandoned" | "confirmed";

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

export default function RegistrationModal({
  isOpen,
  onClose,
  pricing,
  enrolledSeats,
  totalSeats,
  startIso,
  endIso,
  onSeatConfirmed
}: RegistrationModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

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
        setGeneralError(orderData.error || "Unable to initialize payment order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setOrderId(orderData.orderId);
      trackInitiateCheckout(orderData.checkoutEventId || `ic_${regId}`, pricing.totalInr);

      if (orderData.mode === "razorpay" && orderData.keyId) {
        const sdkReady = await loadRazorpaySdk();
        if (!sdkReady || !window.Razorpay) {
          setGeneralError("Could not load Razorpay Checkout. Please check your connection.");
          setIsSubmitting(false);
          return;
        }

        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "VIMS Academy · VIMS Enterprise",
          description: "Forward Deployment Engineer (FDE) - 8-Week Live Cohort",
          order_id: orderData.orderId,
          prefill: {
            name: name.trim(),
            email: email.trim(),
            contact: `+91${phone.replace(/\D/g, "").slice(-10)}`
          },
          theme: {
            color: "#C69C63"
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
      setGeneralError("Network error while creating payment session. Please retry.");
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
        setGeneralError(verifyData.error || "Payment verification failed. Please contact support.");
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
        setGeneralError(data.error || "Please verify the highlighted fields.");
        setIsSubmitting(false);
        return;
      }

      setRegistrationId(data.registrationId);
      trackLeadSubmitted(data.leadEventId, profile);
      await startPaymentForRegistration(data.registrationId);
    } catch {
      setGeneralError("Could not reach registration server. Please try again.");
      setIsSubmitting(false);
    }
  }

  function resetAndClose() {
    if (step === "confirmed") {
      setStep("form");
      setName("");
      setPhone("");
      setEmail("");
      setCity("");
      setReceipt(null);
    }
    onClose();
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-[#D4AF7A]/22 bg-[#09100D] px-3.5 text-sm text-[#F5F1E8] placeholder:text-[#858075] focus:border-[#D4AF7A] focus:outline-none";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fde-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) resetAndClose();
      }}
    >
      <div className="relative my-auto w-full max-w-lg rounded-2xl border border-[#D4AF7A]/30 bg-[#0F1B16] text-[#F5F1E8] shadow-[0_32px_80px_rgba(0,0,0,0.75)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#F5F1E8]/10 px-6 py-4">
          <div>
            <span className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#D4AF7A]">
              VIMS ACADEMY · PRIVATE COHORT ENROLLMENT
            </span>
            <h2
              id="fde-modal-title"
              className="font-luxury mt-0.5 text-2xl sm:text-[28px] font-semibold text-[#F5F1E8] leading-tight"
            >
              {step === "confirmed" ? "Enrollment Confirmed" : "Reserve Your Cohort Seat"}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close registration modal"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#F5F1E8]/15 bg-[#0B1310] text-xs text-[#B8B2A6] hover:border-[#D4AF7A] hover:text-[#F5F1E8]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-4">
          {/* EXCLUSIVE SEAT COUNTER + COUNTDOWN INSIDE MODAL */}
          {step !== "confirmed" && (
            <ModalCohortStatusPanel
              startIso={startIso}
              endIso={endIso}
              enrolledSeats={enrolledSeats}
              totalSeats={totalSeats}
            />
          )}

          {step === "form" && (
            <form onSubmit={handleFormSubmit} noValidate className="space-y-3.5">
              {/* Fee Breakdown */}
              <div className="rounded-xl border border-[#F5F1E8]/10 bg-[#0B1310]/65 px-4 py-3 text-xs space-y-1">
                <div className="flex justify-between text-[#B8B2A6]">
                  <span>8-Week FDE Live Program (Tamil Instruction)</span>
                  <span className="font-mono-tech text-[#F5F1E8] tabular-nums">
                    ₹{pricing.baseInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#858075]">
                  <span>GST ({pricing.gstPercent}%)</span>
                  <span className="font-mono-tech tabular-nums">
                    ₹{pricing.gstInr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#F5F1E8]/10 pt-1.5 text-sm font-semibold text-[#F5F1E8]">
                  <span>Total Payable</span>
                  <span className="font-mono-tech text-[#D4AF7A] tabular-nums">
                    ₹{pricing.totalInr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {generalError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/35 bg-red-950/50 px-3.5 py-2.5 text-xs text-red-200"
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
                <label htmlFor="fde-name" className="block text-xs font-medium text-[#B8B2A6] mb-1">
                  Full Name <span className="text-[#D4AF7A]">*</span>
                </label>
                <input
                  id="fde-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arun Kumar"
                  className={inputClass}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fde-phone" className="block text-xs font-medium text-[#B8B2A6] mb-1">
                    Mobile / WhatsApp <span className="text-[#D4AF7A]">*</span>
                  </label>
                  <input
                    id="fde-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className={inputClass}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-300">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="fde-city" className="block text-xs font-medium text-[#B8B2A6] mb-1">
                    City (optional)
                  </label>
                  <input
                    id="fde-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chennai / Coimbatore"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fde-email" className="block text-xs font-medium text-[#B8B2A6] mb-1">
                  Email Address <span className="text-[#D4AF7A]">*</span>
                </label>
                <input
                  id="fde-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="fde-profile" className="block text-xs font-medium text-[#B8B2A6] mb-1">
                  Current Background
                </label>
                <select
                  id="fde-profile"
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className={inputClass}
                >
                  <option value="student">College Student (Engineering / CS / IT)</option>
                  <option value="fresher">Recent Graduate / Job Seeker</option>
                  <option value="it_engineer">Software / Full-Stack / Data Engineer</option>
                  <option value="core_engineer">Embedded / Automotive / Core Engineer</option>
                  <option value="other">Career Transition into Applied AI</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || remainingSeats <= 0}
                className="btn-champagne flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Preparing Secure Checkout..."
                  : `Proceed to Payment · ₹${pricing.totalInr.toLocaleString("en-IN")}`}
              </button>

              <p className="text-center text-[11px] text-[#858075]">
                Secured by Razorpay · UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking
              </p>
            </form>
          )}

          {step === "sandbox_checkout" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#D4AF7A]/30 bg-[#D4AF7A]/10 p-3 text-xs text-[#F5F1E8]">
                <strong className="text-[#D4AF7A]">Razorpay Preview Mode:</strong> Add live{" "}
                <code className="font-mono-tech">RAZORPAY_KEY_ID</code> in environment variables for live UPI
                checkout. Complete below to verify real-time seat update ({enrolledSeats} to{" "}
                {enrolledSeats + 1}).
              </div>

              <div className="space-y-2">
                {[
                  { id: "upi" as const, label: "UPI (Google Pay / PhonePe / Paytm)" },
                  { id: "card" as const, label: "Debit / Credit Card" },
                  { id: "netbanking" as const, label: "NetBanking (All Indian Banks)" }
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex min-h-11 cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${
                      sandboxMethod === m.id
                        ? "border-[#D4AF7A] bg-[#D4AF7A]/12 text-[#F5F1E8]"
                        : "border-[#F5F1E8]/12 bg-[#0B1310] text-[#B8B2A6]"
                    }`}
                  >
                    <span>{m.label}</span>
                    <input
                      type="radio"
                      name="sandbox_method"
                      checked={sandboxMethod === m.id}
                      onChange={() => setSandboxMethod(m.id)}
                      className="accent-[#D4AF7A]"
                    />
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    completeVerification(registrationId, {
                      razorpay_order_id: orderId,
                      sandbox_method: sandboxMethod
                    })
                  }
                  className="btn-champagne min-h-12 cursor-pointer rounded-xl px-5 py-3 text-sm font-bold disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Confirming..."
                    : `Pay ₹${pricing.totalInr.toLocaleString("en-IN")} & Confirm`}
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
                  className="btn-outline-luxury min-h-12 cursor-pointer rounded-xl px-5 py-3 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === "abandoned" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#D4AF7A]/30 bg-[#D4AF7A]/10 p-4 text-xs text-[#F5F1E8] leading-relaxed">
                Your registration details are saved. With only{" "}
                <strong className="text-[#D4AF7A]">{remainingSeats} seats remaining</strong>, resume payment
                below to lock your cohort seat immediately.
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => startPaymentForRegistration(registrationId)}
                className="btn-champagne min-h-12 w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-bold"
              >
                {isSubmitting
                  ? "Reconnecting..."
                  : `Resume Payment · ₹${pricing.totalInr.toLocaleString("en-IN")}`}
              </button>
            </div>
          )}

          {step === "confirmed" && receipt && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#52B788]/35 bg-[#52B788]/10 p-5 text-center">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#52B788] text-[#0B1310] font-bold">
                  ✓
                </div>
                <div className="font-mono-tech text-xs uppercase tracking-widest text-[#52B788]">
                  SEAT #{receipt.seatNumber} OF {totalSeats} RESERVED
                </div>
                <h3 className="font-luxury mt-1 text-2xl font-semibold text-[#F5F1E8]">
                  Welcome to the Cohort, {name}
                </h3>
              </div>

              <div className="rounded-xl border border-[#F5F1E8]/10 bg-[#0B1310] p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#858075]">Confirmed Seat</span>
                  <span className="font-mono-tech font-semibold text-[#D4AF7A] tabular-nums">
                    #{receipt.seatNumber} / {totalSeats}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#858075]">Registration ID</span>
                  <span className="font-mono-tech text-[#F5F1E8]">{receipt.registrationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#858075]">Payment Reference</span>
                  <span className="font-mono-tech text-[#F5F1E8]">{receipt.paymentId}</span>
                </div>
                <div className="flex justify-between border-t border-[#F5F1E8]/10 pt-2 font-semibold text-[#F5F1E8]">
                  <span>Total Paid (incl. GST)</span>
                  <span className="font-mono-tech text-[#52B788] tabular-nums">
                    ₹{receipt.amountInr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="btn-champagne min-h-11 w-full cursor-pointer rounded-xl px-6 py-2.5 text-sm font-bold"
              >
                Return to Program Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
