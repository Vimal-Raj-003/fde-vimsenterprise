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
              className={`relative overflow-hidden rounded-2xl p-4 text-left cursor-pointer transition-all ${
                isCurrent
                  ? "pm-card-featured"
                  : "pm-card opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-tech font-semibold text-[#047857]">
                <span>{sp.sprintCode}</span>
                <span className="text-[#6B7570]">{sp.weeksLabel}</span>
              </div>
              <div className="font-heading mt-1 text-lg sm:text-xl font-bold text-[#141A17] line-clamp-1">
                {sp.title}
              </div>
              {isCurrent && !paused && (
                <span
                  key={`bar-${active}`}
                  className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#059669] to-[#D97706] animate-carousel-progress"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="pm-card rounded-3xl p-6 sm:p-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-block rounded-full bg-[#ECFDF5] border border-[#047857]/20 px-3.5 py-1 font-mono-tech text-xs font-semibold text-[#047857]">
              {sprint.sprintCode} · {sprint.weeksLabel}
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#141A17] leading-snug">
              {sprint.title}
            </h3>
            <div className="rounded-xl border border-[#047857]/25 bg-[#ECFDF5] px-4 py-3 text-xs font-semibold text-[#065F46]">
              ✓ {sprint.output}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-2.5">
            {sprint.points.map((pt, i) => (
              <div
                key={pt}
                className="flex items-center gap-3.5 rounded-xl border border-[#047857]/12 bg-[#F8FAF9] px-4 py-3 text-sm font-medium text-[#141A17]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#047857] text-xs font-bold text-white">
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

/**
 * Highlighted 3D Glassy Automated Quotes Carousel ("What Students & Working Professionals Say").
 * Renders all 3 cards in true 3D perspective on md+ screens and crisp animated stack on mobile.
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
        className="hidden md:block relative h-[350px] w-full overflow-visible"
        style={{ perspective: "1400px" }}
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
                ? "translate3d(0px, 0px, 70px) rotateY(0deg) scale(1.03)"
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
                className={`glass-quote-card absolute w-full max-w-[540px] rounded-3xl p-8 overflow-hidden ${
                  isCenter ? "cursor-default" : "cursor-pointer hover:opacity-85"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="rounded-full border border-[#D97706]/35 bg-[#FEF3C7] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                    {review.tag}
                  </span>
                  <div className="flex items-center gap-0.5 text-[#D97706] text-sm" aria-label="5 out of 5 stars">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>

                <blockquote className="font-heading text-[21px] lg:text-[23px] font-semibold text-[#141A17] leading-[1.45]">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                <div className="mt-6 flex items-center justify-between border-t border-[#047857]/12 pt-4">
                  <div>
                    <div className="text-sm font-bold text-[#141A17]">{review.name}</div>
                    <div className="text-xs text-[#4B5550] mt-0.5">{review.role}</div>
                  </div>
                  <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#047857] bg-[#ECFDF5] border border-[#047857]/20 px-2.5 py-1 rounded-full">
                    Verified Learner
                  </span>
                </div>

                {isCenter && !paused && (
                  <span
                    key={`quote-sweep-${active}`}
                    className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#D97706] via-[#059669] to-[#047857] animate-carousel-progress"
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
                <span className="rounded-full border border-[#D97706]/35 bg-[#FEF3C7] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                  {current.tag}
                </span>
                <div className="text-[#D97706] text-xs" aria-label="5 out of 5 stars">★★★★★</div>
              </div>

              <blockquote className="font-heading text-lg font-semibold text-[#141A17] leading-[1.48]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <div className="mt-5 border-t border-[#047857]/12 pt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-[#141A17]">{current.name}</div>
                  <div className="text-xs text-[#4B5550]">{current.role}</div>
                </div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#047857] bg-[#ECFDF5] px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              {!paused && (
                <span
                  key={`mobile-quote-sweep-${active}`}
                  className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#D97706] to-[#047857] animate-carousel-progress"
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
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#047857]/25 bg-white text-sm font-bold text-[#047857] shadow-xs hover:border-[#047857] hover:bg-[#ECFDF5]"
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
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                idx === active ? "w-8 bg-[#047857]" : "w-2 bg-[#D97706]/40 hover:bg-[#D97706]/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next student quote"
          onClick={() => setActive((prev) => (prev + 1) % total)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#047857]/25 bg-white text-sm font-bold text-[#047857] shadow-xs hover:border-[#047857] hover:bg-[#ECFDF5]"
        >
          ›
        </button>
      </div>
    </div>
  );
}
