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
      className={`surface-card-featured rounded-2xl ${
        compact ? "p-3.5 space-y-3" : "p-4 sm:p-5 space-y-4"
      }`}
    >
      {/* Live Seat Progress */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2 font-bold text-[var(--ink-primary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-gold-bright)] animate-pulse" />
            <span>
              <span className="tabular-nums">{enrolledSeats}</span> Booked · Only{" "}
              <span className="text-[var(--accent-gold)] tabular-nums">
                {remaining} Seats Left
              </span>
            </span>
          </span>
          <span className="font-mono-tech text-xs font-semibold text-[var(--ink-secondary)] tabular-nums">
            {enrolledSeats}/{totalSeats} Seats
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={enrolledSeats}
          aria-valuemin={0}
          aria-valuemax={totalSeats}
          aria-label="Booked seats"
          className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-well)]"
        >
          <div
            style={{
              width: `${fillPercent}%`,
              background: "linear-gradient(90deg, var(--accent-gold-deep), var(--accent-gold-bright))"
            }}
            className="h-full rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Live Countdown to 12th December 2026 */}
      <div className="border-t border-[var(--border-subtle)] pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm mb-2.5">
          <span className="font-semibold text-[var(--ink-secondary)]">
            Batch Starts:{" "}
            <strong className="text-[var(--accent-gold)]">12th December 2026</strong>
          </span>
          <span className="font-mono-tech text-[10px] font-bold tracking-wider text-[var(--accent-gold)] bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-2.5 py-0.5 rounded-full">
            TIME REMAINING
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {boxes.map((b) => (
            <div
              key={b.label}
              className="surface-well flex flex-col items-center justify-center rounded-xl py-2.5 px-1 hover:-translate-y-0.5"
            >
              <span className="font-heading text-2xl sm:text-[26px] font-bold text-[var(--ink-primary)] tabular-nums leading-none">
                {b.value}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)] mt-1">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
