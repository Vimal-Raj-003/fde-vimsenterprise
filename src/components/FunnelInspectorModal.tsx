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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141A17]/65 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-3xl border border-[#047857]/25 bg-white shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#047857]/15 bg-[#065F46] px-6 py-4 text-white">
          <div>
            <span className="font-mono-tech text-[11px] text-[#FDE68A] uppercase">
              META PIXEL (1606721668164457) + FUNNEL TELEMETRY
            </span>
            <h2 className="font-heading text-xl font-bold">
              Live Ad Funnel &amp; Visitor Journey Inspector
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="inline-flex min-h-9 items-center rounded-lg bg-[#D97706] px-3 text-xs font-bold text-white hover:brightness-105"
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

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#141A17]">
          {summary && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-xl border border-[#047857]/15 bg-[#F0F7F4] p-3">
                  <div className="text-[#4B5550]">Unique Visitors</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.uniqueVisitors}
                  </div>
                </div>
                <div className="rounded-xl border border-[#047857]/15 bg-[#F0F7F4] p-3">
                  <div className="text-[#4B5550]">Leads Captured</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.leadsCaptured}
                  </div>
                </div>
                <div className="rounded-xl border border-[#047857]/15 bg-[#F0F7F4] p-3">
                  <div className="text-[#4B5550]">Checkouts Opened</div>
                  <div className="font-heading text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.checkoutInitiated}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-[#FEF3C7]/70 p-3">
                  <div className="text-[#B45309]">Drop-offs</div>
                  <div className="font-heading text-2xl font-bold text-[#B45309] mt-1 tabular-nums">
                    {summary.funnel.paymentAbandoned}
                  </div>
                </div>
                <div className="rounded-xl border border-[#047857]/25 bg-[#ECFDF5] p-3">
                  <div className="text-[#047857]">Cohort Seats</div>
                  <div className="font-heading text-2xl font-bold text-[#047857] mt-1 tabular-nums">
                    {summary.cohort.enrolledSeats} / {summary.cohort.totalSeats}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#047857]/15 p-4">
                  <h3 className="font-bold text-[#141A17] mb-2">Section Visibility Reach:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.sectionReach).map(([sec, count]) => (
                      <div key={sec} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#4B5550]">#{sec}</span>
                        <span className="font-mono-tech font-bold text-[#047857] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#047857]/15 p-4">
                  <h3 className="font-bold text-[#141A17] mb-2">Scroll Depth &amp; CTA Clicks:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.scrollReach).map(([depth, count]) => (
                      <div key={depth} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#4B5550]">Scroll {depth}</span>
                        <span className="font-mono-tech font-bold text-[#047857] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                    {Object.entries(summary.funnel.ctaClicksByPlacement).map(([btn, count]) => (
                      <div key={btn} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#B45309]">CTA: {btn}</span>
                        <span className="font-mono-tech font-bold text-[#141A17] tabular-nums">
                          {count} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="rounded-xl border border-[#047857]/20 bg-[#141A17] p-4 text-[#F8FAF9]">
            <h3 className="font-bold text-white mb-2">
              Browser Session Meta Pixel Firing Log ({pixelEvents.length}):
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono-tech text-[11px]">
              {pixelEvents.map((ev, idx) => (
                <div key={`${ev.timestamp}-${idx}`} className="border-b border-white/10 pb-1">
                  <span className="text-[#FBBF24]">[{ev.type.toUpperCase()}]</span>{" "}
                  <strong className="text-white">{ev.event}</strong>{" "}
                  {ev.eventId && <span className="text-[#6EE7B7]">({ev.eventId})</span>}{" "}
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
