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
    baseInr: 2999,
    gstPercent: 18,
    gstInr: 540,
    totalInr: 3539,
    totalPaise: 353900
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
        className="relative z-40 px-4 py-2 text-center text-xs sm:text-[13px] font-semibold border-b border-[var(--border-gold)]"
      >
        <span style={{ color: "#E3B452" }}>Award-Winning VIMS Academy</span> · Live Batch Starts{" "}
        <strong>12th December 2026</strong> · Only{" "}
        <span style={{ color: "#E3B452" }} className="underline tabular-nums">
          {cohort.remainingSeats} Seats Left
        </span>
      </div>

      {/* CLEAN NAV-FREE FUNNEL HEADER WITH LIGHT / DARK SWITCH */}
      <header
        style={{ backgroundColor: "var(--bg-header)" }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-[var(--border-subtle)]"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex items-center gap-3 shrink-0 group">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Academy Logo"
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink-primary)]">
                VIMS <span className="text-[var(--accent-gold)]">Academy</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                Forward Deployment Program
              </div>
            </div>
          </a>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              data-testid="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
              aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
              className="btn-outline-3d inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            >
              {theme === "light" ? (
                <svg
                  width="18"
                  height="18"
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
                  width="18"
                  height="18"
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
              className="btn-gold-3d inline-flex min-h-10 cursor-pointer items-center rounded-full px-4 sm:px-6 text-xs sm:text-sm font-bold whitespace-nowrap"
            >
              Register Now
            </button>
          </div>
        </div>
      </header>

      {/* CONCISE ZERO-REPETITION PERFORMANCE MARKETING FLOW */}
      <main className="relative z-10 space-y-12 sm:space-y-16 pt-7 sm:pt-11 pb-16">
        {/* 1. HERO: CLEAN VALUE PROP + REGISTER NOW CTA + LIVE COHORT SNAPSHOT CARD */}
        <section id="overview" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[var(--bg-surface)] px-4 py-1.5 text-xs sm:text-sm font-bold text-[var(--ink-primary)] shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent-gold-bright)]" />
                <span>
                  1-Week Intensive · Students &amp; Working Professionals ·{" "}
                  <span className="text-[var(--accent-gold)]">Live in Tamil</span>
                </span>
              </div>

              <h1 className="font-heading text-[36px] sm:text-[48px] lg:text-[54px] font-extrabold tracking-tight text-[var(--ink-primary)] leading-[1.06]">
                Become a{" "}
                <span className="text-[var(--accent-gold)]">
                  Forward Deployment Engineer (FDE)
                </span>{" "}
                &amp; Deploy Real-World AI.
              </h1>

              <p className="text-[17px] sm:text-[19px] text-[var(--ink-secondary)] leading-relaxed max-w-2xl">
                Learn <strong className="text-[var(--ink-primary)]">LLMs, RAG, AI Agents</strong>{" "}
                and live Cloud deployment step-by-step in{" "}
                <strong className="text-[var(--ink-primary)]">Tamil</strong>. Structured so even
                beginners grasp the entire core system right in the{" "}
                <strong className="text-[var(--ink-primary)]">first 2 days</strong>.
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => openRegisterModal("hero_cta")}
                  className="btn-gold-3d inline-flex min-h-14 cursor-pointer items-center justify-center rounded-full px-9 py-3.5 text-base sm:text-lg font-bold"
                >
                  Register Now · ₹{cohort.pricing.baseInr.toLocaleString("en-IN")} + GST
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Elevated 3D Cohort Snapshot Card */}
            <div className="lg:col-span-5 space-y-4">
              <Tilt3DCard maxTiltDeg={3} className="rounded-3xl">
                <div className="surface-card-featured rounded-3xl p-5 sm:p-6 space-y-4">
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
                        title: "Starts Saturday, 12th December 2026",
                        sub: "10:00 AM IST Onwards · Live Online"
                      },
                      {
                        icon: "language" as const,
                        title: "Taught Live in Simple Tamil",
                        sub: "Grasp core AI workflows inside the first 2 days"
                      },
                      {
                        icon: "award" as const,
                        title: "VIMS Academy Certificate & Projects",
                        sub: "HD recordings, source code & GitHub showcase included"
                      }
                    ].map((row) => (
                      <div
                        key={row.title}
                        className="group surface-well flex items-center gap-3.5 rounded-2xl px-4 py-3"
                      >
                        <Icon3D name={row.icon} size="sm" />
                        <div>
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
              <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-3">
                Master Core FDE Skills in the First 2 Days
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {RAPID_MASTERY_STEPS.map((step, idx) => (
                <Tilt3DCard key={step.dayLabel} maxTiltDeg={6} className="rounded-3xl h-full">
                  <article
                    className={`group h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${
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
                      <h3 className="font-heading mt-4 text-2xl font-bold text-[var(--ink-primary)]">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-[15px] sm:text-base text-[var(--ink-secondary)] leading-relaxed">
                        {step.summary}
                      </p>
                    </div>

                    <div className="mt-5 rounded-xl border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[var(--accent-gold)]">
                      ✓ {step.milestone}
                    </div>
                  </article>
                </Tilt3DCard>
              ))}
            </div>
          </Reveal3D>
        </section>

        {/* 3. REAL FDE AI PROJECT VISUALS GALLERY */}
        <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center max-w-5xl mx-auto mb-7">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                WHAT YOU WILL LEARN &amp; SHIP
              </span>
              <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                What You Will Build &amp; Deploy Live
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {VISUAL_PROJECTS.map((card) => (
                <Tilt3DCard key={card.id} maxTiltDeg={6.5} className="rounded-2xl h-full">
                  <article className="surface-card h-full rounded-2xl overflow-hidden flex flex-col">
                    <div className="aspect-[16/10] w-full overflow-hidden bg-[var(--bg-well)]">
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-108"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="self-start inline-block rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-3 py-0.5 text-xs font-bold text-[var(--accent-gold)]">
                        {card.tag}
                      </span>
                      <h3 className="font-heading mt-2.5 text-xl font-bold text-[var(--ink-primary)]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--ink-secondary)] leading-relaxed">
                        {card.shortLine}
                      </p>
                    </div>
                  </article>
                </Tilt3DCard>
              ))}
            </div>
          </Reveal3D>
        </section>

        {/* 4. AUTOMATED 1-WEEK SYLLABUS CAROUSEL (SCULPTED 3D ICONS) */}
        <section id="curriculum" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                  1-WEEK INTENSIVE SYLLABUS
                </span>
                <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
                  1-Week Day-by-Day Practical Roadmap
                </h2>
              </div>
              <span className="rounded-full bg-[var(--pill-gold-bg)] border border-[var(--border-gold)] px-4 py-1.5 text-sm font-bold text-[var(--accent-gold)]">
                Heavy Core Learning in First 2 Days
              </span>
            </div>

            <AutomatedCurriculumCarousel />
          </Reveal3D>
        </section>

        {/* 5. INSTITUTIONAL PROOF & AWARD-WINNING CREDIBILITY */}
        <section id="credibility" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="surface-card rounded-3xl p-6 sm:p-9">
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
                  <h2 className="font-heading text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-[var(--ink-primary)] leading-tight">
                    Backed by Award-Winning VIMS Academy
                  </h2>
                  <p className="text-[15px] sm:text-[17px] text-[var(--ink-secondary)] leading-relaxed">
                    Honored with the{" "}
                    <strong className="text-[var(--ink-primary)]">
                      Social Eagle Award at TN Digital Summit 2026
                    </strong>
                    , VIMS builds real-world software solutions and trains college students and
                    working engineers across{" "}
                    <a
                      href="https://embskills.vimsenterprise.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[var(--accent-gold)] underline"
                    >
                      embskills.vimsenterprise.com
                    </a>{" "}
                    and VIMS Academy.
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-3">
                      Trusted by Industry Partners
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-center">
                      {CLIENT_LOGOS.map((logo) => (
                        <div
                          key={logo.name}
                          className="flex h-13 items-center justify-center rounded-xl border border-[var(--border-gold)] bg-white p-2 shadow-xs transition-transform duration-200 hover:-translate-y-1"
                        >
                          <img
                            src={logo.src}
                            alt={logo.name}
                            loading="lazy"
                            className="max-h-7 w-auto object-contain"
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

        {/* 6. YOUR MENTORS: SINGLE-LINE HEADING + EXACT 3 FULL-FRAME STUDIO PORTRAITS */}
        <section id="mentors" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center max-w-5xl mx-auto mb-8">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                PROGRAM FACULTY
              </span>
              <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
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

        {/* 7. HIGHLIGHTED 3D GLASSY AUTOMATED QUOTES SHOWCASE */}
        <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="reviews-showcase-frame rounded-[32px] px-4 sm:px-8 py-9 sm:py-12">
              <div className="text-center max-w-5xl mx-auto mb-7 space-y-2">
                <span className="inline-block rounded-full border border-[var(--border-gold)] bg-[var(--pill-gold-bg)] px-4 py-1 font-mono-tech text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                  HIGHLIGHTED LEARNER OUTCOMES
                </span>
                <h2 className="font-heading text-[26px] sm:text-[36px] lg:text-[42px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] leading-tight">
                  What Students &amp; Working Professionals Say
                </h2>
                <p className="text-sm sm:text-base text-[var(--ink-secondary)]">
                  Real experiences from college students and working engineers building with VIMS
                  Academy.
                </p>
              </div>

              <AutomatedQuotesCarousel />
            </div>
          </Reveal3D>
        </section>

        {/* 8. CONCISE FAQ + FINAL CONVERSION CARD */}
        <section id="faq" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal3D>
            <div className="text-center mb-7">
              <span className="font-mono-tech text-xs font-bold uppercase text-[var(--accent-gold)]">
                FAQ
              </span>
              <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] lg:whitespace-nowrap font-bold text-[var(--ink-primary)] mt-1">
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
                <div className="surface-card-featured rounded-3xl p-7 sm:p-10 text-center space-y-4">
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    Only {cohort.remainingSeats} of {cohort.totalSeats} Seats Left for 12th December
                  </div>
                  <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--ink-primary)]">
                    Ready to Build &amp; Deploy Real-World AI?
                  </h3>
                  <button
                    type="button"
                    onClick={() => openRegisterModal("bottom_cta")}
                    className="btn-gold-3d inline-flex min-h-13 cursor-pointer items-center justify-center rounded-full px-10 py-3.5 text-base font-bold"
                  >
                    Register Now · ₹{cohort.pricing.baseInr.toLocaleString("en-IN")} + GST
                  </button>
                </div>
              </Tilt3DCard>
            </div>
          </Reveal3D>
        </section>
      </main>

      {/* MINIMAL FUNNEL FOOTER */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8">
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

          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 VIMS Academy</span>
            <a
              href="/admin"
              className="btn-outline-3d rounded-lg px-3 py-1.5 font-mono-tech text-xs font-semibold text-[var(--accent-gold)]"
            >
              Owner Leads (/admin)
            </a>
            <button
              type="button"
              onClick={() => setInspectorOpen(true)}
              className="btn-outline-3d cursor-pointer rounded-lg px-3 py-1.5 font-mono-tech text-xs font-semibold"
            >
              Pixel Tracker
            </button>
          </div>
        </div>
      </footer>

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
