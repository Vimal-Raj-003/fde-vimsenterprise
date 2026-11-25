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
  languageLabel: "Live Online · Taught in Tamil",
  audienceLabel: "College Students & Working Professionals",
  durationLabel: "3-Day Intensive Workshop"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    icon: "rocket",
    dayLabel: "DAY 1 · FOUNDATION & APIS",
    phase: "Instant Clarity",
    title: "Grasp Full AI Stack & Live APIs",
    points: [
      "Zero-ல இருந்து full FDE architecture easy-ஆ புரியும்",
      "உங்க first FastAPI + LLM Live API நீங்களே build பண்ணி run பண்ணுவீங்க",
      "Boring theory இல்லாம, 100% live hands-on coding-ஆ சொல்லித் தருவோம்"
    ],
    milestone: "Day 1 Output: Your First Live AI API"
  },
  {
    icon: "database",
    dayLabel: "DAY 2 · CORE RAG SYSTEMS",
    phase: "Real-World RAG Build",
    title: "Build Real RAG & Vector Systems",
    points: [
      "PDFs & Company Database-ஐ live AI models கூட connect பண்ணுவோம்",
      "Wrong answers வராம accurate RAG retrieval set பண்ணுவோம்",
      "Day 2 முடிக்கும்போது ஒரு working Enterprise AI Assistant ready ஆகிடும்"
    ],
    milestone: "Day 2 Output: Live Data AI Assistant"
  },
  {
    icon: "cloud",
    dayLabel: "DAY 3 · AGENTS & DEPLOY",
    phase: "Cloud Deploy & Mastery",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "Daily office tasks-ஐ automate பண்ற Enterprise AI Agents build பண்ணலாம்",
      "Docker & HTTPS use பண்ணி Public Cloud-ல live-ஆ deploy பண்ணலாம்",
      "Live GitHub Portfolio + VIMS Academy Certificate-ஓட finish பண்ணலாம்"
    ],
    milestone: "Day 3 Output: Live Cloud URLs + Certificate"
  }
];

export const VISUAL_PROJECTS: VisualProjectCard[] = [
  {
    id: "llm-rag",
    tag: "RAG Architecture",
    title: "LLMs, RAG & Vector Search",
    points: [
      "Real PDFs & database search பண்ணி accurate answers தரும் RAG pipeline",
      "Wrong answers (hallucinations) இல்லாத Enterprise Knowledge AI"
    ],
    image: "/images/realtime-rag-architecture.jpg",
    fit: "contain"
  },
  {
    id: "cloud-api",
    tag: "FastAPI & Cloud",
    title: "Live FastAPI & Cloud APIs",
    points: [
      "Interactive /docs-ஓட production Python REST APIs build பண்ணலாம்",
      "Docker use பண்ணி Live HTTPS Cloud-ல deploy பண்ணலாம்"
    ],
    image: "/images/realtime-fastapi-cloud-wide.png",
    fit: "cover"
  },
  {
    id: "ai-agents",
    tag: "AI Agent Workflow",
    title: "Autonomous Enterprise AI Agents",
    points: [
      "Gmail, Slack & live APIs கூட connect ஆகுற real AI Agents",
      "Multi-step business workflows-ஐ automatically run பண்ண set பண்ணலாம்"
    ],
    image: "/images/realtime-ai-agent-workflow.png",
    fit: "cover"
  },
  {
    id: "career-bench",
    tag: "GitHub & Career",
    title: "Live GitHub Portfolio & Career",
    points: [
      "Recruiters check பண்ற live deployed links-ஓட GitHub portfolio",
      "Resume prep, Mock Interviews & VIMS Academy Certificate"
    ],
    image: "/images/realtime-fde-github-portfolio-v2.png",
    fit: "cover"
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "DAY 1",
    daysLabel: "Foundation & APIs",
    title: "Full FDE Architecture & Live APIs",
    points: [
      {
        icon: "brain",
        text: "Full FDE architecture & AI workflows-ஐ basics-ல இருந்து clear-ஆ கத்துக்கலாம்"
      },
      {
        icon: "code",
        text: "FastAPI backend + real LLM APIs & Structured JSON hands-on-ஆ build பண்ணுவோம்"
      },
      {
        icon: "rocket",
        text: "உங்க first production-ready AI endpoint live-ஆ test பண்ணி run பண்ணலாம்"
      }
    ],
    output: "Day 1 Output: Your First Live AI API"
  },
  {
    sprintCode: "DAY 2",
    daysLabel: "Enterprise RAG",
    title: "RAG, Vector Search & Citations",
    points: [
      {
        icon: "database",
        text: "PDFs & company data-வை Vector Search கூட live-ஆ connect பண்ணுவோம்"
      },
      {
        icon: "shield",
        text: "AI wrong answers தராம இருக்க Source Citations & grounding set பண்ணலாம்"
      },
      {
        icon: "check",
        text: "Fast response speed, accuracy testing & real-world prompt tuning"
      }
    ],
    output: "Day 2 Output: Production Document AI Assistant"
  },
  {
    sprintCode: "DAY 3",
    daysLabel: "Agents, Cloud & Career",
    title: "AI Agents, Cloud Deploy & Portfolio",
    points: [
      {
        icon: "agent",
        text: "Real tasks-ஐ automatically பண்ற Tool-Calling AI Agents build பண்ணலாம்"
      },
      {
        icon: "cloud",
        text: "Docker-ல package பண்ணி Public HTTPS Cloud URL-ல live-ஆ ship பண்ணலாம்"
      },
      {
        icon: "award",
        text: "GitHub Portfolio publish பண்ணி, Resume tips & VIMS Certificate வாங்கலாம்"
      }
    ],
    output: "Day 3 Mastery: Live Cloud URLs + Portfolio + Certificate"
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
    role: "Final-Year Student · Chennai",
    tag: "Student",
    quote: "Super clear teaching in Tamil. Understood RAG and APIs in two days."
  },
  {
    id: "r2",
    name: "Priya Dharshini",
    role: "Software Developer · Coimbatore",
    tag: "Working Pro",
    quote: "Built and deployed my first live AI project in just 3 days!"
  },
  {
    id: "r3",
    name: "Arun Prakash",
    role: "Core Engineer · Bengaluru",
    tag: "Career Switch",
    quote: "Very practical and easy to follow. Great mentors and hands-on sessions."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Can complete beginners master this in 3 days?",
    answer:
      "Yes, கண்டிப்பா முடியும்! Basics-ல இருந்து comfortable-ஆ தமிழ்ல சொல்லித் தருவோம். Day 2-லயே FastAPI & RAG build பண்ணிடுவீங்க, Day 3-ல Cloud AI Agents & live GitHub portfolio complete பண்ணிடலாம்."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "College Students, Working Professionals, Industrialists, theory-ஆ இல்லாம real deployed AI projects கத்துக்க நினைக்கிற எல்லாரும் join பண்ணலாம்."
  },
  {
    question: "When does the workshop start, and are recordings included?",
    answer:
      "Saturday, 12th December 2026, 10:00 AM IST-க்கு 3-day live online workshop start ஆகும். Full HD recordings, complete source code, and VIMS Academy Certificate எல்லாமே உங்களுக்கு கிடைக்கும்."
  }
];
