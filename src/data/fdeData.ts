import type { Icon3DName } from "../components/Icons3D";

export interface VisualProjectCard {
  id: string;
  tag: string;
  title: string;
  points: string[];
  image: string;
  fit?: "contain" | "cover";
}

export interface RapidMasteryStep {
  icon: Icon3DName;
  dayLabel: string;
  phase: string;
  title: string;
  points: string[];
  milestone: string;
}

export interface CurriculumSprint {
  sprintCode: string;
  daysLabel: string;
  title: string;
  points: Array<{
    icon: Icon3DName;
    text: string;
  }>;
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

export interface FaqItem {
  question: string;
  answer: string;
}

export const CLASS_SCHEDULE = {
  dateLabel: "Saturday, 12th December 2026",
  timeLabel: "10:00 AM IST Onwards (Live Online)",
  targetIso: "2026-12-12T10:00:00+05:30",
  languageLabel: "Live Class in Tamil (தமிழ்)",
  audienceLabel: "College Students & Working Professionals",
  durationLabel: "1-Week Intensive Program"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    icon: "rocket",
    dayLabel: "DAY 1 · RAPID CLARITY",
    phase: "Day 1-லயே Clear Understanding",
    title: "Grasp Full AI Stack & Live APIs",
    points: [
      "FDE Architecture & AI flow-ஐ zero-ல இருந்து ஈஸியா புரியும்",
      "உங்கள் முதல் FastAPI + LLM Live API-ஐ build பண்ணுவீங்க",
      "Confusing theory இல்லாம 100% live hands-on demo in Tamil"
    ],
    milestone: "Day 1-லயே உங்கள் முதல் Live AI API Ready!"
  },
  {
    icon: "database",
    dayLabel: "DAY 2 · CORE MASTERY",
    phase: "Real-World RAG Build",
    title: "Build Real RAG & Vector Systems",
    points: [
      "PDFs & Company Database-ஐ AI கூட connect பண்றது",
      "Wrong answers (hallucinations) இல்லாத accurate RAG output",
      "48 hours-லயே working Enterprise AI Assistant"
    ],
    milestone: "2 Days-லயே Live Data AI Assistant Ready!"
  },
  {
    icon: "cloud",
    dayLabel: "DAYS 3 - 7 · DEPLOY",
    phase: "Cloud Deploy & Career",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "Daily office tasks-ஐ automate பண்ற Enterprise AI Agents",
      "Docker & HTTPS-ல நேரடியா Public Cloud-ல deploy பண்றது",
      "Active GitHub Portfolio + VIMS Academy Certificate"
    ],
    milestone: "Live Cloud URLs + VIMS Certificate"
  }
];

export const VISUAL_PROJECTS: VisualProjectCard[] = [
  {
    id: "llm-rag",
    tag: "RAG Architecture",
    title: "LLMs, RAG & Vector Search",
    points: [
      "PDF & Database search பண்ணி accurate பதில் தரும் RAG pipeline",
      "Zero-hallucination Enterprise Knowledge AI system"
    ],
    image: "/images/realtime-rag-architecture.jpg",
    fit: "contain"
  },
  {
    id: "cloud-api",
    tag: "FastAPI & Cloud",
    title: "Live FastAPI & Cloud APIs",
    points: [
      "Production Python REST APIs with interactive /docs",
      "Docker containerization & Live HTTPS Cloud deployment"
    ],
    image: "/images/realtime-fastapi-cloud-wide.png",
    fit: "cover"
  },
  {
    id: "ai-agents",
    tag: "AI Agent Workflow",
    title: "Autonomous Enterprise AI Agents",
    points: [
      "Gmail, Slack & API tools connect பண்ற real AI Agents",
      "Multi-step business workflows-ஐ end-to-end automate பண்ணுங்க"
    ],
    image: "/images/realtime-ai-agent-workflow.png",
    fit: "cover"
  },
  {
    id: "career-bench",
    tag: "GitHub & Career",
    title: "Live GitHub Portfolio & Career",
    points: [
      "Recruiters verify பண்ற live deployed GitHub projects",
      "Resume, Mock Interview & VIMS Academy Certificate"
    ],
    image: "/images/realtime-github-portfolio-wide.png",
    fit: "cover"
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "DAYS 1 - 2",
    daysLabel: "First 2 Days: Clarity",
    title: "Full FDE Architecture, APIs & RAG",
    points: [
      {
        icon: "brain",
        text: "FDE Architecture & AI workflow-ஐ தமிழ்லயே சுலபமா கத்துக்கலாம்"
      },
      {
        icon: "code",
        text: "FastAPI backend + Real LLM APIs & Structured JSON hands-on"
      },
      {
        icon: "database",
        text: "PDFs & Company Data-வை Vector Search கூட Day 2-லயே connect பண்ணுங்க"
      }
    ],
    output: "Within 48 Hours: உங்கள் முதல் Live Knowledge AI API Ready"
  },
  {
    sprintCode: "DAYS 3 - 4",
    daysLabel: "Enterprise RAG",
    title: "Citation Accuracy & Production Tuning",
    points: [
      {
        icon: "shield",
        text: "AI wrong answers தடுக்க Source Citations & grounding setup"
      },
      {
        icon: "rocket",
        text: "Fast response speed & multi-document retrieval tuning"
      },
      {
        icon: "check",
        text: "Real company-level accuracy testing & prompt evaluation"
      }
    ],
    output: "Mid-Week Build: Production Document AI Assistant"
  },
  {
    sprintCode: "DAYS 5 - 6",
    daysLabel: "AI Agents & Cloud",
    title: "Autonomous Agents & Docker Cloud",
    points: [
      {
        icon: "agent",
        text: "Automatic task execution பண்ற Tool-Calling AI Agents"
      },
      {
        icon: "cloud",
        text: "Docker package பண்ணி Public HTTPS Cloud URL-ல Live Deploy"
      },
      {
        icon: "shield",
        text: "API Security, cost control & live usage monitoring"
      }
    ],
    output: "Live Cloud Build: Public HTTPS AI Agent System"
  },
  {
    sprintCode: "DAY 7",
    daysLabel: "Portfolio & Career",
    title: "Capstone Review & Interview Readiness",
    points: [
      {
        icon: "portfolio",
        text: "உங்கள் 1-Week AI Projects-ஐ live GitHub Portfolio-ல publish பண்ணுங்க"
      },
      {
        icon: "rocket",
        text: "Students & Working Pros-க்கான Resume + Mock Interview guide"
      },
      {
        icon: "award",
        text: "Official VIMS Academy Completion Certificate"
      }
    ],
    output: "Final Outcome: Live Portfolio + VIMS Academy Certificate"
  }
];

export const MENTORS: MentorProfile[] = [
  {
    id: "guruprasath",
    name: "Guruprasath",
    badge: "Program Host",
    simpleLine: "AI Solutions & Forward Deployment Lead · VIMS Academy",
    photo: "/images/faculty-guruprasath-studio.jpg"
  },
  {
    id: "gowthamraj",
    name: "Gowthamraj Mahadevan",
    badge: "Program Host",
    simpleLine: "AI & Systems Engineering Lead · VIMS Academy",
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
      "I watched playlists for months with zero confidence. Here, inside the first two days in தமிழ், everything from FastAPI to live Cloud deployment clicked."
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
    question: "1 Week-ல Beginners கூட ஈஸியா கத்துக்க முடியுமா?",
    answer:
      "கண்டிப்பா முடியும்! Basic-ல இருந்து full-ஆ தமிழ்லயே சொல்லித் தருவோம். First 2 Days-லயே FastAPI, LLMs & RAG clear-ஆ புரிஞ்சிடும்; Days 3 to 7-ல Live Cloud AI Agents & Portfolio முடிச்சிடுவீங்க."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "Ideal for College Students, Working Professionals, Industrialists, and anyone who wants real deployed AI projects instead of passive theory."
  },
  {
    question: "Class எப்போ start ஆகும்? Recordings கிடைக்குமா?",
    answer:
      "Saturday, 12th December 2026 காலை 10:00 AM IST-க்கு Live Online Class start ஆகும். Full HD recordings, complete source code, and VIMS Academy Certificate included."
  }
];
