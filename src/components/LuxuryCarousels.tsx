import { useEffect, useState } from "react";
import { CURRICULUM_SPRINTS, STUDENT_REVIEWS } from "../data/fdeData";

export function AutomatedCurriculumCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % CURRICULUM_SPRINTS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const sprint = CURRICULUM_SPRINTS[active]!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="space-y-5"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CURRICULUM_SPRINTS.map((sp, idx) => {
          const isCurrent = idx === active;
          return (
            <button
              key={sp.sprintCode}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative overflow-hidden rounded-xl p-4 text-left cursor-pointer transition-all ${
                isCurrent
                  ? "light-card-featured"
                  : "light-card opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-tech font-bold text-blue-700">
                <span>{sp.sprintCode}</span>
                <span className="text-slate-500">{sp.weeksLabel}</span>
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900 line-clamp-1">{sp.title}</div>
              {isCurrent && !paused && (
                <span
                  key={`bar-${active}`}
                  className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 animate-carousel-progress"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="light-card rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-2.5">
            <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-1 font-mono-tech text-xs font-bold text-blue-700">
              {sprint.sprintCode} · {sprint.weeksLabel}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{sprint.title}</h3>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs font-bold text-emerald-900">
              ✓ {sprint.output}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-2.5">
            {sprint.points.map((pt, i) => (
              <div
                key={pt}
                className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm font-medium text-slate-800"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {i + 1}
                </span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AutomatedQuotesCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % STUDENT_REVIEWS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = STUDENT_REVIEWS[active]!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="light-card-featured rounded-2xl p-6 sm:p-9"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          Verified Learner Review
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() =>
              setActive((prev) => (prev - 1 + STUDENT_REVIEWS.length) % STUDENT_REVIEWS.length)
            }
            className="h-8 w-8 cursor-pointer rounded-full border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-700"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => setActive((prev) => (prev + 1) % STUDENT_REVIEWS.length)}
            className="h-8 w-8 cursor-pointer rounded-full border border-slate-200 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-700"
          >
            ›
          </button>
        </div>
      </div>

      <blockquote className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
        &ldquo;{current.quote}&rdquo;
      </blockquote>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <div className="text-sm font-bold text-slate-900">{current.name}</div>
          <div className="text-xs text-slate-500">{current.role}</div>
        </div>
        <div className="flex gap-1.5">
          {STUDENT_REVIEWS.map((r, idx) => (
            <button
              key={r.id}
              type="button"
              aria-label={`Review ${idx + 1}`}
              onClick={() => setActive(idx)}
              className={`h-2 cursor-pointer rounded-full transition-all ${
                idx === active ? "w-7 bg-blue-600" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
