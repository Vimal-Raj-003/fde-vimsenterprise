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

export default function OwnerAdminPage({
  theme,
  onToggleTheme
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
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
      `Hi ${name}, welcome to VIMS Academy! Thank you for registering for the 3-Day Forward Deployment Engineer (FDE) Live Workshop starting 12th December 2026.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--ink-primary)] pb-16">
      {/* Header */}
      <header
        style={{ backgroundColor: "var(--bg-header)" }}
        className="sticky top-0 z-30 border-b border-[var(--border-subtle)] backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Logo"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div>
              <div className="font-heading text-lg font-bold text-[var(--ink-primary)]">
                VIMS FDE · Owner Leads &amp; Payments
              </div>
              <div className="font-mono-tech text-[10px] text-[var(--ink-muted)]">
                AUTO-REFRESHES EVERY 10S
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="btn-outline-3d min-h-9 cursor-pointer rounded-lg px-3 text-xs font-bold"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={() => void loadSummary(token)}
              className="btn-gold-3d min-h-9 cursor-pointer rounded-lg px-3.5 text-xs font-bold"
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
            <a
              href="/"
              className="btn-outline-3d inline-flex min-h-9 items-center rounded-lg px-3 text-xs font-semibold"
            >
              View Site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="surface-card rounded-2xl p-5 space-y-3">
            <div className="text-sm font-bold text-red-500">{error}</div>
            <div className="flex gap-2">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter admin token"
                className="h-10 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-well)] px-3 text-sm text-[var(--ink-primary)]"
              />
              <button
                type="button"
                onClick={() => setToken(tokenInput.trim())}
                className="btn-gold-3d h-10 cursor-pointer rounded-xl px-4 text-xs font-bold"
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
              <span className="rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3.5 py-1 font-mono-tech font-semibold text-[var(--accent-gold)]">
                {data.channels?.razorpayLive ? "● Razorpay Live Connected" : "○ Razorpay Sandbox"}
              </span>
              <span className="rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3.5 py-1 font-mono-tech font-semibold text-[var(--accent-gold)]">
                {data.channels?.smtpReady ? "● Email Alerts Ready (SMTP)" : "○ Email SMTP Missing"}
              </span>
              <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1 font-mono-tech font-semibold text-[var(--ink-primary)]">
                {data.channels?.pushTopic
                  ? `● Phone Push Ready (Topic: ${data.channels.pushTopic})`
                  : "○ Phone Push Disabled"}
              </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Booked Seats</div>
                <div className="font-heading mt-1 text-3xl font-bold text-[var(--accent-gold)] tabular-nums">
                  {data.cohort.enrolledSeats} / {data.cohort.totalSeats}
                </div>
              </div>
              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Total Leads</div>
                <div className="font-heading mt-1 text-3xl font-bold text-[var(--ink-primary)] tabular-nums">
                  {data.funnel.leadsCaptured}
                </div>
              </div>
              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">
                  Paid Enrollments
                </div>
                <div className="font-heading mt-1 text-3xl font-bold text-[var(--accent-gold)] tabular-nums">
                  {data.funnel.paidEnrollments}
                </div>
              </div>
              <div className="surface-card rounded-2xl p-4">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Total Revenue</div>
                <div className="font-heading mt-1 text-3xl font-bold text-[var(--accent-gold)] tabular-nums">
                  ₹{(data.funnel.totalRevenueInr || 0).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="surface-card rounded-2xl p-4 col-span-2 sm:col-span-1">
                <div className="text-xs font-semibold text-[var(--ink-secondary)]">Drop-offs</div>
                <div className="font-heading mt-1 text-3xl font-bold text-[var(--ink-primary)] tabular-nums">
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
                      ? "btn-gold-3d"
                      : "surface-card text-[var(--ink-secondary)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Leads Feed */}
            {filteredRegs.length === 0 ? (
              <div className="surface-card rounded-2xl p-8 text-center text-sm text-[var(--ink-secondary)]">
                No entries in this view yet. When a student fills out the form on{" "}
                <strong className="text-[var(--ink-primary)]">fde.vimsenterprise.com</strong>, they
                appear here with 1-tap Call and WhatsApp buttons.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRegs.map((reg) => {
                  const isPaid = reg.status === "paid";
                  return (
                    <article
                      key={reg.id}
                      className={`rounded-2xl p-5 space-y-3 ${
                        isPaid ? "surface-card-featured" : "surface-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-base font-bold text-[var(--ink-primary)]">
                            {reg.name}
                          </div>
                          <div className="text-xs text-[var(--ink-secondary)]">
                            {reg.profile}
                            {reg.city ? ` · ${reg.city}` : ""}
                          </div>
                        </div>
                        <span className="rounded-full px-3 py-0.5 font-mono-tech text-[11px] font-bold uppercase border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] text-[var(--accent-gold)]">
                          {isPaid ? `PAID · SEAT #${reg.seatNumber}` : reg.status}
                        </span>
                      </div>

                      <div className="surface-well rounded-xl px-4 py-3 text-xs space-y-1">
                        <div>
                          <span className="text-[var(--ink-secondary)]">Phone:</span>{" "}
                          <strong className="font-mono-tech text-[var(--ink-primary)]">
                            {reg.phone}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[var(--ink-secondary)]">Email:</span>{" "}
                          <span className="text-[var(--ink-primary)]">{reg.email}</span>
                        </div>
                        {reg.paymentId && (
                          <div>
                            <span className="text-[var(--ink-secondary)]">Payment ID:</span>{" "}
                            <span className="font-mono-tech text-[var(--accent-gold)]">
                              {reg.paymentId}
                            </span>
                          </div>
                        )}
                        <div className="text-[11px] text-[var(--ink-muted)]">
                          Ad: {reg.utm?.utm_campaign || reg.utm?.utm_source || "Direct"} ·{" "}
                          {new Date(reg.createdAt).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <a
                          href={`tel:${reg.phone}`}
                          className="btn-outline-3d flex min-h-10 items-center justify-center rounded-xl text-xs font-bold"
                        >
                          Call Student
                        </a>
                        <a
                          href={formatWaHref(reg.phone, reg.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold-3d flex min-h-10 items-center justify-center rounded-xl text-xs font-bold"
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
