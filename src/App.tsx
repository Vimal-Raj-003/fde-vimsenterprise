import { useEffect, useState } from "react";
import { LiveSeatAndCountdownCard } from "./components/CountdownBanner";
import FunnelInspectorModal from "./components/FunnelInspectorModal";
import {
  AutomatedCurriculumCarousel,
  AutomatedQuotesCarousel
} from "./components/LuxuryCarousels";
import OwnerAdminPage from "./components/OwnerAdminPage";
import RegistrationModal, { EnrollmentFormWidget } from "./components/RegistrationModal";
import { FullPageLuxuryCanvas, Tilt3DCard } from "./components/Spatial3DCanvas";
import {
  CLASS_SCHEDULE,
  CLIENT_LOGOS,
  FAQ_ITEMS,
  MENTORS,
  VISUAL_PROJECTS,
  WHY_FDE_CARDS
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

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#credibility", label: "Trust" },
  { href: "#schedule", label: "Dec 12 Timing" },
  { href: "#projects", label: "Projects" },
  { href: "#curriculum", label: "Syllabus" },
  { href: "#mentors", label: "Mentors" },
  { href: "#reviews", label: "Reviews" }
];

export default function App() {
  const isAdminRoute =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/admin";

  const [cohort, setCohort] = useState<CohortStatus>(DEFAULT_COHORT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

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
      "credibility",
      "schedule",
      "why-fde",
      "projects",
      "curriculum",
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
    return <OwnerAdminPage />;
  }

  function openRegisterModal(placement: string) {
    trackRegisterCtaClick(placement, cohort.remainingSeats);
    setMobileMenuOpen(false);
    setModalOpen(true);
  }

  return (
    <div id="top" className="relative min-h-screen text-[#22191D]">
      {/* SEAMLESS WARM-IVORY 3D CONSTELLATION CANVAS */}
      <FullPageLuxuryCanvas />

      {/* REFINED LIGHT LUXURY HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF6F0]/88 backdrop-blur-xl border-b border-[#6A244C]/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#top" className="inline-flex items-center gap-2.5 shrink-0">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Enterprise Logo"
              width={38}
              height={38}
              className="h-9 w-9 rounded-lg object-contain"
            />
            <div className="leading-tight">
              <div className="font-luxury text-xl font-bold tracking-tight text-[#22191D]">
                VIMS <span className="text-[#6A244C]">Academy</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5E5056]">
                Powered by VIMS Enterprise
              </div>
            </div>
          </a>

          <nav aria-label="Primary Navigation" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-[#5E5056] transition-colors hover:text-[#6A244C]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => openRegisterModal("header_cta")}
              className="btn-imperial hidden sm:inline-flex min-h-10 cursor-pointer items-center rounded-full px-5 text-xs sm:text-sm font-bold"
            >
              Register Now
            </button>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#B58338]/35 bg-white text-[#22191D]"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#6A244C]/10 bg-white px-4 py-4 shadow-lg">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-[#22191D] hover:bg-[#FAF6F0]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* SEAMLESS HIGH-CONVERTING LANDING ARCHITECTURE */}
      <main className="relative z-10 space-y-18 sm:space-y-24 pt-8 sm:pt-12 pb-20">
        {/* 1. HERO: CLEAR STUDENT & PRO VALUE + LIVE SEATS/COUNTDOWN + DIRECT REGISTRATION FORM */}
        <section id="overview" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#B58338]/40 bg-white px-4 py-1.5 text-xs font-bold text-[#6A244C] shadow-2xs">
                <span>Specially for College Students &amp; Working Professionals</span>
                <span className="text-[#B58338]">·</span>
                <span className="text-[#1A6B54]">Live in Tamil</span>
              </div>

              <h1 className="font-luxury text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#22191D] leading-[1.08]">
                Become a{" "}
                <span className="italic text-[#6A244C]">Forward Deployment Engineer (FDE)</span>{" "}
                &amp; Deploy Real-World AI.
              </h1>

              <p className="text-sm sm:text-base text-[#5E5056] leading-relaxed max-w-2xl">
                Master <strong className="text-[#22191D]">LLMs, RAG &amp; AI Agents</strong> and
                deploy them into live Cloud &amp; Company systems. Taught step-by-step in{" "}
                <strong className="text-[#22191D]">Tamil</strong> by award-winning{" "}
                <strong className="text-[#22191D]">VIMS Enterprise</strong> engineers.
              </p>

              {/* Visible Live Seats + Countdown to 12th December */}
              <LiveSeatAndCountdownCard
                targetIso={CLASS_SCHEDULE.targetIso}
                enrolledSeats={cohort.enrolledSeats}
                totalSeats={cohort.totalSeats}
              />

              {/* 4 Trust Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { top: "12th Dec", sub: "Batch Starts" },
                  { top: "In Tamil", sub: "Live Online Class" },
                  { top: "3+ Projects", sub: "Cloud Deployed" },
                  { top: "Certificate", sub: "VIMS Enterprise" }
                ].map((h) => (
                  <div key={h.top} className="luxury-light-card rounded-2xl p-3.5 text-center">
                    <div className="font-luxury text-lg sm:text-xl font-bold text-[#6A244C]">
                      {h.top}
                    </div>
                    <div className="text-xs font-medium text-[#5E5056]">{h.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Direct On-Page Student Registration Form */}
            <div id="register-form" className="lg:col-span-5">
              <div className="luxury-light-featured rounded-3xl p-5 sm:p-6">
                <div className="mb-4 border-b border-[#6A244C]/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[11px] font-bold uppercase text-[#6A244C]">
                      STARTS 12TH DECEMBER 2026
                    </span>
                    <span className="rounded-full bg-[#1A6B54]/10 border border-[#1A6B54]/25 px-2.5 py-0.5 text-[11px] font-bold text-[#1A6B54] tabular-nums">
                      {cohort.remainingSeats} Seats Left
                    </span>
                  </div>
                  <h2 className="font-luxury mt-1 text-2xl font-bold text-[#22191D]">
                    Register for the Live Batch
                  </h2>
                  <p className="text-xs text-[#5E5056]">
                    Lock your seat now with instant Razorpay UPI / Card checkout.
                  </p>
                </div>

                <EnrollmentFormWidget
                  pricing={cohort.pricing}
                  enrolledSeats={cohort.enrolledSeats}
                  totalSeats={cohort.totalSeats}
                  targetIso={CLASS_SCHEDULE.targetIso}
                  onSeatConfirmed={(newEnrolled, newRemaining) => {
                    setCohort((prev) => ({
                      ...prev,
                      enrolledSeats: newEnrolled,
                      remainingSeats: newRemaining,
                      isSoldOut: newRemaining <= 0
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. IMMEDIATE INSTITUTIONAL PROOF & AWARD-WINNING CREDIBILITY */}
        <section id="credibility" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="luxury-light-card rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <figure className="overflow-hidden rounded-2xl border border-[#B58338]/30 shadow-sm">
                  <img
                    src="/images/vims-award-tn-digital-summit.jpg"
                    alt="VIMS Enterprise winning Social Eagle Award at TN Digital Summit 2026"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="bg-[#FAF6F0] px-4 py-2.5 text-xs font-bold text-[#22191D] flex justify-between">
                    <span>TN Digital Summit 2026 · Social Eagle Award</span>
                    <span className="text-[#6A244C]">VIMS Enterprise</span>
                  </figcaption>
                </figure>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="font-mono-tech text-xs font-bold uppercase tracking-wider text-[#B58338]">
                  TRUSTED &amp; AWARD-WINNING INSTITUTION
                </span>
                <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] leading-tight">
                  Backed by Award-Winning VIMS Enterprise.
                </h2>
                <p className="text-sm sm:text-base text-[#5E5056] leading-relaxed">
                  Honored with the <strong className="text-[#22191D]">Social Eagle Award at TN Digital Summit 2026</strong>,
                  VIMS Enterprise builds real-world software and trains engineers across{" "}
                  <a
                    href="https://embskills.vimsenterprise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#6A244C] underline"
                  >
                    embskills.vimsenterprise.com
                  </a>{" "}
                  and VIMS Academy.
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#5E5056] mb-3">
                    Trusted by Industry Partners
                  </div>
                  <div className="grid grid-cols-4 gap-3 items-center">
                    {CLIENT_LOGOS.map((logo) => (
                      <div
                        key={logo.name}
                        className="flex h-12 items-center justify-center rounded-xl border border-[#B58338]/20 bg-[#FAF6F0]/60 p-2"
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
        </section>

        {/* 3. CLASS DATE & TIMING ARCHITECTURE (12th December 2026) */}
        <section id="schedule" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="luxury-light-featured rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">
                  UPCOMING COHORT SCHEDULE
                </span>
                <h2 className="font-luxury text-3xl font-bold text-[#22191D] mt-0.5">
                  Class Date &amp; Timing Details
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1A6B54]/10 border border-[#1A6B54]/25 px-4 py-1.5 text-xs font-bold text-[#1A6B54]">
                <span className="h-2 w-2 rounded-full bg-[#1A6B54] animate-pulse" />
                Open Now · {cohort.enrolledSeats}/{cohort.totalSeats} Booked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[#B58338]/25 bg-[#FAF6F0] p-4">
                <div className="text-xs font-semibold uppercase text-[#5E5056]">Start Date</div>
                <div className="font-luxury mt-1 text-xl font-bold text-[#6A244C]">
                  12th December 2026
                </div>
                <div className="text-xs text-[#5E5056] mt-0.5">Saturday · Live Online</div>
              </div>

              <div className="rounded-2xl border border-[#B58338]/25 bg-[#FAF6F0] p-4">
                <div className="text-xs font-semibold uppercase text-[#5E5056]">Class Timing</div>
                <div className="font-luxury mt-1 text-xl font-bold text-[#22191D]">
                  10:00 AM IST Onwards
                </div>
                <div className="text-xs text-[#5E5056] mt-0.5">
                  Ideal for Students &amp; Working Pros
                </div>
              </div>

              <div className="rounded-2xl border border-[#B58338]/25 bg-[#FAF6F0] p-4">
                <div className="text-xs font-semibold uppercase text-[#5E5056]">
                  Duration &amp; Medium
                </div>
                <div className="font-luxury mt-1 text-xl font-bold text-[#22191D]">
                  8 Weeks · Live in Tamil
                </div>
                <div className="text-xs text-[#5E5056] mt-0.5">Recordings + Code Included</div>
              </div>

              <div className="rounded-2xl border border-[#B58338]/25 bg-[#FAF6F0] p-4">
                <div className="text-xs font-semibold uppercase text-[#5E5056]">Eligibility</div>
                <div className="font-luxury mt-1 text-xl font-bold text-[#1A6B54]">
                  Students &amp; Professionals
                </div>
                <div className="text-xs text-[#5E5056] mt-0.5">Capped at 50 Seats</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SHORT, SIMPLE 3-STEP WHY FDE CARDS */}
        <section id="why-fde" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">
              THE DIFFERENCE
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] mt-1">
              Why Students &amp; Working Professionals Choose FDE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY_FDE_CARDS.map((c, idx) => (
              <div
                key={c.step}
                className={`rounded-2xl p-6 ${
                  idx === 1 ? "luxury-light-featured" : "luxury-light-card"
                }`}
              >
                <div className="font-mono-tech text-xs font-bold text-[#6A244C]">
                  {c.step} · {c.label}
                </div>
                <h3 className="font-luxury mt-1.5 text-2xl font-bold text-[#22191D]">{c.title}</h3>
                <p className="mt-2 text-sm text-[#5E5056] leading-relaxed">{c.line}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. REAL PROJECT VISUALS GALLERY */}
        <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">
              HANDS-ON ENGINEERING
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] mt-1">
              What You Will Build &amp; Deploy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VISUAL_PROJECTS.map((card) => (
              <Tilt3DCard key={card.id} className="rounded-2xl">
                <article className="luxury-light-card h-full rounded-2xl overflow-hidden flex flex-col">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-[#FAF6F0]">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <span className="inline-block rounded-full bg-[#6A244C]/8 px-2.5 py-0.5 text-[11px] font-bold text-[#6A244C]">
                      {card.tag}
                    </span>
                    <h3 className="font-luxury mt-2 text-xl font-bold text-[#22191D]">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#5E5056] leading-relaxed">{card.shortLine}</p>
                  </div>
                </article>
              </Tilt3DCard>
            ))}
          </div>
        </section>

        {/* 6. AUTOMATED 8-WEEK SYLLABUS CAROUSEL */}
        <section id="curriculum" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">
                8-WEEK ROADMAP
              </span>
              <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] mt-1">
                Structured Week-by-Week Syllabus
              </h2>
            </div>
            <span className="rounded-full bg-[#6A244C]/8 border border-[#6A244C]/20 px-4 py-1 text-xs font-bold text-[#6A244C]">
              Taught Live in Tamil
            </span>
          </div>

          <AutomatedCurriculumCarousel />
        </section>

        {/* 7. YOUR MENTORS — ALL 3 EXACT REAL STUDIO PORTRAITS + SIMPLE 1-LINE ROLE */}
        <section id="mentors" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-9">
            <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">
              PROGRAM FACULTY
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] mt-1">
              Guided by Real Industry Practitioners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MENTORS.map((m) => (
              <Tilt3DCard key={m.id} className="rounded-3xl">
                <article className="luxury-light-card rounded-3xl overflow-hidden text-center p-5">
                  <div className="mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl border border-[#B58338]/30 bg-[#FAF6F0]">
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-[50%_18%]"
                    />
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-[#6A244C]/8 border border-[#6A244C]/15 px-3 py-0.5 text-[11px] font-bold text-[#6A244C]">
                    {m.badge}
                  </span>
                  <h3 className="font-luxury mt-1.5 text-2xl font-bold text-[#22191D]">{m.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[#5E5056]">{m.simpleLine}</p>
                </article>
              </Tilt3DCard>
            ))}
          </div>
        </section>

        {/* 8. HIGHLIGHTED 3D GLASSY AUTOMATED QUOTES SHOWCASE ("What Students & Working Professionals Say") */}
        <section id="reviews" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-[32px] border border-[#B58338]/30 bg-gradient-to-b from-white/85 via-[#FAF2E8]/80 to-white/80 px-4 sm:px-8 py-10 sm:py-14 shadow-[0_24px_64px_rgba(106,36,76,0.07)]">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <span className="inline-block rounded-full border border-[#B58338]/40 bg-white px-4 py-1 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-[#6A244C]">
                HIGHLIGHTED LEARNER OUTCOMES
              </span>
              <h2 className="font-luxury text-3xl sm:text-5xl font-bold text-[#22191D] leading-tight">
                What Students &amp; Working Professionals Say
              </h2>
              <p className="text-xs sm:text-sm text-[#5E5056]">
                Real experiences from college students and working engineers building with VIMS Academy.
              </p>
            </div>

            <AutomatedQuotesCarousel />
          </div>
        </section>

        {/* 9. CONCISE FAQ + FINAL CONVERSION CARD */}
        <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-[#B58338]">FAQ</span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D] mt-1">
              Quick Answers
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = idx === openFaqIdx;
              return (
                <div key={item.question} className="luxury-light-card rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="flex min-h-13 w-full cursor-pointer items-center justify-between gap-4 px-5 py-3.5 text-left text-sm sm:text-base font-bold text-[#22191D]"
                  >
                    <span>{item.question}</span>
                    <span className="font-luxury text-2xl font-bold text-[#6A244C] shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#6A244C]/10 px-5 py-3.5 text-sm text-[#5E5056] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 luxury-light-featured rounded-3xl p-6 sm:p-9 text-center space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6A244C]">
              Starts 12th December 2026 · Only {cohort.remainingSeats} of {cohort.totalSeats} Seats Left
            </div>
            <h3 className="font-luxury text-3xl sm:text-4xl font-bold text-[#22191D]">
              Reserve Your Seat in the Next FDE Batch
            </h3>
            <button
              type="button"
              onClick={() => openRegisterModal("bottom_cta")}
              className="btn-imperial inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-9 py-3.5 text-sm sm:text-base font-bold"
            >
              Register Now · ₹{cohort.pricing.baseInr.toLocaleString("en-IN")} + GST
            </button>
          </div>
        </section>
      </main>

      {/* REFINED LIGHT LUXURY FOOTER */}
      <footer className="relative z-10 border-t border-[#6A244C]/10 bg-white/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5E5056]">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded object-contain"
            />
            <span className="font-bold text-[#22191D]">
              VIMS Academy · Powered by VIMS Enterprise
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 VIMS Enterprise</span>
            <a
              href="/admin"
              className="rounded-lg border border-[#B58338]/35 bg-[#FAF6F0] px-2.5 py-1 font-mono-tech text-[10px] font-semibold text-[#6A244C] hover:bg-white"
            >
              Owner Leads (/admin)
            </a>
            <button
              type="button"
              onClick={() => setInspectorOpen(true)}
              className="cursor-pointer rounded-lg border border-[#B58338]/25 bg-white px-2.5 py-1 font-mono-tech text-[10px] text-[#5E5056] hover:text-[#6A244C]"
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
        enrolledSeats={cohort.enrolledSeats}
        totalSeats={cohort.totalSeats}
        startIso={cohort.window.startIso}
        endIso={CLASS_SCHEDULE.targetIso}
        onSeatConfirmed={(newEnrolled, newRemaining) => {
          setCohort((prev) => ({
            ...prev,
            enrolledSeats: newEnrolled,
            remainingSeats: newRemaining,
            isSoldOut: newRemaining <= 0
          }));
        }}
      />

      <FunnelInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
}
