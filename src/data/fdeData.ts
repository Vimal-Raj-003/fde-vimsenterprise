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
      "Understand the complete FDE architecture from zero",
      "Build and run your first FastAPI + LLM Live API",
      "100% live hands-on coding explained simply in Tamil"
    ],
    milestone: "Day 1 Output: Your First Live AI API"
  },
  {
    icon: "database",
    dayLabel: "DAY 2 · CORE RAG SYSTEMS",
    phase: "Real-World RAG Build",
    title: "Build Real RAG & Vector Systems",
    points: [
      "Connect PDFs & Company Databases to live AI models",
      "Eliminate wrong answers with accurate RAG retrieval",
      "Ship a working Enterprise AI Assistant by Day 2"
    ],
    milestone: "Day 2 Output: Live Data AI Assistant"
  },
  {
    icon: "cloud",
    dayLabel: "DAY 3 · AGENTS & DEPLOY",
    phase: "Cloud Deploy & Mastery",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "Build Enterprise AI Agents that automate daily tasks",
      "Deploy live to Public Cloud using Docker & HTTPS",
      "Graduate with GitHub Portfolio & VIMS Certificate"
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
      "Search real PDFs & databases with an accurate RAG pipeline",
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
      "Real AI Agents connected to Gmail, Slack & live APIs",
      "Automate multi-step business workflows end-to-end"
    ],
    image: "/images/realtime-ai-agent-workflow.png",
    fit: "cover"
  },
  {
    id: "career-bench",
    tag: "GitHub & Career",
    title: "Live GitHub Portfolio & Career",
    points: [
      "Recruiter-ready GitHub portfolio with live deployed links",
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
        text: "Master FDE architecture & AI workflows from scratch in simple Tamil"
      },
      {
        icon: "code",
        text: "Build FastAPI backends with real LLM APIs & Structured JSON"
      },
      {
        icon: "rocket",
        text: "Run and test your first production-ready AI endpoint live"
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
        text: "Connect PDFs & company data to Vector Search live"
      },
      {
        icon: "shield",
        text: "Prevent hallucinations using Source Citations & grounding"
      },
      {
        icon: "check",
        text: "Optimize speed, retrieval accuracy & real-world prompt evaluation"
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
        text: "Build Tool-Calling AI Agents that automate real workflows"
      },
      {
        icon: "cloud",
        text: "Package with Docker and ship to a Public HTTPS Cloud URL"
      },
      {
        icon: "award",
        text: "Publish your GitHub Portfolio, Resume tips & VIMS Certificate"
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
      "Yes! Every topic is taught live in simple Tamil from the basics. By Day 2 you will build live FastAPI and RAG systems, and by Day 3 you will deploy Cloud AI Agents with a live GitHub portfolio."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "Ideal for College Students, Working Professionals, Industrialists, and anyone who wants real deployed AI projects instead of passive theory."
  },
  {
    question: "When does the workshop start, and are recordings included?",
    answer:
      "The 3-day live online workshop starts Saturday, 12th December 2026 at 10:00 AM IST. Full HD recordings, complete source code, and your VIMS Academy Certificate are included."
  }
];
