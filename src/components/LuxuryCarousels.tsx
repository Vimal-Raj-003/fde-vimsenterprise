import { useEffect, useState } from "react";
import { CURRICULUM_SPRINTS, STUDENT_REVIEWS } from "../data/fdeData";
import { Icon3D } from "./Icons3D";

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
      className="space-y-4"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {CURRICULUM_SPRINTS.map((sp, idx) => {
          const isCurrent = idx === active;
          return (
            <button
              key={sp.sprintCode}
              type="button"
              onClick={() => setActive(idx)}
              className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-left cursor-pointer hover:-translate-y-1 ${
                isCurrent
                  ? "surface-card-featured"
                  : "surface-card opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono-tech font-bold text-[var(--accent-gold)]">
                <span>{sp.sprintCode}</span>
                <span className="text-[var(--ink-muted)] font-semibold">{sp.daysLabel}</span>
              </div>
              <div className="font-heading mt-1.5 text-lg sm:text-xl font-bold text-[var(--ink-primary)] line-clamp-1">
                {sp.title}
              </div>
              {isCurrent && !paused && (
                <span
                  key={`bar-${active}`}
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-gold-deep), var(--accent-gold-bright))"
                  }}
                  className="absolute bottom-0 left-0 h-1 w-full animate-carousel-progress"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="surface-card rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          <div className="lg:col-span-5 space-y-3.5">
            <span className="inline-block rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3.5 py-1 font-mono-tech text-xs font-bold text-[var(--accent-gold)]">
              {sprint.sprintCode} · {sprint.daysLabel}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--ink-primary)] leading-snug">
              {sprint.title}
            </h3>
            <div className="rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-4 py-3 text-sm font-bold text-[var(--accent-gold)]">
              ✓ {sprint.output}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {sprint.points.map((pt) => (
              <div
                key={pt.text}
                className="group surface-well flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-[15px] sm:text-base font-medium text-[var(--ink-primary)] hover:translate-x-1"
              >
                <Icon3D name={pt.icon} size="sm" />
                <span>{pt.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Highlighted 3D Glassy Automated Quotes Carousel ("What Students & Working Professionals Say").
 */
export function AutomatedQuotesCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = STUDENT_REVIEWS.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 4200);
    return () => window.clearInterval(id);
  }, [paused, total]);

  function getSlot(index: number): -1 | 0 | 1 {
    const diff = (index - active + total) % total;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    return -1;
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      {/* Desktop 3D Revolving Glassy Stage */}
      <div
        className="hidden md:block relative h-[270px] w-full overflow-visible"
        style={{ perspective: "1450px" }}
      >
        <div
          className="relative h-full w-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {STUDENT_REVIEWS.map((review, idx) => {
            const slot = getSlot(idx);
            const isCenter = slot === 0;
            const transform =
              slot === 0
                ? "translate3d(0px, 0px, 75px) rotateY(0deg) scale(1.03)"
                : slot === -1
                  ? "translate3d(-58%, 12px, -95px) rotateY(22deg) scale(0.86)"
                  : "translate3d(58%, 12px, -95px) rotateY(-22deg) scale(0.86)";

            return (
              <article
                key={review.id}
                onClick={() => {
                  if (!isCenter) setActive(idx);
                }}
                style={{
                  transform,
                  zIndex: isCenter ? 30 : 10,
                  opacity: isCenter ? 1 : 0.62,
                  transition:
                    "transform 680ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease"
                }}
                className={`glass-quote-card absolute w-full max-w-[560px] rounded-3xl p-7 overflow-hidden ${
                  isCenter ? "cursor-default" : "cursor-pointer hover:opacity-90"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    {review.tag}
                  </span>
                  <div
                    className="flex items-center gap-0.5 text-[var(--accent-gold-bright)] text-base"
                    aria-label="5 out of 5 stars"
                  >
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>

                <blockquote className="font-heading text-[20px] lg:text-[22px] font-semibold text-[var(--ink-primary)] leading-[1.45]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
                  <div>
                    <div className="text-base font-bold text-[var(--ink-primary)]">{review.name}</div>
                    <div className="text-xs sm:text-sm text-[var(--ink-secondary)] mt-0.5">
                      {review.role}
                    </div>
                  </div>
                  <span className="font-mono-tech text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-gold)] bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3 py-1 rounded-full">
                    Verified Learner
                  </span>
                </div>

                {isCenter && !paused && (
                  <span
                    key={`quote-sweep-${active}`}
                    style={{
                      background:
                        "linear-gradient(90deg, var(--accent-gold-deep), var(--accent-gold-bright))"
                    }}
                    className="absolute bottom-0 left-0 h-1 w-full animate-carousel-progress"
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Mobile Full-Width Clean Animated Card */}
      <div className="md:hidden">
        {(() => {
          const current = STUDENT_REVIEWS[active]!;
          return (
            <article className="glass-quote-card relative overflow-hidden rounded-3xl p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                  {current.tag}
                </span>
                <div className="text-[var(--accent-gold-bright)] text-sm" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
              </div>

              <blockquote className="font-heading text-xl font-semibold text-[var(--ink-primary)] leading-[1.45]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-5 border-t border-[var(--border-subtle)] pt-3.5 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[var(--ink-primary)]">{current.name}</div>
                  <div className="text-xs text-[var(--ink-secondary)]">{current.role}</div>
                </div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-gold)] bg-[var(--pill-gold-bg)] px-2.5 py-1 rounded-full">
                  Verified
                </span>
              </div>

              {!paused && (
                <span
                  key={`mobile-quote-sweep-${active}`}
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-gold-deep), var(--accent-gold-bright))"
                  }}
                  className="absolute bottom-0 left-0 h-1 w-full animate-carousel-progress"
                />
              )}
            </article>
          );
        })()}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous student quote"
          onClick={() => setActive((prev) => (prev - 1 + total) % total)}
          className="btn-outline-3d flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base font-bold text-[var(--accent-gold)]"
        >
          ‹
        </button>

        <div className="flex items-center gap-2">
          {STUDENT_REVIEWS.map((r, idx) => (
            <button
              key={r.id}
              type="button"
              aria-label={`View quote from ${r.name}`}
              onClick={() => setActive(idx)}
              className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                idx === active
                  ? "w-8 bg-[var(--accent-gold)]"
                  : "w-2.5 bg-[var(--border-gold)] hover:opacity-90"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next student quote"
          onClick={() => setActive((prev) => (prev + 1) % total)}
          className="btn-outline-3d flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-base font-bold text-[var(--accent-gold)]"
        >
          ›
        </button>
      </div>
    </div>
  );
}
