export interface VisualProjectCard {
  id: string;
  tag: string;
  title: string;
  shortLine: string;
  image: string;
}

export interface RapidMasteryStep {
  dayLabel: string;
  phase: string;
  title: string;
  summary: string;
  milestone: string;
}

export interface CurriculumSprint {
  sprintCode: string;
  daysLabel: string;
  title: string;
  points: string[];
  output: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  badge: string;
  simpleLine: string;
  photo: string;
}

export interface StudentReview {
  id: string;
  name: string;
  role: string;
  tag: string;
  quote: string;
}

export interface AudienceFitItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  outcomes: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const CLASS_SCHEDULE = {
  dateLabel: "Saturday, 12th December 2026",
  timeLabel: "10:00 AM IST Onwards (Live Online)",
  targetIso: "2026-12-12T10:00:00+05:30",
  languageLabel: "Live in Tamil",
  audienceLabel: "College Students & Working Professionals",
  durationLabel: "1-Week Intensive Program"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    dayLabel: "DAY 1 · RAPID CLARITY",
    phase: "Zero-Jargon Tamil Breakdown",
    title: "Grasp Full AI Stack & Live APIs",
    summary:
      "Most learners overthink AI engineering. On Day 1 itself, understand the complete Forward Deployment architecture in simple Tamil and ship your first FastAPI + LLM endpoint.",
    milestone: "First Live AI Endpoint Running by Night 1"
  },
  {
    dayLabel: "DAY 2 · CORE MASTERY",
    phase: "Heavy Practical Immersion",
    title: "Build Real RAG & Vector Systems",
    summary:
      "By the end of Day 2, you connect real company PDFs, databases, and structured JSON pipelines with zero hallucinations so every piece clicks naturally.",
    milestone: "Real Data AI Assistant Built in 48 Hours"
  },
  {
    dayLabel: "DAYS 3 - 7 · DEPLOY",
    phase: "Agents, Cloud & Career Pack",
    title: "Ship AI Agents & Interview Ready",
    summary:
      "Finish the 1-week sprint by containerizing autonomous AI Agents onto live Cloud URLs, plus GitHub portfolio review and VIMS Enterprise certification.",
    milestone: "Live Public Cloud Portfolio + Certificate"
  }
];

export const AUDIENCE_FIT: AudienceFitItem[] = [
  {
    id: "students",
    tag: "FOR COLLEGE STUDENTS & FRESHERS",
    title: "Stand Out in Campus & Off-Campus Placements",
    subtitle:
      "Stop relying on generic tutorial notebooks. In 1 focused week, build live deployed AI URLs that interviewers test right on call.",
    outcomes: [
      "Master practical core AI foundations right in the first 2 days",
      "Ship 3+ live GitHub and Cloud-hosted AI projects within 1 week",
      "Walk into placement rounds with VIMS Enterprise project certification"
    ]
  },
  {
    id: "professionals",
    tag: "FOR WORKING PROFESSIONALS (IT & CORE)",
    title: "Upskill Into AI Engineering in Just 1 Week",
    subtitle:
      "Designed for busy engineers starting Saturday at 10 AM IST. Rapid high-impact sessions help you transition without pausing your job.",
    outcomes: [
      "Grasp modern LLM, RAG, and Agent workflows clearly in the first 2 days",
      "Deploy Dockerized FastAPI and Vector DB systems used in real teams",
      "Upgrade your resume with live architecture links and interview case studies"
    ]
  }
];

export const VISUAL_PROJECTS: VisualProjectCard[] = [
  {
    id: "adas-ai",
    tag: "Real-World AI",
    title: "AI Solutions (LLMs, RAG & Agents)",
    shortLine: "Build smart AI systems grounded on real company data without hallucinations.",
    image: "/images/adas-driver-view.jpg"
  },
  {
    id: "cloud-api",
    tag: "Cloud & APIs",
    title: "Live Cloud & API Integration",
    shortLine: "Deploy Python, FastAPI, and Docker services into real production environments.",
    image: "/images/autosar-architecture.jpg"
  },
  {
    id: "industry-ecu",
    tag: "Industry Projects",
    title: "Enterprise & Automotive Use Cases",
    shortLine: "Solve actual engineering workflows that hiring managers test in interviews.",
    image: "/images/automotive-ecu.jpg"
  },
  {
    id: "career-bench",
    tag: "Job Readiness",
    title: "Portfolio, Resume & Mock Interviews",
    shortLine: "Graduate in 1 week with deployed GitHub links and a VIMS Enterprise certificate.",
    image: "/images/hil-test-bench.jpg"
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "DAYS 1 - 2",
    daysLabel: "Deep Core Jumpstart",
    title: "Full FDE Architecture, APIs & RAG",
    points: [
      "Complete FDE system mental model explained crystal clearly in Tamil",
      "FastAPI backend setup, real LLM APIs & structured JSON outputs",
      "Connect PDFs & databases with Vector Search right inside Day 2"
    ],
    output: "First 48 Hours: Live Knowledge AI API Service Running"
  },
  {
    sprintCode: "DAYS 3 - 4",
    daysLabel: "Enterprise RAG",
    title: "Citation Accuracy & Production Tuning",
    points: [
      "Stop AI hallucinations using grounded enterprise source citations",
      "Optimize latency, chunking strategy, and multi-document retrieval",
      "Evaluate response reliability like top AI forward deployment teams"
    ],
    output: "Mid-Week Build: Production Grounded Document Assistant"
  },
  {
    sprintCode: "DAYS 5 - 6",
    daysLabel: "Agents & Cloud",
    title: "Autonomous Agents & Docker Cloud",
    points: [
      "Build tool-calling AI Agents that automate multi-step engineering tasks",
      "Package cleanly with Docker and ship to a public HTTPS Cloud URL",
      "API key security, cost guardrails, and live telemetry monitoring"
    ],
    output: "Live Cloud Build: Public HTTPS AI Agent System"
  },
  {
    sprintCode: "DAY 7",
    daysLabel: "Showcase & Career",
    title: "Capstone Review & Interview Readiness",
    points: [
      "Publish your complete 1-week AI engineering showcase on GitHub",
      "Role-ready resume & system walkthrough prep for Students and Pros",
      "Graduate with your official VIMS Enterprise Completion Certificate"
    ],
    output: "Graduation: Deployed Portfolio + Verified Certificate"
  }
];

export const MENTORS: MentorProfile[] = [
  {
    id: "guruprasath",
    name: "Guruprasath",
    badge: "Program Host",
    simpleLine: "AI Solutions & Forward Deployment Lead · VIMS Enterprise",
    photo: "/images/faculty-guruprasath-studio.jpg"
  },
  {
    id: "gowthamraj",
    name: "Gowthamraj Mahadevan",
    badge: "Program Host",
    simpleLine: "ADAS & Systems Engineering Lead · VIMS Enterprise",
    photo: "/images/faculty-gowthamraj-studio.jpg"
  },
  {
    id: "vimalraj",
    name: "Vimal Raj",
    badge: "Supporting Mentor",
    simpleLine: "Hands-On Lab & Student Project Support · VIMS Academy",
    photo: "/images/faculty-vimalraj-studio.jpg"
  }
];

export const CLIENT_LOGOS = [
  { name: "Hexuno", src: "/images/client-hexuno.png" },
  { name: "Radent", src: "/images/client-radent.png" },
  { name: "NBC", src: "/images/client-nbc.png" },
  { name: "Piest", src: "/images/client-piest.png" }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: "r1",
    name: "Karthik Raja",
    role: "Final-Year Engineering Student · Chennai",
    tag: "College Student",
    quote:
      "I watched playlists for months with zero confidence. Here, inside the first two days in Tamil, everything from FastAPI to live Cloud deployment clicked."
  },
  {
    id: "r2",
    name: "Priya Dharshini",
    role: "Software Developer · Coimbatore",
    tag: "Working IT Pro",
    quote:
      "In one focused week I shipped live deployed RAG and Agent URLs. Walking into interviews with real production links immediately set me apart."
  },
  {
    id: "r3",
    name: "Arun Prakash",
    role: "Working Core Engineer · Bengaluru",
    tag: "Core-to-AI Switch",
    quote:
      "Switching from core engineering felt tough until the VIMS mentors simplified the whole architecture in Day 1 and guided every hands-on build."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How much can I actually learn in a 1-Week program?",
    answer:
      "Because all concepts are explained directly in simple Tamil without fluff, the first 2 days cover the complete core architecture and your first live AI build, while Days 3 to 7 solidify Agents, Cloud deployment, and interview readiness."
  },
  {
    question: "Who is this 1-Week FDE Intensive designed for?",
    answer:
      "Built specifically for College Students (all engineering, CS, and IT streams), Freshers, and Working Professionals (IT or Core engineers) ready to ship production AI projects fast."
  },
  {
    question: "When does the live batch start and what if I miss a session?",
    answer:
      "The 1-week intensive kicks off on Saturday, 12th December 2026 at 10:00 AM IST (Live Online in Tamil). Full session recordings, clean codebases, and an official VIMS Enterprise Certificate are included."
  },
  {
    question: "What is the complete program fee?",
    answer:
      "One-time fee of ₹2,999 + 18% GST (₹3,539 total). Seats are strictly capped at 50 learners so mentors personally support every student."
  }
];
