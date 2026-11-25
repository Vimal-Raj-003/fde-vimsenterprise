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
  durationLabel: "1-Week Intensive Program"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    icon: "rocket",
    dayLabel: "DAY 1 · RAPID CLARITY",
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
    dayLabel: "DAY 2 · CORE MASTERY",
    phase: "Real-World RAG Build",
    title: "Build Real RAG & Vector Systems",
    points: [
      "Connect PDFs & Company Databases to live AI models",
      "Eliminate wrong answers with accurate RAG retrieval",
      "Ship a working Enterprise AI Assistant in 48 hours"
    ],
    milestone: "Day 2 Output: Live Data AI Assistant"
  },
  {
    icon: "cloud",
    dayLabel: "DAYS 3 - 7 · DEPLOY",
    phase: "Cloud Deploy & Career",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "Build Enterprise AI Agents that automate daily tasks",
      "Deploy live to Public Cloud using Docker & HTTPS",
      "Graduate with GitHub Portfolio & VIMS Certificate"
    ],
    milestone: "Final Output: Live Cloud URLs + Certificate"
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
    sprintCode: "DAYS 1 - 2",
    daysLabel: "First 2 Days",
    title: "Full FDE Architecture, APIs & RAG",
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
        icon: "database",
        text: "Connect PDFs & company data to Vector Search by Day 2"
      }
    ],
    output: "Within 48 Hours: Your First Live Knowledge AI API"
  },
  {
    sprintCode: "DAYS 3 - 4",
    daysLabel: "Enterprise RAG",
    title: "Citation Accuracy & Production Tuning",
    points: [
      {
        icon: "shield",
        text: "Prevent hallucinations using Source Citations & grounding"
      },
      {
        icon: "rocket",
        text: "Optimize response speed & multi-document retrieval"
      },
      {
        icon: "check",
        text: "Production accuracy testing & real-world prompt evaluation"
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
        text: "Build Tool-Calling AI Agents that execute real tasks"
      },
      {
        icon: "cloud",
        text: "Package with Docker and ship to a Public HTTPS Cloud URL"
      },
      {
        icon: "shield",
        text: "Configure API security, cost controls & live monitoring"
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
        text: "Publish your 1-week live AI projects to a GitHub Portfolio"
      },
      {
        icon: "rocket",
        text: "Resume refinement & Mock Interview prep for FDE roles"
      },
      {
        icon: "award",
        text: "Earn your verified VIMS Academy Completion Certificate"
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
    role: "Final-Year Student · Chennai",
    tag: "Student",
    quote: "Super clear teaching in Tamil. Understood RAG and APIs in two days."
  },
  {
    id: "r2",
    name: "Priya Dharshini",
    role: "Software Developer · Coimbatore",
    tag: "Working Pro",
    quote: "Built and deployed my first live AI project in one week!"
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
    question: "Can complete beginners learn this in 1 week?",
    answer:
      "Yes! Every topic is taught live in simple Tamil from the basics. You will gain full clarity on FastAPI, LLMs, and RAG in the first 2 days, and ship live Cloud AI Agents by Day 7."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "Ideal for College Students, Working Professionals, Industrialists, and anyone who wants real deployed AI projects instead of passive theory."
  },
  {
    question: "When does the class start, and are recordings included?",
    answer:
      "The live online batch starts Saturday, 12th December 2026 at 10:00 AM IST. Full HD recordings, complete source code, and your VIMS Academy Certificate are included."
  }
];
