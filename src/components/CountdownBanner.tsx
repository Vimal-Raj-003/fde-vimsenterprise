import { useEffect, useState } from "react";

interface CountdownProps {
  startIso: string;
  endIso: string;
}

interface TimeParts {
  phase: "upcoming" | "active" | "closed";
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeParts(startIso: string, endIso: string): TimeParts {
  const now = Date.now();
  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();

  let targetMs = endMs;
  let phase: TimeParts["phase"] = "active";

  if (now < startMs) {
    phase = "upcoming";
    targetMs = startMs;
  } else if (now >= endMs) {
    phase = "closed";
    return { phase, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { phase, days, hours, minutes, seconds };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Shown EXCLUSIVELY inside the Registration Modal when the user clicks "Register Now".
 */
export function ModalCohortStatusPanel({
  startIso,
  endIso,
  enrolledSeats,
  totalSeats
}: CountdownProps & {
  enrolledSeats: number;
  totalSeats: number;
}) {
  const [time, setTime] = useState<TimeParts>(() => computeTimeParts(startIso, endIso));
  const remaining = Math.max(0, totalSeats - enrolledSeats);
  const fillPercent = Math.min(100, Math.round((enrolledSeats / totalSeats) * 100));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(computeTimeParts(startIso, endIso));
    }, 1000);
    return () => window.clearInterval(id);
  }, [startIso, endIso]);

  const boxes = [
    { value: pad2(time.days), label: "Days" },
    { value: pad2(time.hours), label: "Hours" },
    { value: pad2(time.minutes), label: "Mins" },
    { value: pad2(time.seconds), label: "Secs" }
  ];

  return (
    <div className="rounded-xl border border-[#D4AF7A]/28 bg-[#0B1310]/85 p-4 space-y-3.5">
      {/* Live 50-Seat Allocation Meter */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-2 font-medium text-[#F5F1E8]">
            <span className="h-2 w-2 rounded-full bg-[#52B788] animate-pulse" />
            Cohort Seat Availability ({totalSeats} Total)
          </span>
          <span className="font-mono-tech text-xs font-medium text-[#D4AF7A] tabular-nums">
            {enrolledSeats} Enrolled · {remaining} Seats Left
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={enrolledSeats}
          aria-valuemin={0}
          aria-valuemax={totalSeats}
          aria-label="Cohort seats filled"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F5F1E8]/10"
        >
          <div
            style={{ width: `${fillPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#C69C63] to-[#E5C594] transition-all duration-500"
          />
        </div>
      </div>

      {/* Live Countdown Window (Today 4:00 PM IST -> Next Tue 4:00 PM IST) */}
      <div className="pt-2.5 border-t border-[#F5F1E8]/10">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#B8B2A6] mb-2">
          <span>
            {time.phase === "upcoming"
              ? "Official Window Opens Today 4:00 PM IST (Early Access Active)"
              : time.phase === "active"
                ? "Registration Window Closes Next Tuesday 4:00 PM IST"
                : "Registration Window Closed"}
          </span>
          <span className="font-mono-tech text-[10px] text-[#D4AF7A]">
            NOV 24, 4 PM TO DEC 01, 4 PM
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {boxes.map((box) => (
            <div
              key={box.label}
              className="flex flex-col items-center justify-center rounded-lg border border-[#D4AF7A]/18 bg-[#121F1A] py-2 px-1.5"
            >
              <span className="font-luxury text-xl font-semibold text-[#F5F1E8] tabular-nums leading-none">
                {box.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#858075] mt-1">
                {box.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
