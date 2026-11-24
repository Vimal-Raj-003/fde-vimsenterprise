import { useEffect, useRef, useState } from "react";
import {
  CURRICULUM_SPRINTS,
  SHOWCASE_SYSTEMS,
  STUDENT_REVIEWS
} from "../data/fdeData";
import { Tilt3DCard } from "./Spatial3DCanvas";

/**
 * Subtle Champagne & Jade Signal Waveform inside the Hero Showcase Card
 */
function LuxurySignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = performance.now();
    let phase = 0;

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width < 20 || height < 20) return;
      phase += dt * 1.9;

      // Secondary champagne harmonic wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const y =
          height * 0.52 +
          Math.sin(x * 0.028 - phase * 0.9) * 8 +
          Math.cos(x * 0.014 - phase * 0.45) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(212, 175, 122, 0.36)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Primary jade telemetry wave
      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const y =
          height * 0.5 +
          Math.sin(x * 0.036 - phase * 1.35) * 10 * Math.sin(x * 0.008 + 0.6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(82, 183, 136, 0.85)";
      ctx.lineWidth = 1.7;
      ctx.stroke();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) paint(0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (!reducedMotion) {
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        paint(dt);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="rounded-xl border border-[#D4AF7A]/15 bg-[#09100D]/75 px-3.5 py-2.5">
      <div className="flex items-center justify-between text-[10px] font-mono-tech text-[#B8B2A6] mb-1">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#52B788] animate-pulse" />
          PRODUCTION TELEMETRY
        </span>
        <span className="text-[#D4AF7A]">VERIFIED SLA</span>
      </div>
      <div className="h-11 w-full">
        <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full block" />
      </div>
    </div>
  );
}

/**
 * 1. Automated Classic 3D Showcase Carousel (Hero / Production Systems)
 */
export function ProductionSystemsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SHOWCASE_SYSTEMS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  const item = SHOWCASE_SYSTEMS[active]!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <Tilt3DCard maxTiltDeg={4} className="rounded-2xl">
        <div className="luxury-card-elevated rounded-2xl p-6 sm:p-7">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#F5F1E8]/10">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-tech text-xs text-[#D4AF7A]">
                SYSTEM {item.numeral} / 0{SHOWCASE_SYSTEMS.length}
              </span>
              <span className="text-[#F5F1E8]/20">·</span>
              <span className="text-xs font-medium tracking-wide text-[#B8B2A6]">
                {item.domain}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous architecture slide"
                onClick={() =>
                  setActive((prev) => (prev - 1 + SHOWCASE_SYSTEMS.length) % SHOWCASE_SYSTEMS.length)
                }
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D4AF7A]/25 bg-[#0B1310]/60 text-xs text-[#F5F1E8] transition-colors hover:border-[#D4AF7A] hover:text-[#D4AF7A]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next architecture slide"
                onClick={() => setActive((prev) => (prev + 1) % SHOWCASE_SYSTEMS.length)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D4AF7A]/25 bg-[#0B1310]/60 text-xs text-[#F5F1E8] transition-colors hover:border-[#D4AF7A] hover:text-[#D4AF7A]"
              >
                ›
              </button>
            </div>
          </div>

          {/* Slide Body */}
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="font-luxury text-2xl sm:text-[26px] font-semibold text-[#F5F1E8] leading-snug">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#B8B2A6] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* 4 Architecture Stages */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {item.architecture.map((stage, idx) => (
                <div
                  key={stage}
                  className="rounded-xl border border-[#F5F1E8]/8 bg-[#0B1310]/55 px-3.5 py-2.5"
                >
                  <div className="font-mono-tech text-[10px] text-[#D4AF7A]">0{idx + 1}</div>
                  <div className="mt-0.5 text-xs font-medium text-[#F5F1E8]">{stage}</div>
                </div>
              ))}
            </div>

            <LuxurySignalCanvas />

            {/* Metrics Footer */}
            <div className="grid grid-cols-3 gap-3 pt-1 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#858075]">Latency</div>
                <div className="font-mono-tech text-xs sm:text-sm font-medium text-[#52B788] mt-0.5 tabular-nums">
                  {item.metrics.latency}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#858075]">Benchmark</div>
                <div className="font-mono-tech text-xs sm:text-sm font-medium text-[#F5F1E8] mt-0.5 tabular-nums">
                  {item.metrics.reliability}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#858075]">Target</div>
                <div className="font-mono-tech text-xs sm:text-sm font-medium text-[#D4AF7A] mt-0.5">
                  {item.metrics.deployment}
                </div>
              </div>
            </div>
          </div>

          {/* Automated Progress Indicator Pills */}
          <div className="mt-5 grid grid-cols-5 gap-2" role="tablist" aria-label="Select architecture">
            {SHOWCASE_SYSTEMS.map((s, idx) => {
              const isCurrent = idx === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Slide ${idx + 1}: ${s.title}`}
                  onClick={() => setActive(idx)}
                  className="group relative h-6 flex items-center cursor-pointer focus:outline-none"
                >
                  <span className="h-1 w-full overflow-hidden rounded-full bg-[#F5F1E8]/12">
                    {isCurrent && !paused && (
                      <span
                        key={`${active}-running`}
                        className="block h-full w-full bg-[#D4AF7A] animate-carousel-progress"
                      />
                    )}
                    {isCurrent && paused && (
                      <span className="block h-full w-full bg-[#D4AF7A]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Tilt3DCard>
    </div>
  );
}

/**
 * 2. Automated 8-Week Curriculum Carousel
 */
export function AutomatedCurriculumCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % CURRICULUM_SPRINTS.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  const sprint = CURRICULUM_SPRINTS[active]!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="space-y-6"
    >
      {/* Horizontal Phase Selector Strip */}
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
                  ? "luxury-card-elevated"
                  : "luxury-card opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#D4AF7A]">
                <span>{sp.sprintCode}</span>
                <span className="text-[#B8B2A6]">{sp.weeksLabel}</span>
              </div>
              <div className="font-luxury mt-1.5 text-lg font-semibold text-[#F5F1E8] line-clamp-1">
                {sp.title}
              </div>
              {isCurrent && !paused && (
                <span
                  key={`sprint-bar-${active}`}
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-[#D4AF7A] animate-carousel-progress"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Sprint Detailed Card */}
      <div className="luxury-card rounded-2xl p-6 sm:p-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="font-mono-tech text-xs tracking-widest text-[#D4AF7A]">
              {sprint.sprintCode} · {sprint.weeksLabel.toUpperCase()}
            </div>
            <h3 className="font-luxury text-2xl sm:text-3xl font-semibold text-[#F5F1E8] leading-snug">
              {sprint.title}
            </h3>
            <p className="text-sm text-[#B8B2A6] leading-relaxed">{sprint.summary}</p>
            <div className="pt-2">
              <div className="rounded-xl border border-[#D4AF7A]/25 bg-[#D4AF7A]/8 p-4">
                <div className="font-mono-tech text-[10px] uppercase tracking-widest text-[#D4AF7A]">
                  Verified Deliverable
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#F5F1E8]">
                  {sprint.deliverable}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs uppercase tracking-widest text-[#858075] mb-2">
              Core Engineering Modules
            </div>
            {sprint.topics.map((topic, i) => (
              <div
                key={topic}
                className="flex items-start gap-3.5 rounded-xl border border-[#F5F1E8]/8 bg-[#0B1310]/45 px-4 py-3 text-sm text-[#F5F1E8]/90"
              >
                <span className="font-mono-tech text-xs text-[#D4AF7A] mt-0.5">0{i + 1}</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Classic Automated Editorial Quotes & Reflections Carousel
 */
export function AutomatedQuotesCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % STUDENT_REVIEWS.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = STUDENT_REVIEWS[active]!;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="luxury-card-elevated rounded-2xl p-7 sm:p-11 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <span className="rounded-full border border-[#D4AF7A]/30 bg-[#D4AF7A]/10 px-3.5 py-1 text-xs font-medium text-[#D4AF7A]">
          {current.tag}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous reflection"
            onClick={() =>
              setActive((prev) => (prev - 1 + STUDENT_REVIEWS.length) % STUDENT_REVIEWS.length)
            }
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF7A]/25 text-sm text-[#F5F1E8] hover:border-[#D4AF7A] hover:text-[#D4AF7A]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next reflection"
            onClick={() => setActive((prev) => (prev + 1) % STUDENT_REVIEWS.length)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D4AF7A]/25 text-sm text-[#F5F1E8] hover:border-[#D4AF7A] hover:text-[#D4AF7A]"
          >
            ›
          </button>
        </div>
      </div>

      <blockquote className="font-luxury italic text-2xl sm:text-3xl text-[#F5F1E8] leading-[1.45] max-w-4xl">
        &ldquo;{current.quote}&rdquo;
      </blockquote>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#F5F1E8]/10">
        <div>
          <div className="text-sm font-semibold text-[#F5F1E8]">{current.name}</div>
          <div className="text-xs text-[#B8B2A6] mt-0.5">{current.role}</div>
        </div>

        <div className="flex items-center gap-2">
          {STUDENT_REVIEWS.map((rev, idx) => (
            <button
              key={rev.id}
              type="button"
              aria-label={`View quote from ${rev.name}`}
              onClick={() => setActive(idx)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                idx === active ? "w-8 bg-[#D4AF7A]" : "w-2 bg-[#F5F1E8]/25 hover:bg-[#F5F1E8]/45"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
