import { useEffect, useState } from "react";
import { LiveSeatAndCountdownCard } from "./components/CountdownBanner";
import FunnelInspectorModal from "./components/FunnelInspectorModal";
import {
  AutomatedCurriculumCarousel,
  AutomatedQuotesCarousel
} from "./components/LuxuryCarousels";
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
  paymentMode: "sandbox_ready"
};

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#schedule", label: "Date & Timing" },
  { href: "#projects", label: "What You Build" },
  { href: "#curriculum", label: "Syllabus" },
  { href: "#mentors", label: "Mentors" },
  { href: "#faq", label: "FAQ" }
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default function App() {
  const [cohort, setCohort] = useState<CohortStatus>(DEFAULT_COHORT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  useEffect(() => {
    initMetaPixels(DEFAULT_COHORT.pricing.baseInr);

    const params = new URLSearchParams(window.location.search);
    if (params.get("inspector") === "1" || params.get("admin") === "1") {
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
  }, []);

  useEffect(() => {
    const sectionIds = [
      "overview",
      "schedule",
      "projects",
      "why-fde",
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
  }, []);

  function openRegisterModal(placement: string) {
    trackRegisterCtaClick(placement, cohort.remainingSeats);
    setMobileMenuOpen(false);
    setModalOpen(true);
  }

  return (
    <div id="top" className="relative min-h-screen text-slate-900">
      {/* SEAMLESS LIGHT-MODE 3D BACKGROUND */}
      <FullPageLuxuryCanvas />

      {/* CLEAN LIGHT HEADER WITH OFFICIAL VIMS LOGO */}
      <header className="sticky top-0 z-40 w-full bg-[#F6F8FB]/85 backdrop-blur-xl border-b border-slate-200/60">
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
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                VIMS <span className="text-blue-700">Academy</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
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
                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-700"
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
              className="btn-primary-trust hidden sm:inline-flex min-h-10 cursor-pointer items-center rounded-xl px-5 text-xs sm:text-sm font-bold"
            >
              Register Now
            </button>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* SEAMLESS CONTINUOUS FLOWING LIGHT SECTIONS */}
      <main className="relative z-10 space-y-16 sm:space-y-22 pt-8 sm:pt-12 pb-20">
        {/* 1. HERO: CLEAR STUDENT/PRO PITCH + VISIBLE SEATS/COUNTDOWN + DIRECT REGISTRATION FORM */}
        <section id="overview" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-800">
                <span>For College Students &amp; Working Professionals</span>
                <span>·</span>
                <span className="text-emerald-700">Live in Tamil</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-slate-950 leading-[1.15]">
                Become a{" "}
                <span className="text-blue-700">Forward Deployment Engineer (FDE)</span> &amp;
                Deploy Real-World AI.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Learn to build <strong className="text-slate-900">LLMs, RAG &amp; AI Agents</strong>{" "}
                and deploy them into real Cloud &amp; Company environments. Conducted live in{" "}
                <strong className="text-slate-900">Tamil</strong> by award-winning{" "}
                <strong className="text-slate-900">VIMS Enterprise</strong> engineers.
              </p>

              {/* Visible Live Seats + Countdown to 12th December right on the page */}
              <LiveSeatAndCountdownCard
                targetIso={CLASS_SCHEDULE.targetIso}
                enrolledSeats={cohort.enrolledSeats}
                totalSeats={cohort.totalSeats}
              />

              {/* Quick Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { top: "12th Dec", sub: "Batch Starts" },
                  { top: "In Tamil", sub: "Live Classes" },
                  { top: "Real Projects", sub: "Cloud Deployed" },
                  { top: "Certificate", sub: "Job Guidance" }
                ].map((h) => (
                  <div key={h.top} className="light-card rounded-xl p-3 text-center">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                      {h.top}
                    </div>
                    <div className="text-xs text-slate-500">{h.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Direct On-Page Student Registration Form */}
            <div id="register-form" className="lg:col-span-5">
              <div className="light-card-featured rounded-2xl p-5 sm:p-6">
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[11px] font-bold uppercase text-blue-700">
                      STARTS 12TH DECEMBER 2026
                    </span>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 tabular-nums">
                      {cohort.remainingSeats} Seats Left
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-extrabold text-slate-950">
                    Register for the Live Batch
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill in your details below to lock your seat immediately.
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

        {/* 2. DEDICATED CLASS DATE, TIMING & SCHEDULE SECTION (12th December 2026) */}
        <section id="schedule" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="light-card-featured rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
                  UPCOMING LIVE SCHEDULE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-0.5">
                  Class Date &amp; Timing Details
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Registration Open · {cohort.enrolledSeats}/{cohort.totalSeats} Booked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Start Date</div>
                <div className="mt-1 text-base sm:text-lg font-extrabold text-blue-700">
                  12th December 2026
                </div>
                <div className="text-xs text-slate-600 mt-0.5">Saturday · Live Online</div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Class Timing</div>
                <div className="mt-1 text-base sm:text-lg font-extrabold text-slate-900">
                  10:00 AM IST Onwards
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Convenient for Students &amp; Working Pros
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Duration &amp; Medium
                </div>
                <div className="mt-1 text-base sm:text-lg font-extrabold text-slate-900">
                  8 Weeks · Live in Tamil
                </div>
                <div className="text-xs text-slate-600 mt-0.5">Recordings + Code Included</div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Who Should Join</div>
                <div className="mt-1 text-base sm:text-lg font-extrabold text-emerald-700">
                  Students &amp; Professionals
                </div>
                <div className="text-xs text-slate-600 mt-0.5">Limited to 50 Seats Only</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. RICH IMAGE GALLERY: WHAT YOU WILL LEARN & BUILD */}
        <section id="projects" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
              HANDS-ON SKILLS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              What You Will Build in This Program
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VISUAL_PROJECTS.map((card) => (
              <Tilt3DCard key={card.id} className="rounded-2xl">
                <article className="light-card h-full rounded-2xl overflow-hidden flex flex-col">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                        {card.tag}
                      </span>
                      <h3 className="mt-2 text-base font-extrabold text-slate-900">{card.title}</h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {card.shortLine}
                      </p>
                    </div>
                  </div>
                </article>
              </Tilt3DCard>
            ))}
          </div>
        </section>

        {/* 4. SHORT, SIMPLE 3-STEP WHY FDE CARDS (Trimmed to 1 simple line each!) */}
        <section id="why-fde" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
              WHY THIS ROLE MATTERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Why Students &amp; Working Professionals Choose FDE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY_FDE_CARDS.map((c, idx) => (
              <div
                key={c.step}
                className={`rounded-2xl p-6 ${
                  idx === 1 ? "light-card-featured" : "light-card"
                }`}
              >
                <div className="font-mono-tech text-xs font-bold text-blue-700">
                  {c.step} · {c.label}
                </div>
                <h3 className="mt-1.5 text-lg font-extrabold text-slate-900">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.line}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. AUTOMATED 8-WEEK SYLLABUS CAROUSEL */}
        <section id="curriculum" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
                8-WEEK ROADMAP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                Simple Week-by-Week Learning Plan
              </h2>
            </div>
            <span className="rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-800">
              Taught Step-by-Step in Tamil
            </span>
          </div>

          <AutomatedCurriculumCarousel />
        </section>

        {/* 6. AWARD-WINNING VIMS ENTERPRISE TRUST SECTION + REAL CLIENT LOGOS */}
        <section id="credibility" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="light-card rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img
                    src="/images/vims-award-tn-digital-summit.jpg"
                    alt="VIMS Enterprise winning Social Eagle Award at TN Digital Summit 2026"
                    loading="lazy"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="bg-white px-4 py-2.5 text-xs font-bold text-slate-800 flex justify-between">
                    <span>TN Digital Summit 2026 · Social Eagle Award</span>
                    <span className="text-blue-700">VIMS Enterprise</span>
                  </figcaption>
                </figure>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
                  TRUSTED &amp; AWARD-WINNING COMPANY
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-snug">
                  Learn Directly from Award-Winning VIMS Enterprise.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Honored with the <strong>Social Eagle Award at TN Digital Summit 2026</strong>,
                  VIMS Enterprise builds real industry products and trains thousands of learners
                  through{" "}
                  <a
                    href="https://embskills.vimsenterprise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline"
                  >
                    embskills.vimsenterprise.com
                  </a>{" "}
                  and VIMS Academy.
                </p>

                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Trusted by Industry Teams
                  </div>
                  <div className="grid grid-cols-4 gap-3 items-center">
                    {CLIENT_LOGOS.map((logo) => (
                      <div
                        key={logo.name}
                        className="flex h-12 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-2"
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

        {/* 7. MENTOR PHOTOS + SIMPLE 1-LINE CAPTION (No long bios, No LinkedIn link!) */}
        <section id="mentors" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
              YOUR MENTORS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Guided by Real Industry Practitioners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {MENTORS.map((m) => (
              <Tilt3DCard key={m.id} className="rounded-2xl">
                <article className="light-card rounded-2xl overflow-hidden text-center p-5">
                  <div className="mx-auto aspect-[4/4] w-44 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-slate-900 text-white">
                        <span className="text-3xl font-extrabold">{getInitials(m.name)}</span>
                        <span className="mt-1 text-[10px] uppercase tracking-widest text-blue-200">
                          VIMS Enterprise
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="mt-4 inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[11px] font-bold text-blue-700">
                    {m.badge}
                  </span>
                  <h3 className="mt-1.5 text-lg font-extrabold text-slate-950">{m.name}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-600">{m.simpleLine}</p>
                </article>
              </Tilt3DCard>
            ))}
          </div>
        </section>

        {/* 8. AUTOMATED STUDENT & WORKING PRO REVIEWS */}
        <section id="reviews" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">
              STUDENT TRUST
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              What Students &amp; Working Professionals Say
            </h2>
          </div>

          <AutomatedQuotesCarousel />
        </section>

        {/* 9. CONCISE FAQ + FINAL CTA */}
        <section id="faq" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="font-mono-tech text-xs font-bold uppercase text-blue-700">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Quick Answers
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = idx === openFaqIdx;
              return (
                <div key={item.question} className="light-card rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="flex min-h-13 w-full cursor-pointer items-center justify-between gap-4 px-5 py-3.5 text-left text-sm sm:text-base font-bold text-slate-900"
                  >
                    <span>{item.question}</span>
                    <span className="text-lg font-bold text-blue-700 shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 py-3.5 text-sm text-slate-600 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 light-card-featured rounded-3xl p-6 sm:p-8 text-center space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Batch Starts 12th December 2026 · Only {cohort.remainingSeats} of {cohort.totalSeats}{" "}
              Seats Left
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Ready to Launch Your FDE Career?
            </h3>
            <button
              type="button"
              onClick={() => openRegisterModal("bottom_cta")}
              className="btn-primary-trust inline-flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-8 py-3 text-sm sm:text-base font-bold"
            >
              Register Now · ₹{cohort.pricing.baseInr.toLocaleString("en-IN")} + GST
            </button>
          </div>
        </section>
      </main>

      {/* CLEAN LIGHT FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/70 bg-white/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/vims-logo.png"
              alt="VIMS Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded object-contain"
            />
            <span className="font-bold text-slate-800">
              VIMS Academy · Powered by VIMS Enterprise
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 VIMS Enterprise</span>
            <button
              type="button"
              onClick={() => setInspectorOpen(true)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono-tech text-[10px] text-slate-600 hover:text-blue-700"
            >
              Pixel &amp; Funnel
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
