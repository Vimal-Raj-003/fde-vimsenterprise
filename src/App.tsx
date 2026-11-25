import { useEffect, useState } from "react";
import { LiveSeatAndCountdownCard } from "./components/CountdownBanner";
import FunnelInspectorModal from "./components/FunnelInspectorModal";
import { Icon3D } from "./components/Icons3D";
import {
  AutomatedCurriculumCarousel,
  AutomatedQuotesCarousel
} from "./components/LuxuryCarousels";
import OwnerAdminPage from "./components/OwnerAdminPage";
import RegistrationModal from "./components/RegistrationModal";
import { FullPageLuxuryCanvas, Reveal3D, Tilt3DCard } from "./components/Spatial3DCanvas";
import {
  CLASS_SCHEDULE,
  CLIENT_LOGOS,
  FAQ_ITEMS,
  MENTORS,
  RAPID_MASTERY_STEPS,
  VISUAL_PROJECTS
} from "./data/fdeData";
import {
  initMetaPixels,
  trackRegisterCtaClick,
  trackScrollMilestone,
  trackSectionReached
} from "./lib/pixel";

interface CohortStatus {
  totalSeats: number;
  seedSeats: number;
  confirmedNewCount: number;
  enrolledSeats: number;
  remainingSeats: number;
  isSoldOut: boolean;
  pricing: {
    baseInr: number;
    gstPercent: number;
    gstInr: number;
    totalInr: number;
    totalPaise: number;
  };
  window: {
    startIso: string;
    endIso: string;
  };
  paymentMode: string;
}

const DEFAULT_COHORT: CohortStatus = {
  totalSeats: 50,
  seedSeats: 10,
  confirmedNewCount: 0,
  enrolledSeats: 10,
  remainingSeats: 40,
  isSoldOut: false,
  pricing: {
    baseInr: 2,
    gstPercent: 0,
    gstInr: 0,
    totalInr: 2,
    totalPaise: 200
  },
  window: {
    startIso: (import.meta.env.VITE_REG_START_ISO as string) || "2026-11-24T16:00:00+05:30",
    endIso: (import.meta.env.VITE_REG_END_ISO as string) || CLASS_SCHEDULE.targetIso
  },
  paymentMode: "razorpay_live"
};

export default function App() {
  const isAdminRoute =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/admin";

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    }
    return "light";
  });

  const [cohort, setCohort] = useState<CohortStatus>(DEFAULT_COHORT);
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const priceLabel =
    cohort.pricing.gstPercent > 0
      ? `₹${cohort.pricing.baseInr.toLocaleString("en-IN")} + GST`
      : `₹${cohort.pricing.baseInr.toLocaleString("en-IN")}`;

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("vims_fde_theme", next);
    } catch {
      // ignore storage errors
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAdminRoute) return;
    initMetaPixels(DEFAULT_COHORT.pricing.baseInr);

    const params = new URLSearchParams(window.location.search);
    if (params.get("inspector") === "1") {
      setInspectorOpen(true);
    }

    async function fetchCohort() {
      try {
        const res = await fetch("/api/fde/cohort-status");
        if (!res.ok) return;
        const data = (await res.json()) as CohortStatus;
        setCohort({
          ...data,
          window: {
            ...data.window,
            endIso: CLASS_SCHEDULE.targetIso
          }
        });
      } catch {
        // Graceful fallback
      }
    }

    void fetchCohort();
    const pollId = window.setInterval(fetchCohort, 15000);
    return () => window.clearInterval(pollId);
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) return;
    const sectionIds = [
      "overview",
      "fast-mastery",
      "projects",
      "curriculum",
      "credibility",
      "mentors",
      "reviews",
      "faq"
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            trackSectionReached(entry.target.id);
          }
        }
      },
      { threshold: 0.25 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (scrollTop / docHeight) * 100;
      if (pct >= 25) trackScrollMilestone(25);
      if (pct >= 50) trackScrollMilestone(50);
      if (pct >= 75) trackScrollMilestone(75);
      if (pct >= 96) trackScrollMilestone(100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <OwnerAdminPage theme={theme} onToggleTheme={toggleTheme} />;
  }

  function openRegisterModal(placement: string) {
    trackRegisterCtaClick(placement, cohort.remainingSeats);
    setModalOpen(true);
  }

  return (
    <div id="top" className="relative min-h-screen text-[var(--ink-primary)]">
      {/* INTERACTIVE 3D GEOMETRY & DEPTH CANVAS */}
      <FullPageLuxuryCanvas theme={theme} />

      {/* HIGH-TRUST TOP ANNOUNCEMENT STRIP */}
      <div
        style={{ backgroundColor: "var(--bg-strip)", color: "var(--ink-strip)" }}
        className="relative z-40 px-3 sm:px-4 py-2 text-center text-[11px] sm:text-[13px] font-semibold border-b border-[var(--border-gold)]"
      >
        <span style={{ color: "#E3B452" }}>Award-Winning VIMS Academy</span> ·{" "}
        <strong>12th Dec நேரடி வகுப்பு</strong> · மீதமுள்ள இடங்கள்:{" "}
        <span style={{ color: "#E3B452" }} className="underline tabular-nums">
          {cohort.remainingSeats}
        </span>
      </div>

      {/* MOBILE-SAFE NAV-FREE HEADER (ICON-ONLY THEME TOGGLE + FULL VISIBLE CTA ON 360px+) */}
      <header
        style={{ backgroundColor: "var(--bg-header)" }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-[var(--border-subtle)]"
      >
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex min-w-0 items-center gap-2 sm:gap-3 group">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Academy Logo"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="min-w-0 leading-tight">
              <div className="font-heading text-[16px] sm:text-2xl font-bold tracking-tight text-[var(--ink-primary)] whitespace-nowrap">
                VIMS <span className="text-[var(--accent-gold)]">Academy</span>
              </div>
              <div className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                Forward Deployment Program
              </div>
            </div>
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              data-testid="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
              aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
              className="btn-outline-3d inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full"
            >
              {theme === "light" ? (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--accent-gold)]"
                  aria-hidden="true"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--accent-gold)]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => openRegisterModal("header_cta")}
              className="btn-gold-3d inline-flex min-h-9 sm:min-h-10 shrink-0 cursor-pointer items-center rounded-full px-3.5 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap"
            >
              Register Now
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE-FIRST HIGH-CONVERTING LANDING FLOW */}
      <main className="relative z-10 space-y-12 sm:space-y-14 lg:space-y-16 pt-6 sm:pt-10 pb-14">
        {/* 1. HERO: SOLVE REAL-WORLD PROBLEMS + TAMIL CLARITY + REGISTER NOW CTA */}
        <section id="overview" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[var(--bg-surface)] px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-[var(--ink-primary)] shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent-gold-bright)]" />
                <span>
                  1-Week Intensive · Students &amp; Working Pros ·{" "}
                  <span className="text-[var(--accent-gold)]">நேரடி தமிழ் வகுப்பு</span>
                </span>
              </div>

              <h1 className="font-heading text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold tracking-tight text-[var(--ink-primary)] leading-[1.08]">
                Become a{" "}
                <span className="text-[var(--accent-gold)]">
                  Forward Deployment Engineer (FDE)
                </span>{" "}
                &amp; Solve Real-World Problems.
              </h1>

              {/* Scannable Bullet Points */}
              <ul className="space-y-2.5 text-[15px] sm:text-[17px] text-[var(--ink-secondary)] max-w-2xl">
                {[
                  <>
                    Master <strong className="text-[var(--ink-primary)]">LLMs, RAG, AI Agents</strong>{" "}
                    &amp; Cloud{" "}
                    <span className="font-semibold text-[var(--accent-gold)]">
                      (அடிப்படை முதல் தெளிவாக தமிழ்லயே கத்துக்கலாம்!)
                    </span>
                  </>,
                  <>
                    <strong className="text-[var(--ink-primary)]">முதல் 2 நாட்களில் தெளிவு:</strong>{" "}
                    Build Live API &amp; AI systems step-by-step from zero
                  </>,
                  <>
                    <strong className="text-[var(--ink-primary)]">1-Week Outcome:</strong>{" "}
                    Deployed GitHub Portfolio &amp; VIMS Academy சான்றிதழ்
                  </>
                ].map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    >
                      ✓
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => openRegisterModal("hero_cta")}
                  className="btn-gold-3d inline-flex min-h-13 sm:min-h-14 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full px-6 sm:px-9 py-3 text-[15px] sm:text-lg font-bold"
                >
                  Register Now · {priceLabel}
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Elevated 3D Cohort Snapshot Card */}
            <div className="lg:col-span-5">
              <Tilt3DCard maxTiltDeg={3} className="rounded-3xl">
                <div className="surface-card-featured rounded-3xl p-4 sm:p-6 space-y-4">
                  <LiveSeatAndCountdownCard
                    targetIso={CLASS_SCHEDULE.targetIso}
                    enrolledSeats={cohort.enrolledSeats}
                    totalSeats={cohort.totalSeats}
                    compact
                  />

                  <div className="space-y-2.5 pt-1">
                    {[
                      {
                        icon: "calendar" as const,
                        title: "தொடங்கும் நாள்: 12th December 2026",
                        sub: "சனிக்கிழமை காலை 10:00 AM IST · Live Online"
                      },
                      {
                        icon: "language" as const,
                        title: "நேரடி தமிழ் பயிற்சி (Live Class)",
                        sub: "புரியாத வார்த்தைகள் இல்லை, எளிமையாகக் கற்றுக்கொள்ளலாம்"
                      },
                      {
                        icon: "award" as const,
                        title: "VIMS Academy சான்றிதழ் & GitHub Projects",
                        sub: "Full HD recordings மற்றும் source code இலவசம்"
                      }
                    ].map((row) => (
                      <div
                        key={row.title}
                        className="group surface-well flex items-center gap-3.5 rounded-2xl px-3.5 sm:px-4 py-3"
                      >
                        <Icon3D name={row.icon} size="sm" />
                        <div className="min-w-0">
                          <div className="text-sm sm:text-[15px] font-bold text-[var(--ink-primary)] leading-snug">
                            {row.title}
                          </div>
                          <div className="text-xs text-[var(--ink-secondary)]">{row.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tilt3DCard>
            </div>
          </div>
        </section>

        {/* 2. FIRST-2-DAYS RAPID MASTERY TRUST BLUEPRINT */}
        <section id="fast-mastery" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center max-w-5xl mx-auto mb-7">
              <span className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3.5 py-1 rounded-full">
                WHY LEARNERS SUCCEED SO FAST
              </span>
              <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] xl:text-[40px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-3">
                Master Core FDE Skills in the First 2 Days
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {RAPID_MASTERY_STEPS.map((step, idx) => (
                <Tilt3DCard key={step.dayLabel} maxTiltDeg={6} className="rounded-3xl h-full">
                  <article
                    className={`group h-full rounded-3xl p-5 sm:p-7 flex flex-col justify-between ${
                      idx === 1 ? "surface-card-featured" : "surface-card"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <Icon3D name={step.icon} size="md" />
                        <div className="text-right">
                          <div className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                            {step.dayLabel}
                          </div>
                          <div className="text-xs font-semibold text-[var(--ink-muted)]">
                            {step.phase}
                          </div>
                        </div>
                      </div>

                      <h3 className="font-heading mt-4 text-xl sm:text-2xl font-bold text-[var(--ink-primary)]">
                        {step.title}
                      </h3>

                      <ul className="mt-3 space-y-2 text-sm sm:text-[15px] text-[var(--ink-secondary)]">
                        {step.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2">
                            <span className="font-bold text-[var(--accent-gold)]">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[var(--accent-gold)]">
                      ✓ {step.milestone}
                    </div>
                  </article>
                </Tilt3DCard>
              ))}
            </div>

            {/* STRATEGIC MID-PAGE CTA #1 */}
            <div className="mt-7 surface-card-featured rounded-2xl p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="font-heading text-lg sm:text-xl font-bold text-[var(--ink-primary)]">
                  2 நாட்களிலேயே முழு தெளிவு · உங்கள் AI பயணத்தை இன்றே தொடங்குங்கள்
                </div>
                <div className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                  12th December நேரடி வகுப்பு · மீதமுள்ள இடங்கள்: {cohort.remainingSeats} மட்டுமே
                </div>
              </div>
              <button
                type="button"
                onClick={() => openRegisterModal("post_mastery_cta")}
                className="btn-gold-3d inline-flex min-h-11 w-full sm:w-auto shrink-0 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-bold whitespace-nowrap"
              >
                Book Your Seat Now
              </button>
            </div>
          </Reveal3D>
        </section>

        {/* 3. REAL-TIME PRODUCTION SCREENSHOTS & ARCHITECTURE GALLERY */}
        <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center max-w-5xl mx-auto mb-7">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                நீங்கள் நேரடியாக கற்று உருவாக்குபவை
              </span>
              <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] xl:text-[40px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                What You Will Build &amp; Deploy Live
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {VISUAL_PROJECTS.map((card) => (
                <Tilt3DCard key={card.id} maxTiltDeg={5.5} className="rounded-2xl h-full">
                  <article className="surface-card h-full rounded-2xl overflow-hidden flex flex-col">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-white p-2 border-b border-[var(--border-subtle)] flex items-center justify-center">
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-103"
                      />
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      <span className="self-start inline-block rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3 py-0.5 text-xs font-bold text-[var(--accent-gold)]">
                        {card.tag}
                      </span>
                      <h3 className="font-heading mt-2.5 text-xl font-bold text-[var(--ink-primary)]">
                        {card.title}
                      </h3>
                      <ul className="mt-2 space-y-1.5 text-sm text-[var(--ink-secondary)]">
                        {card.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2">
                            <span className="font-bold text-[var(--accent-gold)]">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Tilt3DCard>
              ))}
            </div>
          </Reveal3D>
        </section>

        {/* 4. AUTOMATED 1-WEEK SYLLABUS CAROUSEL (TAMIL + SCULPTED 3D ICONS + CTA #2) */}
        <section id="curriculum" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                  1 வாரம் · நாள் வாரியான பயிற்சி அட்டவணை
                </span>
                <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] xl:text-[40px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                  1-Week Day-by-Day Practical Roadmap
                </h2>
              </div>
              <span className="rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-4 py-1.5 text-xs sm:text-sm font-bold text-[var(--accent-gold)]">
                முதல் 2 நாட்களில் முழு தெளிவு
              </span>
            </div>

            <AutomatedCurriculumCarousel />

            {/* STRATEGIC MID-PAGE CTA #2 */}
            <div className="mt-7 surface-card-featured rounded-2xl p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="font-heading text-lg sm:text-xl font-bold text-[var(--ink-primary)]">
                  1 வாரத்தில் உங்கள் முதல் Live AI ப்ராஜெக்டை Deploy செய்யத் தயாரா?
                </div>
                <div className="text-xs sm:text-sm text-[var(--ink-secondary)]">
                  தமிழ் நேரலை வழிகாட்டல் + HD Recordings + Source Code உடனே கிடைக்கும்
                </div>
              </div>
              <button
                type="button"
                onClick={() => openRegisterModal("post_curriculum_cta")}
                className="btn-gold-3d inline-flex min-h-11 w-full sm:w-auto shrink-0 cursor-pointer items-center justify-center rounded-full px-6 text-sm font-bold whitespace-nowrap"
              >
                Register Now · {priceLabel}
              </button>
            </div>
          </Reveal3D>
        </section>

        {/* 5. INSTITUTIONAL PROOF & AWARD-WINNING CREDIBILITY */}
        <section id="credibility" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="surface-card rounded-3xl p-5 sm:p-9">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
                  <Tilt3DCard maxTiltDeg={4} className="rounded-2xl">
                    <figure className="overflow-hidden rounded-2xl border border-[var(--border-gold)]">
                      <img
                        src="/images/vims-award-tn-digital-summit.jpg"
                        alt="VIMS Academy winning Social Eagle Award at TN Digital Summit 2026"
                        loading="lazy"
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <figcaption className="bg-[var(--bg-well)] px-4 py-3 text-xs sm:text-sm font-bold text-[var(--ink-primary)] flex justify-between">
                        <span>TN Digital Summit 2026 · Social Eagle Award</span>
                        <span className="text-[var(--accent-gold)]">VIMS Academy</span>
                      </figcaption>
                    </figure>
                  </Tilt3DCard>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <span className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    TRUSTED &amp; AWARD-WINNING INSTITUTION
                  </span>
                  <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] font-bold text-[var(--ink-primary)] leading-tight">
                    Backed by Award-Winning VIMS Academy
                  </h2>

                  <ul className="space-y-2.5 text-[15px] sm:text-base text-[var(--ink-secondary)]">
                    {[
                      <>
                        Winner of the{" "}
                        <strong className="text-[var(--ink-primary)]">
                          Social Eagle Award at TN Digital Summit 2026
                        </strong>
                      </>,
                      <>
                        அனுபவமிக்க பொறியாளர்கள் நேரடியாக{" "}
                        <strong className="text-[var(--ink-primary)]">தமிழ்</strong>-இல்
                        பயிற்சி அளிக்கிறார்கள்
                      </>,
                      <>
                        Production training proven across{" "}
                        <a
                          href="https://embskills.vimsenterprise.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[var(--accent-gold)] underline"
                        >
                          embskills.vimsenterprise.com
                        </a>{" "}
                        and VIMS Academy
                      </>
                    ].map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-bold text-[var(--accent-gold)]">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-3">
                      Trusted by Industry Partners
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 items-center">
                      {CLIENT_LOGOS.map((logo) => (
                        <div
                          key={logo.name}
                          className="flex h-12 sm:h-13 items-center justify-center rounded-xl border border-[var(--border-gold)] bg-white p-2 shadow-xs transition-transform duration-200 hover:-translate-y-1"
                        >
                          <img
                            src={logo.src}
                            alt={logo.name}
                            loading="lazy"
                            className="max-h-6 sm:max-h-7 w-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal3D>
        </section>

        {/* 6. YOUR MENTORS: FULL-FRAME STUDIO PORTRAITS */}
        <section id="mentors" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center max-w-5xl mx-auto mb-8">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                வழிகாட்டும் வல்லுநர்கள்
              </span>
              <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] xl:text-[40px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                Guided by Real Industry Practitioners
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
              {MENTORS.map((m) => (
                <Tilt3DCard key={m.id} maxTiltDeg={6} className="rounded-3xl h-full">
                  <article className="surface-card h-full rounded-3xl overflow-hidden text-center p-5 flex flex-col items-center">
                    <div className="relative mx-auto aspect-[4/5] w-full max-w-[250px] overflow-hidden rounded-2xl border border-[var(--border-gold)] bg-[var(--bg-well)]">
                      <img
                        src={m.photo}
                        alt={m.name}
                        decoding="sync"
                        className="absolute inset-0 block h-full w-full object-cover object-[50%_15%] transition-transform duration-500 hover:scale-104"
                      />
                    </div>

                    <span className="mt-4 inline-block rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3.5 py-0.5 text-xs font-bold text-[var(--accent-gold)]">
                      {m.badge}
                    </span>
                    <h3 className="font-heading mt-2 text-2xl font-bold text-[var(--ink-primary)]">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[var(--ink-secondary)]">
                      {m.simpleLine}
                    </p>
                  </article>
                </Tilt3DCard>
              ))}
            </div>
          </Reveal3D>
        </section>

        {/* 7. HIGHLIGHTED 3D GLASSY AUTOMATED QUOTES SHOWCASE + MID-PAGE CTA #3 */}
        <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="reviews-showcase-frame rounded-[32px] px-4 sm:px-8 py-9 sm:py-12">
              <div className="text-center max-w-5xl mx-auto mb-7 space-y-2">
                <span className="inline-block rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-4 py-1 font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                  மாணவர்கள் &amp; பொறியாளர்களின் கருத்துக்கள்
                </span>
                <h2 className="font-heading text-[24px] sm:text-[34px] lg:text-[38px] xl:text-[42px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] leading-tight">
                  What Students &amp; Working Professionals Say
                </h2>
                <p className="text-sm sm:text-base text-[var(--ink-secondary)]">
                  VIMS Academy-இல் கற்ற மாணவர்கள் மற்றும் தொழில்நுட்பப் பொறியாளர்களின் நேரடி அனுபவம்.
                </p>
              </div>

              <AutomatedQuotesCarousel />

              {/* STRATEGIC MID-PAGE CTA #3 */}
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => openRegisterModal("post_reviews_cta")}
                  className="btn-gold-3d inline-flex min-h-12 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-bold"
                >
                  Reserve My Seat Now · Only {cohort.remainingSeats} Seats Left
                </button>
              </div>
            </div>
          </Reveal3D>
        </section>

        {/* 8. CONCISE FAQ + FINAL CONVERSION CARD */}
        <section id="faq" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center mb-7">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                கேள்வி &amp; பதில்
              </span>
              <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[36px] xl:text-[40px] xl:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                Quick Answers Before You Enroll
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = idx === openFaqIdx;
                return (
                  <div
                    key={item.question}
                    className={`rounded-2xl overflow-hidden ${
                      isOpen ? "surface-card-featured" : "surface-card"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left text-base sm:text-lg font-bold text-[var(--ink-primary)] hover:bg-[var(--bg-well)]/45 transition-colors"
                    >
                      <span>{item.question}</span>
                      <span className="font-heading text-2xl font-bold text-[var(--accent-gold)] shrink-0">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-[var(--border-subtle)] px-5 sm:px-6 py-4 text-[15px] sm:text-base text-[var(--ink-secondary)] leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-9 max-w-4xl mx-auto">
              <Tilt3DCard maxTiltDeg={3} className="rounded-3xl">
                <div className="surface-card-featured rounded-3xl p-6 sm:p-10 text-center space-y-4">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    இன்றே உங்கள் இடத்தை உறுதி செய்யுங்கள்! · Only {cohort.remainingSeats} of{" "}
                    {cohort.totalSeats} Seats Left
                  </div>
                  <h3 className="font-heading text-2xl sm:text-4xl font-bold text-[var(--ink-primary)]">
                    Ready to Solve Real-World Problems with AI?
                  </h3>
                  <button
                    type="button"
                    onClick={() => openRegisterModal("bottom_cta")}
                    className="btn-gold-3d inline-flex min-h-13 w-full sm:w-auto cursor-pointer items-center justify-center rounded-full px-8 sm:px-10 py-3.5 text-base font-bold"
                  >
                    Register Now · {priceLabel}
                  </button>
                </div>
              </Tilt3DCard>
            </div>
          </Reveal3D>
        </section>
      </main>

      {/* CLEAN PUBLIC FOOTER WITH VIMS ENTERPRISE PRIVACY POLICY & TERMS */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] pt-8 pb-24 md:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--ink-secondary)]">
          <div className="flex items-center gap-3">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Logo"
              width={30}
              height={30}
              className="h-7 w-7 rounded-lg object-contain"
            />
            <span className="font-bold text-[var(--ink-primary)]">
              VIMS Academy · Forward Deployment Program
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm">
            <span>© 2026 VIMS Academy</span>
            <a
              href="https://vimsenterprise.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-gold)] underline decoration-[var(--border-gold)] underline-offset-4 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="https://vimsenterprise.com/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent-gold)] underline decoration-[var(--border-gold)] underline-offset-4 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE BOTTOM CONVERSION BAR */}
      <div
        data-testid="mobile-sticky-cta"
        style={{ backgroundColor: "var(--bg-header)" }}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border-gold)] backdrop-blur-xl px-3.5 py-2.5 shadow-[0_-8px_28px_rgba(0,0,0,0.14)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 leading-tight">
            <div className="text-[11px] font-bold text-[var(--accent-gold)] tabular-nums">
              Only {cohort.remainingSeats} Seats Left · Dec 12
            </div>
            <div className="text-sm font-extrabold text-[var(--ink-primary)] tabular-nums">
              {priceLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={() => openRegisterModal("mobile_sticky_cta")}
            className="btn-gold-3d inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-full px-5 text-xs font-bold whitespace-nowrap"
          >
            Register Now
          </button>
        </div>
      </div>

      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pricing={cohort.pricing}
        totalSeats={cohort.totalSeats}
        remainingSeats={cohort.remainingSeats}
        onSeatConfirmed={(newEnrolled, newRemaining) => {
          setCohort((prev) => ({
            ...prev,
            enrolledSeats: newEnrolled,
            remainingSeats: newRemaining,
            isSoldOut: newRemaining <= 0
          }));
        }}
      />

      <FunnelInspectorModal isOpen={inspectorOpen} onClose={() => setInspectorOpen(false)} />
    </div>
  );
}
