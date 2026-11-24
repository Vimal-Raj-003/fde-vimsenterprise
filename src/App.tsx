import { useEffect, useState } from "react";
import FunnelInspectorModal from "./components/FunnelInspectorModal";
import {
  AutomatedCurriculumCarousel,
  AutomatedQuotesCarousel,
  ProductionSystemsCarousel
} from "./components/LuxuryCarousels";
import RegistrationModal from "./components/RegistrationModal";
import { FullPageLuxuryCanvas, Tilt3DCard } from "./components/Spatial3DCanvas";
import { FAQ_ITEMS, MENTORS } from "./data/fdeData";
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
    endIso: (import.meta.env.VITE_REG_END_ISO as string) || "2026-12-01T16:00:00+05:30"
  },
  paymentMode: "sandbox_ready"
};

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#perspective", label: "Philosophy" },
  { href: "#curriculum", label: "Curriculum" },
  { href: "#institution", label: "Institution" },
  { href: "#mentors", label: "Faculty" },
  { href: "#enrollment", label: "Tuition" },
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
        setCohort(data);
      } catch {
        // Keep graceful fallback
      }
    }

    void fetchCohort();
    const pollId = window.setInterval(fetchCohort, 15000);
    return () => window.clearInterval(pollId);
  }, []);

  useEffect(() => {
    const sectionIds = [
      "overview",
      "perspective",
      "curriculum",
      "institution",
      "mentors",
      "reflections",
      "enrollment",
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
    <div id="top" className="relative min-h-screen text-[#F5F1E8]">
      {/* CONTINUOUS SEAMLESS 3D LUXURY ATMOSPHERIC BACKGROUND (No section seams anywhere) */}
      <FullPageLuxuryCanvas />

      {/* MINIMAL FLOATING GLASS HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#0B1310]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#top"
            className="inline-flex min-h-11 shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-[#D4AF7A]"
          >
            <span className="font-luxury flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF7A]/45 bg-[#121F1A] text-lg font-semibold text-[#D4AF7A]">
              V
            </span>
            <div className="leading-tight">
              <div className="font-luxury text-xl font-semibold tracking-wide text-[#F5F1E8]">
                VIMS <span className="text-[#D4AF7A]">Academy</span>
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#858075]">
                VIMS Enterprise
              </div>
            </div>
          </a>

          <nav aria-label="Primary Navigation" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="shrink-0">
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center whitespace-nowrap text-xs font-medium tracking-[0.12em] uppercase text-[#B8B2A6] transition-colors hover:text-[#D4AF7A] focus-visible:outline-2 focus-visible:outline-[#D4AF7A]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#enrollment"
              className="hidden sm:inline-flex min-h-10 items-center rounded-full border border-[#D4AF7A]/35 bg-[#D4AF7A]/8 px-5 text-xs font-semibold tracking-[0.1em] uppercase text-[#D4AF7A] transition-colors hover:bg-[#D4AF7A]/18"
            >
              Program Details
            </a>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#D4AF7A]/30 bg-[#121F1A] text-sm text-[#F5F1E8]"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0E1814]/95 backdrop-blur-xl px-5 py-5">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-xs font-medium tracking-[0.14em] uppercase text-[#F5F1E8] hover:text-[#D4AF7A]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* CONTINUOUS FLOWING MAIN EXPERIENCE (Zero horizontal dividers, zero background breaks) */}
      <main className="relative z-10 space-y-24 sm:space-y-32 pt-8 sm:pt-14 pb-24">
        {/* 1. EDITORIAL LUXURY HERO + AUTOMATED 3D ARCHITECTURE CAROUSEL */}
        <section id="overview" className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#D4AF7A]/25 bg-[#121F1A]/70 px-4 py-1.5 text-xs">
                <span className="tracking-[0.14em] uppercase text-[#D4AF7A] font-medium">
                  8-Week Live Cohort
                </span>
                <span className="text-[#F5F1E8]/25">·</span>
                <span className="text-[#B8B2A6]">Live Sessions Conducted in Tamil</span>
              </div>

              <h1 className="font-luxury text-4xl sm:text-5xl lg:text-[52px] font-semibold text-[#F5F1E8] leading-[1.12]">
                Architect and deploy the{" "}
                <span className="italic text-[#D4AF7A]">AI systems</span> that power modern
                enterprises.
              </h1>

              <p className="text-sm sm:text-[15.5px] text-[#B8B2A6] leading-[1.8] max-w-xl">
                Step into the role of a{" "}
                <strong className="font-medium text-[#F5F1E8]">
                  Forward Deployment Engineer (FDE)
                </strong>
                . Move beyond isolated prompts and notebooks to build grounded Enterprise RAG,
                tool-calling AI agents, and resilient cloud APIs. Taught live in{" "}
                <strong className="font-medium text-[#F5F1E8]">Tamil</strong> by practicing
                engineers from award-winning{" "}
                <strong className="font-medium text-[#F5F1E8]">VIMS Enterprise</strong>.
              </p>

              {/* Restrained, Calm Pillar Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg">
                <div>
                  <div className="font-luxury text-2xl sm:text-3xl font-semibold text-[#D4AF7A]">
                    8 Weeks
                  </div>
                  <div className="text-xs text-[#858075] mt-0.5">Live Online Immersion</div>
                </div>
                <div>
                  <div className="font-luxury text-2xl sm:text-3xl font-semibold text-[#F5F1E8]">
                    In Tamil
                  </div>
                  <div className="text-xs text-[#858075] mt-0.5">Interactive Mentorship</div>
                </div>
                <div>
                  <div className="font-luxury text-2xl sm:text-3xl font-semibold text-[#F5F1E8]">
                    3+ Systems
                  </div>
                  <div className="text-xs text-[#858075] mt-0.5">Shipped to Cloud</div>
                </div>
              </div>

              {/* Single Poised Hero CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => openRegisterModal("hero_primary")}
                  className="btn-champagne inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide"
                >
                  Register Now
                </button>

                <a
                  href="#curriculum"
                  className="btn-outline-luxury inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-medium"
                >
                  Explore Curriculum
                </a>
              </div>
            </div>

            {/* Right: Automated 3D Showcase Carousel */}
            <div className="lg:col-span-6">
              <ProductionSystemsCarousel />
            </div>
          </div>
        </section>

        {/* 2. THE FDE ENGINEERING PHILOSOPHY (Flows seamlessly on same canvas) */}
        <section id="perspective" className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
              The Discipline
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8] leading-snug">
              Watching AI tutorials is worlds apart from engineering production systems.
            </h2>
            <p className="text-sm sm:text-[15px] text-[#B8B2A6] leading-relaxed">
              Every organization wants AI in production, yet very few engineers know how to connect
              language models safely to live enterprise APIs, eliminate hallucinations, and maintain
              strict latency SLAs.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Tilt3DCard maxTiltDeg={3.5} className="rounded-2xl">
              <div className="luxury-card h-full rounded-2xl p-7 space-y-4">
                <div className="font-mono-tech text-[11px] tracking-widest text-[#858075]">
                  01 · CONVENTIONAL STUDY
                </div>
                <h3 className="font-luxury text-2xl font-semibold text-[#F5F1E8]">
                  Confined to Local Notebooks
                </h3>
                <ul className="space-y-2.5 text-sm text-[#B8B2A6]">
                  <li>• Prompt experimentation without deterministic JSON contracts</li>
                  <li>• Fragile prototypes that fail on real multi-page documents</li>
                  <li>• Zero exposure to FastAPI, Docker containers, or cloud deployment</li>
                  <li>• No verifiable production architecture to demonstrate in interviews</li>
                </ul>
              </div>
            </Tilt3DCard>

            <Tilt3DCard maxTiltDeg={4} className="rounded-2xl">
              <div className="luxury-card-elevated h-full rounded-2xl p-7 space-y-4">
                <div className="font-mono-tech text-[11px] tracking-widest text-[#D4AF7A]">
                  02 · THE VIMS FDE BRIDGE
                </div>
                <h3 className="font-luxury text-2xl font-semibold text-[#F5F1E8]">
                  Eight Weeks of Applied Architecture
                </h3>
                <ul className="space-y-2.5 text-sm text-[#F5F1E8]/90">
                  <li>• End-to-end LLMs, Hybrid Vector RAG, and Tool-Calling Agents</li>
                  <li>• Containerized REST services deployed to real cloud environments</li>
                  <li>• Live sessions taught in Tamil for effortless conceptual mastery</li>
                  <li>• Grounded in Automotive, Enterprise Ops, and AI SaaS workflows</li>
                </ul>
              </div>
            </Tilt3DCard>

            <Tilt3DCard maxTiltDeg={3.5} className="rounded-2xl">
              <div className="luxury-card h-full rounded-2xl p-7 space-y-4">
                <div className="font-mono-tech text-[11px] tracking-widest text-[#52B788]">
                  03 · CAREER DISTINCTION
                </div>
                <h3 className="font-luxury text-2xl font-semibold text-[#F5F1E8]">
                  Production-Ready FDE Engineer
                </h3>
                <ul className="space-y-2.5 text-sm text-[#B8B2A6]">
                  <li>• Translate complex business problems into deployed AI pipelines</li>
                  <li>• Executive GitHub portfolio backed by live cloud endpoints</li>
                  <li>• Mastery of evaluation suites, citations, and latency guardrails</li>
                  <li>• Prepared for high-impact AI product and enterprise interviews</li>
                </ul>
              </div>
            </Tilt3DCard>
          </div>
        </section>

        {/* 3. AUTOMATED 8-WEEK CURRICULUM CAROUSEL */}
        <section id="curriculum" className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl space-y-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
                Eight-Week Syllabus
              </span>
              <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8] leading-snug">
                Structured as four progressive engineering phases.
              </h2>
              <p className="text-sm text-[#B8B2A6]">
                Every two weeks culminates in a deployed milestone. Live instruction and code
                walkthroughs are delivered in <strong className="text-[#F5F1E8]">Tamil</strong>.
              </p>
            </div>
            <span className="font-mono-tech text-[11px] tracking-widest text-[#D4AF7A]">
              AUTO-CYCLING · CLICK ANY PHASE
            </span>
          </div>

          <AutomatedCurriculumCarousel />
        </section>

        {/* 4. AWARD-WINNING INSTITUTION SHOWCASE (REAL PHOTO) */}
        <section id="institution" className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="luxury-card rounded-3xl p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <Tilt3DCard maxTiltDeg={3} className="rounded-2xl">
                  <figure className="overflow-hidden rounded-2xl border border-[#D4AF7A]/25">
                    <img
                      src="/images/vims-award-tn-digital-summit.jpg"
                      alt="VIMS Enterprise team honored with the Social Eagle Award at TN Digital Summit 2026"
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                    <figcaption className="bg-[#0B1310]/90 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#F5F1E8] font-medium">
                        TN Digital Summit 2026 · Social Eagle Award
                      </span>
                      <span className="font-mono-tech text-[11px] text-[#D4AF7A]">
                        VIMS ENTERPRISE
                      </span>
                    </figcaption>
                  </figure>
                </Tilt3DCard>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
                  Institutional Pedigree
                </span>
                <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8] leading-snug">
                  Presented by an award-winning engineering house.
                </h2>
                <p className="text-sm sm:text-[15px] text-[#B8B2A6] leading-relaxed">
                  <strong className="text-[#F5F1E8] font-medium">VIMS Academy</strong> operates as
                  the dedicated talent and engineering education arm of{" "}
                  <strong className="text-[#F5F1E8] font-medium">VIMS Enterprise</strong>, recipient
                  of the <strong className="text-[#F5F1E8] font-medium">Social Eagle Award at TN Digital Summit 2026</strong>.
                </p>
                <p className="text-sm sm:text-[15px] text-[#B8B2A6] leading-relaxed">
                  Alongside our established automotive and embedded systems ecosystem (
                  <a
                    href="https://embskills.vimsenterprise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF7A] underline underline-offset-4 hover:text-[#E5C594]"
                  >
                    embskills.vimsenterprise.com
                  </a>
                  ), this cohort brings authentic industrial architecture, rigorous mentorship, and
                  verifiable certification to serious learners.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-[#F5F1E8]/10 bg-[#0B1310]/50 p-4">
                    <div className="font-luxury text-lg font-semibold text-[#D4AF7A]">
                      Practitioner-Led Craft
                    </div>
                    <p className="mt-1 text-xs text-[#B8B2A6] leading-relaxed">
                      Designed around active enterprise and automotive AI deployments.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#F5F1E8]/10 bg-[#0B1310]/50 p-4">
                    <div className="font-luxury text-lg font-semibold text-[#D4AF7A]">
                      Recognized Credential
                    </div>
                    <p className="mt-1 text-xs text-[#B8B2A6] leading-relaxed">
                      VIMS Enterprise-backed Completion Certificate upon capstone sign-off.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FACULTY: PROGRAM HOSTS & SUPPORTING MENTOR */}
        <section id="mentors" className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl space-y-2.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
              Faculty &amp; Mentorship
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8] leading-snug">
              Guided by engineers who ship real systems.
            </h2>
            <p className="text-sm text-[#B8B2A6]">
              Direct instruction from two program hosts paired with dedicated hands-on weekly lab
              unblocking.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {MENTORS.map((mentor) => (
              <Tilt3DCard key={mentor.id} maxTiltDeg={3.5} className="rounded-2xl">
                <article className="luxury-card flex h-full flex-col justify-between rounded-2xl p-7">
                  <div>
                    <div className="flex items-center gap-4">
                      <div
                        aria-hidden="true"
                        className="font-luxury flex h-13 w-13 shrink-0 items-center justify-center rounded-full border border-[#D4AF7A]/40 bg-[#0B1310] text-lg font-semibold text-[#D4AF7A]"
                      >
                        {getInitials(mentor.name)}
                      </div>
                      <div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4AF7A]">
                          {mentor.badge}
                        </span>
                        <h3 className="font-luxury text-2xl font-semibold text-[#F5F1E8] leading-tight">
                          {mentor.name}
                        </h3>
                        <p className="text-xs text-[#858075] mt-0.5">{mentor.role}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm text-[#B8B2A6] leading-relaxed">{mentor.bio}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {mentor.domains.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#F5F1E8]/10 bg-[#0B1310]/60 px-3 py-1 text-[11px] text-[#F5F1E8]/85"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {mentor.linkedin && (
                    <div className="mt-6 pt-4 border-t border-[#F5F1E8]/8">
                      <a
                        href={mentor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-medium tracking-wide text-[#D4AF7A] hover:text-[#E5C594]"
                      >
                        View LinkedIn Profile ↗
                      </a>
                    </div>
                  )}
                </article>
              </Tilt3DCard>
            ))}
          </div>
        </section>

        {/* 6. AUTOMATED EDITORIAL QUOTES & LEARNER REFLECTIONS CAROUSEL */}
        <section id="reflections" className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
              Learner Reflections
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8]">
              Voices from VIMS Academy learners.
            </h2>
          </div>

          <AutomatedQuotesCarousel />
        </section>

        {/* 7. REFINED COHORT TUITION & ENROLLMENT CARD (No noisy seat bars here; opens cleanly in Modal) */}
        <section id="enrollment" className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="luxury-card-elevated rounded-3xl p-7 sm:p-11">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
                  Cohort Tuition &amp; Admission
                </span>
                <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8] leading-snug">
                  One transparent investment for the complete 8-week program.
                </h2>

                <ul className="space-y-3 text-sm text-[#B8B2A6] pt-1">
                  {[
                    "8 weeks of live online engineering sessions (conducted in Tamil)",
                    "Hands-on LLMs, Hybrid Vector RAG, AI Agents & Docker Cloud Deployment",
                    "Real-world capstones across Automotive, Enterprise & AI SaaS domains",
                    "Direct guidance from Guruprasath, Gowthamraj Mahadevan & Vimal Raj",
                    "Lifetime access to HD session recordings & starter GitHub repositories",
                    "FDE resume positioning, portfolio review & mock interview preparation",
                    "Verified Completion Certificate backed by VIMS Enterprise"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-[#D4AF7A] mt-0.5">✦</span>
                      <span className="text-[#F5F1E8]/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-[#D4AF7A]/28 bg-[#0B1310]/75 p-7 text-center space-y-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#858075]">
                  Complete Cohort Fee
                </div>

                <div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-luxury text-5xl font-semibold text-[#F5F1E8] tabular-nums">
                      ₹{cohort.pricing.baseInr.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-medium text-[#D4AF7A]">+ 18% GST</span>
                  </div>
                  <p className="mt-1.5 text-xs text-[#858075] tabular-nums">
                    ₹{cohort.pricing.totalInr.toLocaleString("en-IN")} total with official GST
                    invoice
                  </p>
                </div>

                <button
                  type="button"
                  disabled={cohort.isSoldOut}
                  onClick={() => openRegisterModal("enrollment_card")}
                  className="btn-champagne flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold tracking-wide disabled:opacity-50"
                >
                  {cohort.isSoldOut ? "Cohort Full" : "Register Now"}
                </button>

                <p className="text-[11px] text-[#858075] leading-relaxed">
                  Click Register Now to check live seat availability and complete instant UPI / Card
                  checkout via Razorpay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REFINED ACCORDION FAQ */}
        <section id="faq" className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF7A]">
              Clarifications
            </span>
            <h2 className="font-luxury text-3xl sm:text-4xl font-semibold text-[#F5F1E8]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = idx === openFaqIdx;
              return (
                <div key={item.question} className="luxury-card rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                    className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-sm sm:text-[15.5px] font-medium text-[#F5F1E8] hover:text-[#D4AF7A]"
                  >
                    <span>{item.question}</span>
                    <span className="font-luxury text-xl text-[#D4AF7A] shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[#B8B2A6] leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* MINIMAL SEAMLESS FOOTER */}
      <footer className="relative z-10 pb-12 pt-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#858075]">
          <div>
            <div className="font-luxury text-lg font-semibold text-[#F5F1E8]">
              VIMS <span className="text-[#D4AF7A]">Academy</span> · Powered by VIMS Enterprise
            </div>
            <p className="mt-1">
              Forward Deployment Engineer Program · Ecosystem:{" "}
              <a
                href="https://embskills.vimsenterprise.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF7A] hover:underline"
              >
                embskills.vimsenterprise.com
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <span>© 2026 VIMS Enterprise</span>
            <span className="font-mono-tech text-[11px]">fde.vimsenterprise.com</span>
            <button
              type="button"
              onClick={() => setInspectorOpen(true)}
              className="cursor-pointer rounded-full border border-[#F5F1E8]/12 bg-[#121F1A]/80 px-3 py-1 font-mono-tech text-[10px] text-[#B8B2A6] hover:border-[#D4AF7A] hover:text-[#F5F1E8]"
            >
              Pixel &amp; Funnel
            </button>
          </div>
        </div>
      </footer>

      {/* EXCLUSIVE REGISTRATION MODAL (Reveals 50 Seats, 10->11 Live Count, Countdown & Razorpay) */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pricing={cohort.pricing}
        enrolledSeats={cohort.enrolledSeats}
        totalSeats={cohort.totalSeats}
        startIso={cohort.window.startIso}
        endIso={cohort.window.endIso}
        onSeatConfirmed={(newEnrolled, newRemaining) => {
          setCohort((prev) => ({
            ...prev,
            enrolledSeats: newEnrolled,
            remainingSeats: newRemaining,
            isSoldOut: newRemaining <= 0
          }));
        }}
      />

      {/* OWNER META PIXEL & FUNNEL INSPECTOR */}
      <FunnelInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
}
