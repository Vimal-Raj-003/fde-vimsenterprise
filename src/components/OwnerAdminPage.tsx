import { useCallback, useEffect, useState } from "react";

interface AdminSummary {
  cohort: {
    enrolledSeats: number;
    remainingSeats: number;
    totalSeats: number;
    confirmedNewCount: number;
    paymentMode: string;
  };
  funnel: {
    uniqueVisitors: number;
    leadsCaptured: number;
    checkoutInitiated: number;
    paymentAbandoned: number;
    paidEnrollments: number;
    totalRevenueInr?: number;
  };
  channels?: {
    razorpayLive: boolean;
    smtpReady: boolean;
    pushTopic: string | null;
  };
  registrations: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    profile: string;
    city: string;
    status: string;
    seatNumber?: number;
    paymentId?: string;
    totalInr: number;
    utm?: { utm_campaign?: string; utm_source?: string };
    createdAt: string;
  }>;
}

const TOKEN_STORAGE_KEY = "vims_fde_admin_token";

export default function OwnerAdminPage() {
  const [token, setToken] = useState<string>(() => {
    try {
      const urlToken = new URLSearchParams(window.location.search).get("token");
      if (urlToken) return urlToken;
      return sessionStorage.getItem(TOKEN_STORAGE_KEY) || "vims-fde-2026";
    } catch {
      return "vims-fde-2026";
    }
  });
  const [tokenInput, setTokenInput] = useState(token);
  const [data, setData] = useState<AdminSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "paid" | "leads">("all");

  const loadSummary = useCallback(async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/fde/admin/summary?token=${encodeURIComponent(authToken)}`);
      if (!res.ok) {
        setError("Invalid admin token. Please enter the access token to view leads.");
        setData(null);
        return;
      }
      const json = (await res.json()) as AdminSummary;
      setData(json);
      try {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      } catch {
        // ignore
      }
    } catch {
      setError("Could not reach server. Please retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary(token);
    const id = window.setInterval(() => {
      void loadSummary(token);
    }, 10000);
    return () => window.clearInterval(id);
  }, [token, loadSummary]);

  const filteredRegs = (data?.registrations || []).filter((r) => {
    if (filter === "paid") return r.status === "paid";
    if (filter === "leads") return r.status !== "paid";
    return true;
  });

  function formatWaHref(phone: string, name: string) {
    const digits = phone.replace(/\D/g, "");
    const clean = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(
      `Hi ${name}, welcome to VIMS Academy! Thank you for registering for the Forward Deployment Engineer (FDE) Live Class starting 12th December 2026.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#22191D] pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#6A244C]/12 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Logo"
              className="h-8 w-8 rounded-lg object-contain"
            />
            <div>
              <div className="font-luxury text-lg font-bold text-[#22191D]">
                VIMS FDE · Owner Leads &amp; Payments
              </div>
              <div className="font-mono-tech text-[10px] text-[#5E5056]">
                AUTO-REFRESHES EVERY 10S
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadSummary(token)}
              className="btn-imperial min-h-9 cursor-pointer rounded-lg px-3.5 text-xs font-bold"
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
            <a
              href="/"
              className="inline-flex min-h-9 items-center rounded-lg border border-[#B58338]/35 bg-white px-3 text-xs font-semibold text-[#6A244C]"
            >
              View Site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="luxury-light-card rounded-2xl p-5 space-y-3">
            <div className="text-sm font-bold text-red-700">{error}</div>
            <div className="flex gap-2">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter admin token"
                className="h-10 flex-1 rounded-xl border border-[#B58338]/30 bg-white px-3 text-sm"
              />
              <button
                type="button"
                onClick={() => setToken(tokenInput.trim())}
                className="btn-imperial h-10 cursor-pointer rounded-xl px-4 text-xs font-bold"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Live Channel Readiness Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full border px-3 py-1 font-mono-tech font-semibold ${
                  data.channels?.razorpayLive
                    ? "border-[#1A6B54]/30 bg-[#1A6B54]/10 text-[#1A6B54]"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                {data.channels?.razorpayLive ? "● Razorpay Live Connected" : "○ Razorpay Sandbox"}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono-tech font-semibold ${
                  data.channels?.smtpReady
                    ? "border-[#1A6B54]/30 bg-[#1A6B54]/10 text-[#1A6B54]"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                {data.channels?.smtpReady ? "● Email Alerts Ready (SMTP)" : "○ Email SMTP Missing"}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono-tech font-semibold ${
                  data.channels?.pushTopic
                    ? "border-[#6A244C]/25 bg-[#6A244C]/8 text-[#6A244C]"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {data.channels?.pushTopic
                  ? `● Phone Push Ready (Topic: ${data.channels.pushTopic})`
                  : "○ Phone Push Disabled"}
              </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="luxury-light-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[#5E5056]">Booked Seats</div>
                <div className="font-luxury mt-1 text-3xl font-bold text-[#6A244C] tabular-nums">
                  {data.cohort.enrolledSeats} / {data.cohort.totalSeats}
                </div>
              </div>
              <div className="luxury-light-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[#5E5056]">Total Leads</div>
                <div className="font-luxury mt-1 text-3xl font-bold text-[#22191D] tabular-nums">
                  {data.funnel.leadsCaptured}
                </div>
              </div>
              <div className="luxury-light-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[#5E5056]">Paid Enrollments</div>
                <div className="font-luxury mt-1 text-3xl font-bold text-[#1A6B54] tabular-nums">
                  {data.funnel.paidEnrollments}
                </div>
              </div>
              <div className="luxury-light-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[#5E5056]">Total Revenue</div>
                <div className="font-luxury mt-1 text-3xl font-bold text-[#1A6B54] tabular-nums">
                  ₹{(data.funnel.totalRevenueInr || 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="luxury-light-card rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-xs font-semibold text-[#5E5056]">Drop-offs</div>
                <div className="font-luxury mt-1 text-3xl font-bold text-[#B58338] tabular-nums">
                  {data.funnel.paymentAbandoned}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { key: "all" as const, label: `All (${data.registrations.length})` },
                { key: "paid" as const, label: `Paid (${data.funnel.paidEnrollments})` },
                {
                  key: "leads" as const,
                  label: `Unpaid / Follow-up (${data.registrations.length - data.funnel.paidEnrollments})`
                }
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setFilter(t.key)}
                  className={`min-h-9 cursor-pointer rounded-full px-4 text-xs font-bold transition-colors ${
                    filter === t.key
                      ? "bg-[#6A244C] text-white"
                      : "bg-white border border-[#B58338]/25 text-[#5E5056]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Mobile-Friendly Leads & Payments Feed */}
            {filteredRegs.length === 0 ? (
              <div className="luxury-light-card rounded-2xl p-8 text-center text-sm text-[#5E5056]">
                No entries in this view yet. When a student fills out the form on{" "}
                <strong className="text-[#22191D]">fde.vimsenterprise.com</strong>, they appear here
                with 1-tap Call and WhatsApp buttons.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRegs.map((reg) => {
                  const isPaid = reg.status === "paid";
                  return (
                    <article
                      key={reg.id}
                      className={`rounded-2xl p-5 space-y-3 ${
                        isPaid ? "luxury-light-featured" : "luxury-light-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-base font-bold text-[#22191D]">{reg.name}</div>
                          <div className="text-xs text-[#5E5056]">
                            {reg.profile} · {reg.city}
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase ${
                            isPaid
                              ? "bg-[#1A6B54]/12 text-[#1A6B54]"
                              : reg.status === "payment_abandoned"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-[#6A244C]/10 text-[#6A244C]"
                          }`}
                        >
                          {isPaid ? `PAID · SEAT #${reg.seatNumber}` : reg.status}
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#FAF6F0] px-3.5 py-2.5 text-xs space-y-1">
                        <div>
                          <span className="text-[#5E5056]">Phone:</span>{" "}
                          <strong className="font-mono-tech text-[#22191D]">{reg.phone}</strong>
                        </div>
                        <div>
                          <span className="text-[#5E5056]">Email:</span>{" "}
                          <span className="text-[#22191D]">{reg.email}</span>
                        </div>
                        {reg.paymentId && (
                          <div>
                            <span className="text-[#5E5056]">Payment ID:</span>{" "}
                            <span className="font-mono-tech text-[#1A6B54]">{reg.paymentId}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-[#85757C]">
                          Ad: {reg.utm?.utm_campaign || reg.utm?.utm_source || "Direct"} ·{" "}
                          {new Date(reg.createdAt).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <a
                          href={`tel:${reg.phone}`}
                          className="flex min-h-10 items-center justify-center rounded-xl border border-[#6A244C]/25 bg-white text-xs font-bold text-[#6A244C] hover:bg-[#FAF6F0]"
                        >
                          Call Student
                        </a>
                        <a
                          href={formatWaHref(reg.phone, reg.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-h-10 items-center justify-center rounded-xl bg-[#1A6B54] text-xs font-bold text-white hover:brightness-105"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
