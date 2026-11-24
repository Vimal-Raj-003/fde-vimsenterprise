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
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-950 px-6 py-4 text-white">
          <div>
            <span className="font-mono-tech text-[11px] text-emerald-400 uppercase">
              META PIXEL METHOD + FUNNEL TELEMETRY
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold">
              Live Ad Funnel & Visitor Journey Inspector
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshSummary}
              className="min-h-9 cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-9 w-9 cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {summary && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-zinc-500">Unique Visitors</div>
                  <div className="font-display text-xl font-bold text-zinc-950 mt-1 tabular-nums">
                    {summary.funnel.uniqueVisitors}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-zinc-500">Leads Captured</div>
                  <div className="font-display text-xl font-bold text-zinc-950 mt-1 tabular-nums">
                    {summary.funnel.leadsCaptured}
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-zinc-500">Checkouts Opened</div>
                  <div className="font-display text-xl font-bold text-zinc-950 mt-1 tabular-nums">
                    {summary.funnel.checkoutInitiated}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="text-amber-800">Drop-offs</div>
                  <div className="font-display text-xl font-bold text-amber-900 mt-1 tabular-nums">
                    {summary.funnel.paymentAbandoned}
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="text-emerald-800">Cohort Seats</div>
                  <div className="font-display text-xl font-bold text-emerald-700 mt-1 tabular-nums">
                    {summary.cohort.enrolledSeats} / {summary.cohort.totalSeats}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-200 p-4">
                  <h3 className="font-bold text-zinc-900 mb-2">Section Visibility Reach:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.sectionReach).map(([sec, count]) => (
                      <div key={sec} className="flex justify-between border-b border-zinc-100 pb-1">
                        <span className="font-mono-tech text-zinc-700">#{sec}</span>
                        <span className="font-mono-tech font-bold text-zinc-950 tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 p-4">
                  <h3 className="font-bold text-zinc-900 mb-2">Scroll Depth & CTA Clicks:</h3>
                  <div className="space-y-1.5">
                    {Object.entries(summary.funnel.scrollReach).map(([depth, count]) => (
                      <div key={depth} className="flex justify-between border-b border-zinc-100 pb-1">
                        <span className="font-mono-tech text-zinc-700">Scroll {depth}</span>
                        <span className="font-mono-tech font-bold text-emerald-700 tabular-nums">
                          {count} visitors
                        </span>
                      </div>
                    ))}
                    {Object.entries(summary.funnel.ctaClicksByPlacement).map(([btn, count]) => (
                      <div key={btn} className="flex justify-between border-b border-zinc-100 pb-1">
                        <span className="font-mono-tech text-[#E8451A]">CTA: {btn}</span>
                        <span className="font-mono-tech font-bold text-zinc-950 tabular-nums">
                          {count} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="font-bold text-zinc-900 mb-2">Captured Leads & Paid Enrollments:</h3>
                {summary.registrations.length === 0 ? (
                  <p className="text-zinc-500">
                    No new test registrations yet (baseline 10/50 cohort seats active).
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-500">
                          <th className="py-2 pr-3">Name</th>
                          <th className="py-2 pr-3">Mobile</th>
                          <th className="py-2 pr-3">Status</th>
                          <th className="py-2 pr-3">Seat</th>
                          <th className="py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.registrations.map((r) => (
                          <tr key={r.id} className="border-b border-zinc-100">
                            <td className="py-2 pr-3 font-semibold text-zinc-900">{r.name}</td>
                            <td className="py-2 pr-3 font-mono-tech">{r.phone}</td>
                            <td className="py-2 pr-3">
                              <span
                                className={`rounded px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase ${
                                  r.status === "paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : r.status === "payment_abandoned"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="py-2 pr-3 font-mono-tech">
                              {r.seatNumber ? `#${r.seatNumber}` : "-"}
                            </td>
                            <td className="py-2 font-mono-tech">₹{r.totalInr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-zinc-200">
            <h3 className="font-bold text-white mb-2">
              Browser Session Meta Pixel Firing Log ({pixelEvents.length}):
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono-tech text-[11px]">
              {pixelEvents.map((ev, idx) => (
                <div key={`${ev.timestamp}-${idx}`} className="border-b border-zinc-800 pb-1">
                  <span className="text-emerald-400">[{ev.type.toUpperCase()}]</span>{" "}
                  <strong className="text-white">{ev.event}</strong>{" "}
                  {ev.eventId && <span className="text-orange-300">({ev.eventId})</span>}{" "}
                  {ev.params && <span className="text-zinc-400">{JSON.stringify(ev.params)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
