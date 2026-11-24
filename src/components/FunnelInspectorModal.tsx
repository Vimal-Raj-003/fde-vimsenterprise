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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#22191D]/65 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-3xl border border-[#B58338]/35 bg-white shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[#6A244C]/12 bg-[#4A1635] px-6 py-4 text-white">
          <div>
            <span className="font-mono-tech text-[11px] text-[#E5C594] uppercase">
              META PIXEL (1606721668164457) + FUNNEL TELEMETRY
            </span>
            <h2 className="font-luxury text-xl font-bold">
              Live Ad Funnel &amp; Visitor Journey Inspector
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="inline-flex min-h-9 items-center rounded-lg bg-[#B58338] px-3 text-xs font-bold text-[#22191D]"
            >
              Open Full /admin
            </a>
            <button
              type="button"
              onClick={refreshSummary}
              className="min-h-9 cursor-pointer rounded-lg border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-9 w-9 cursor-pointer rounded-lg border border-white/25 bg-white/10 text-sm text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#22191D]">
          {summary && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-xl border border-[#B58338]/25 bg-[#FAF6F0] p-3">
                  <div className="text-[#5E5056]">Unique Visitors</div>
                  <div className="font-luxury text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.uniqueVisitors}
                  </div>
                </div>
                <div className="rounded-xl border border-[#B58338]/25 bg-[#FAF6F0] p-3">
                  <div className="text-[#5E5056]">Leads Captured</div>
                  <div className="font-luxury text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.leadsCaptured}
                  </div>
                </div>
                <div className="rounded-xl border border-[#B58338]/25 bg-[#FAF6F0] p-3">
                  <div className="text-[#5E5056]">Checkouts Opened</div>
                  <div className="font-luxury text-2xl font-bold mt-1 tabular-nums">
                    {summary.funnel.checkoutInitiated}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="text-amber-800">Drop-offs</div>
                  <div className="font-luxury text-2xl font-bold text-amber-900 mt-1 tabular-nums">
                    {summary.funnel.paymentAbandoned}
                  </div>
                </div>
                <div className="rounded-xl border border-[#1A6B54]/25 bg-[#1A6B54]/8 p-3">
                  <div className="text-[#1A6B54]">Cohort Seats</div>
                  <div className="font-luxury text-2xl font-bold text-[#1A6B54] mt-1 tabular-nums">
                    {summary.cohort.enrolledSeats} / {summary.cohort.totalSeats}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#B58338]/20 p-4">
                  <h3 className="font-bold text-[#22191D] mb-2">Section Visibility Reach:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.sectionReach).map(([sec, count]) => (
                      <div key={sec} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#5E5056]">#{sec}</span>
                        <span className="font-mono-tech font-bold text-[#6A244C] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#B58338]/20 p-4">
                  <h3 className="font-bold text-[#22191D] mb-2">Scroll Depth &amp; CTA Clicks:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.scrollReach).map(([depth, count]) => (
                      <div key={depth} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#5E5056]">Scroll {depth}</span>
                        <span className="font-mono-tech font-bold text-[#1A6B54] tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                    {Object.entries(summary.funnel.ctaClicksByPlacement).map(([btn, count]) => (
                      <div key={btn} className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="font-mono-tech text-[#6A244C]">CTA: {btn}</span>
                        <span className="font-mono-tech font-bold text-[#22191D] tabular-nums">
                          {count} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="rounded-xl border border-[#6A244C]/15 bg-[#22191D] p-4 text-[#FAF6F0]">
            <h3 className="font-bold text-white mb-2">
              Browser Session Meta Pixel Firing Log ({pixelEvents.length}):
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono-tech text-[11px]">
              {pixelEvents.map((ev, idx) => (
                <div key={`${ev.timestamp}-${idx}`} className="border-b border-white/10 pb-1">
                  <span className="text-[#D4AF6A]">[{ev.type.toUpperCase()}]</span>{" "}
                  <strong className="text-white">{ev.event}</strong>{" "}
                  {ev.eventId && <span className="text-[#E5C594]">({ev.eventId})</span>}{" "}
                  {ev.params && <span className="text-white/70">{JSON.stringify(ev.params)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
