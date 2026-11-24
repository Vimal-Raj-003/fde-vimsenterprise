import { useEffect, useState } from "react";

interface CountdownProps {
  targetIso: string;
  enrolledSeats: number;
  totalSeats: number;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetIso: string): TimeLeft {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function LiveSeatAndCountdownCard({
  targetIso,
  enrolledSeats,
  totalSeats,
  compact = false
}: CountdownProps) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(targetIso));
  const remaining = Math.max(0, totalSeats - enrolledSeats);
  const fillPercent = Math.min(100, Math.round((enrolledSeats / totalSeats) * 100));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(getTimeLeft(targetIso));
    }, 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  const boxes = [
    { value: pad2(time.days), label: "Days" },
    { value: pad2(time.hours), label: "Hours" },
    { value: pad2(time.minutes), label: "Mins" },
    { value: pad2(time.seconds), label: "Secs" }
  ];

  return (
    <div
      className={`rounded-2xl border border-blue-100 bg-white shadow-xs ${
        compact ? "p-3.5 space-y-3" : "p-4 sm:p-5 space-y-4"
      }`}
    >
      {/* Live Seat Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="flex items-center gap-2 font-bold text-slate-900">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <span className="tabular-nums">{enrolledSeats}</span> Booked · Only{" "}
              <span className="text-blue-700 tabular-nums">{remaining} Seats Left</span>
            </span>
          </span>
          <span className="font-mono-tech text-xs font-semibold text-slate-500 tabular-nums">
            {enrolledSeats}/{totalSeats} Seats
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={enrolledSeats}
          aria-valuemin={0}
          aria-valuemax={totalSeats}
          aria-label="Booked seats"
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        >
          <div
            style={{ width: `${fillPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500"
          />
        </div>
      </div>

      {/* Live Countdown to Dec 12 Class */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs mb-2">
          <span className="font-semibold text-slate-700">
            Batch Starts: <strong className="text-blue-700">12th December 2026</strong>
          </span>
          <span className="font-mono-tech text-[11px] font-semibold text-emerald-700">
            TIME REMAINING
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {boxes.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/80 py-2 px-1"
            >
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tabular-nums leading-none">
                {b.value}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-1">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
