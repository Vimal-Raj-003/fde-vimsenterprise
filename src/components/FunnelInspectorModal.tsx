import { useEffect, useState } from "react";

interface FunnelInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

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
    sectionReach: Record<string, number>;
    scrollReach: Record<string, number>;
    ctaClicksByPlacement: Record<string, number>;
    leadsCaptured: number;
    checkoutInitiated: number;
    paymentAbandoned: number;
    paidEnrollments: number;
  };
  registrations: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    profile: string;
    status: string;
    seatNumber?: number;
    totalInr: number;
    createdAt: string;
  }>;
}

export default function FunnelInspectorModal({ isOpen, onClose }: FunnelInspectorProps) {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(false);

  async function refreshSummary() {
    setLoading(true);
    try {
      const res = await fetch("/api/fde/admin/summary?token=vims-fde-2026");
      if (res.ok) {
        setSummary((await res.json()) as AdminSummary);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      void refreshSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const pixelEvents = window.__fdePixelLog || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Meta Pixel and Funnel Live Analytics"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="surface-card-featured w-full max-w-4xl rounded-3xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[#161412] px-6 py-4 text-[#F8F5EE]">
          <div>
            <span className="font-mono-tech text-xs text-[#E3B452] uppercase">
              META PIXEL (1606721668164457) + FUNNEL TELEMETRY
            </span>
            <h2 className="font-heading text-xl font-bold">
              Live Ad Funnel &amp; Visitor Journey Inspector
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="btn-gold-3d inline-flex min-h-9 items-center rounded-lg px-3.5 text-xs font-bold"
            >
              Open Full /admin
            </a>
            <button
              type="button"
              onClick={refreshSummary}
              className="min-h-9 cursor-pointer rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-9 w-9 cursor-pointer rounded-lg border border-white/25 bg-white/10 text-sm text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[var(--ink-primary)] bg-[var(--bg-surface)]">
          {summary && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="surface-well rounded-xl p-3.5">
                  <div className="text-xs text-[var(--ink-secondary)]">Unique Visitors</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.uniqueVisitors}
                  </div>
                </div>
                <div className="surface-well rounded-xl p-3.5">
                  <div className="text-xs text-[var(--ink-secondary)]">Leads Captured</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.leadsCaptured}
                  </div>
                </div>
                <div className="surface-well rounded-xl p-3.5">
                  <div className="text-xs text-[var(--ink-secondary)]">Checkouts Opened</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.checkoutInitiated}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] p-3.5">
                  <div className="text-xs text-[var(--accent-gold)] font-semibold">Drop-offs</div>
                  <div className="font-heading text-2xl font-bold text-[var(--accent-gold)] mt-1 tabular-nums">
                    {summary.funnel.paymentAbandoned}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] p-3.5">
                  <div className="text-xs text-[var(--accent-gold)] font-semibold">Cohort Seats</div>
                  <div className="font-heading text-2xl font-bold text-[var(--accent-gold)] mt-1 tabular-nums">
                    {summary.cohort.enrolledSeats} / {summary.cohort.totalSeats}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="surface-well rounded-xl p-4">
                  <h3 className="font-bold text-[var(--ink-primary)] mb-2">
                    Section Visibility Reach:
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(summary.funnel.sectionReach).map(([sec, count]) => (
                      <div
                        key={sec}
                        className="flex justify-between border-b border-[var(--border-subtle)] pb-1"
                      >
                        <span className="font-mono-tech text-[var(--ink-secondary)]">#{sec}</span>
                        <span className="font-mono-tech font-bold text-[var(--accent-gold)] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-well rounded-xl p-4">
                  <h3 className="font-bold text-[var(--ink-primary)] mb-2">
                    Scroll Depth &amp; CTA Clicks:
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(summary.funnel.scrollReach).map(([depth, count]) => (
                      <div
                        key={depth}
                        className="flex justify-between border-b border-[var(--border-subtle)] pb-1"
                      >
                        <span className="font-mono-tech text-[var(--ink-secondary)]">
                          Scroll {depth}
                        </span>
                        <span className="font-mono-tech font-bold text-[var(--accent-gold)] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                    {Object.entries(summary.funnel.ctaClicksByPlacement).map(([btn, count]) => (
                      <div
                        key={btn}
                        className="flex justify-between border-b border-[var(--border-subtle)] pb-1"
                      >
                        <span className="font-mono-tech text-[var(--accent-gold)]">
                          CTA: {btn}
                        </span>
                        <span className="font-mono-tech font-bold text-[var(--ink-primary)] tabular-nums">
                          {count} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="rounded-xl border border-[var(--border-gold)] bg-[#141210] p-4 text-[#F8F5EE]">
            <h3 className="font-bold text-white mb-2">
              Browser Session Meta Pixel Firing Log ({pixelEvents.length}):
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono-tech text-xs">
              {pixelEvents.map((ev, idx) => (
                <div key={`${ev.timestamp}-${idx}`} className="border-b border-white/10 pb-1">
                  <span className="text-[#E3B452]">[{ev.type.toUpperCase()}]</span>{" "}
                  <strong className="text-white">{ev.event}</strong>{" "}
                  {ev.eventId && <span className="text-[#F4CE74]">({ev.eventId})</span>}{" "}
                  {ev.params && <span className="text-white/75">{JSON.stringify(ev.params)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
