import type { Icon3DName } from "../components/Icons3D";

export interface VisualProjectCard {
  id: string;
  tag: string;
  title: string;
  points: string[];
  image: string;
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
  languageLabel: "Live in தமிழ்",
  audienceLabel: "College Students & Working Professionals",
  durationLabel: "1-Week Intensive Program"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    icon: "rocket",
    dayLabel: "DAY 1 · RAPID CLARITY",
    phase: "தமிழில் எளிய விளக்கம்",
    title: "Grasp Full AI Stack & Live APIs",
    points: [
      "Clear beginner-friendly FDE basics (தமிழில்)",
      "Build your first FastAPI + LLM live endpoint",
      "Zero confusing jargon, 100% practical demo"
    ],
    milestone: "First Live AI Endpoint Running on Day 1"
  },
  {
    icon: "database",
    dayLabel: "DAY 2 · CORE MASTERY",
    phase: "Hands-On Immersion",
    title: "Build Real RAG & Vector Systems",
    points: [
      "Connect real PDFs & company SQL databases",
      "Accurate answers with zero hallucinations",
      "Working AI assistant built inside 48 hours"
    ],
    milestone: "Knowledge AI Assistant Built in 48 Hours"
  },
  {
    icon: "cloud",
    dayLabel: "DAYS 3 - 7 · DEPLOY",
    phase: "Agents, Cloud & Readiness",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "Build task-automating Enterprise AI Agents",
      "Deploy live to Cloud with Docker & HTTPS",
      "GitHub showcase + VIMS Academy Certificate"
    ],
    milestone: "Public Cloud Portfolio + Certificate"
  }
];

export const VISUAL_PROJECTS: VisualProjectCard[] = [
  {
    id: "llm-rag",
    tag: "Real-World AI",
    title: "LLMs, RAG & Vector Search",
    points: [
      "Embeddings & Vector DB grounded Q&A",
      "Built for real company PDFs & data"
    ],
    image: "/images/real-fde-rag-code.jpg"
  },
  {
    id: "cloud-api",
    tag: "Cloud & APIs",
    title: "Live FastAPI & Docker Deployment",
    points: [
      "Production Python APIs with FastAPI",
      "Dockerized live HTTPS cloud URLs"
    ],
    image: "/images/real-fde-cloud-deploy.jpg"
  },
  {
    id: "ai-agents",
    tag: "AI Agents",
    title: "Autonomous Enterprise AI Agents",
    points: [
      "Multi-step tool-calling AI workflows",
      "Real-world engineering automation"
    ],
    image: "/images/real-fde-agents-team.jpg"
  },
  {
    id: "career-bench",
    tag: "Job Readiness",
    title: "Portfolio, Resume & Interviews",
    points: [
      "Live GitHub projects hiring teams test",
      "Official VIMS Academy Certificate"
    ],
    image: "/images/real-fde-career-interview.jpg"
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "DAYS 1 - 2",
    daysLabel: "Deep Core Jumpstart",
    title: "Full FDE Architecture, APIs & RAG",
    points: [
      {
        icon: "brain",
        text: "Complete FDE system mental model (நீங்க தமிழ்லயே கத்துக்கலாம்)"
      },
      {
        icon: "code",
        text: "FastAPI backend setup, real LLM APIs & structured JSON outputs"
      },
      {
        icon: "database",
        text: "Connect PDFs & databases with Vector Search right inside Day 2"
      }
    ],
    output: "First 48 Hours: Live Knowledge AI API Service Running"
  },
  {
    sprintCode: "DAYS 3 - 4",
    daysLabel: "Enterprise RAG",
    title: "Citation Accuracy & Production Tuning",
    points: [
      {
        icon: "shield",
        text: "Stop AI hallucinations using grounded enterprise source citations"
      },
      {
        icon: "rocket",
        text: "Optimize latency, chunking strategy, and multi-document retrieval"
      },
      {
        icon: "check",
        text: "Evaluate response reliability like top AI forward deployment teams"
      }
    ],
    output: "Mid-Week Build: Production Grounded Document Assistant"
  },
  {
    sprintCode: "DAYS 5 - 6",
    daysLabel: "Agents & Cloud",
    title: "Autonomous Agents & Docker Cloud",
    points: [
      {
        icon: "agent",
        text: "Build tool-calling AI Agents that automate multi-step engineering tasks"
      },
      {
        icon: "cloud",
        text: "Package cleanly with Docker and ship to a public HTTPS Cloud URL"
      },
      {
        icon: "shield",
        text: "API key security, cost guardrails, and live production monitoring"
      }
    ],
    output: "Live Cloud Build: Public HTTPS AI Agent System"
  },
  {
    sprintCode: "DAY 7",
    daysLabel: "Showcase & Career",
    title: "Capstone Review & Interview Readiness",
    points: [
      {
        icon: "portfolio",
        text: "Publish your complete 1-week AI engineering showcase on GitHub"
      },
      {
        icon: "rocket",
        text: "Role-ready resume & system walkthrough prep for Students and Pros"
      },
      {
        icon: "award",
        text: "Graduate with your official VIMS Academy Completion Certificate"
      }
    ],
    output: "Graduation: Deployed Portfolio + Verified Certificate"
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
    question: "How much can beginners learn in a 1-Week program?",
    answer:
      "நீங்க தமிழ்லயே அடிப்படைகளில் இருந்து கத்துக்கலாம். Within the first 2 days, you grasp the full FDE stack (FastAPI, LLMs & RAG), and spend Days 3 to 7 shipping Cloud AI Agents and portfolio projects."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "Tailored for College Students, Freshers, and Working Professionals (both IT and Core engineers) who want production-deployed AI projects rather than passive theory."
  },
  {
    question: "When does the batch start & are recordings provided?",
    answer:
      "Live classes kick off on Saturday, 12th December 2026 at 10:00 AM IST. Full HD recordings, complete source code, and an official VIMS Academy Certificate are included."
  }
];
