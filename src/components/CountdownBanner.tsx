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
      className={`rounded-2xl border border-[#B58338]/30 bg-white shadow-[0_14px_34px_rgba(34,25,29,0.05)] ${
        compact ? "p-3.5 space-y-3" : "p-4 sm:p-5 space-y-4"
      }`}
    >
      {/* Live Seat Progress */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="flex items-center gap-2 font-bold text-[#22191D]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1A6B54] animate-pulse" />
            <span>
              <span className="tabular-nums">{enrolledSeats}</span> Booked · Only{" "}
              <span className="text-[#6A244C] tabular-nums">{remaining} Seats Left</span>
            </span>
          </span>
          <span className="font-mono-tech text-xs font-semibold text-[#5E5056] tabular-nums">
            {enrolledSeats}/{totalSeats} Seats
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={enrolledSeats}
          aria-valuemin={0}
          aria-valuemax={totalSeats}
          aria-label="Booked seats"
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#FAF6F0]"
        >
          <div
            style={{ width: `${fillPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#6A244C] to-[#B58338] transition-all duration-500"
          />
        </div>
      </div>

      {/* Live Countdown to 12th December 2026 */}
      <div className="border-t border-[#6A244C]/10 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs mb-2">
          <span className="font-semibold text-[#5E5056]">
            Batch Starts: <strong className="text-[#6A244C]">12th December 2026</strong>
          </span>
          <span className="font-mono-tech text-[10px] font-semibold text-[#1A6B54]">
            TIME REMAINING
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {boxes.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center justify-center rounded-xl border border-[#B58338]/25 bg-[#FAF6F0] py-2 px-1"
            >
              <span className="font-luxury text-xl sm:text-2xl font-bold text-[#22191D] tabular-nums leading-none">
                {b.value}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5E5056] mt-1">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
