export interface VisualProjectCard {
  id: string;
  tag: string;
  title: string;
  shortLine: string;
  image: string;
}

export interface CurriculumSprint {
  sprintCode: string;
  weeksLabel: string;
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
  durationLabel: "8-Week Hands-On Program"
};

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
    shortLine: "Graduate with deployed GitHub links and a VIMS Enterprise certificate.",
    image: "/images/hil-test-bench.jpg"
  }
];

export const WHY_FDE_CARDS = [
  {
    step: "01",
    label: "Normal Courses",
    title: "Only Theory & Basic Prompts",
    line: "Watching videos and notebook scripts that never run inside a real company."
  },
  {
    step: "02",
    label: "VIMS FDE Class",
    title: "Build & Deploy Live in Tamil",
    line: "Step-by-step LLMs, RAG, AI Agents, and Cloud API deployment taught clearly in Tamil."
  },
  {
    step: "03",
    label: "Your Outcome",
    title: "Job-Ready FDE Portfolio",
    line: "Stand out as a Student or Working Professional with live deployed AI projects."
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "WEEKS 1 - 2",
    weeksLabel: "Foundation",
    title: "Python APIs & LLM Fundamentals",
    points: [
      "What a Forward Deployment Engineer (FDE) does in top AI teams",
      "FastAPI backend setup & connecting real LLM APIs",
      "Structured JSON outputs without broken responses"
    ],
    output: "Build 1: Live Structured AI API Service"
  },
  {
    sprintCode: "WEEKS 3 - 4",
    weeksLabel: "RAG Systems",
    title: "Company Data AI & Vector Search",
    points: [
      "Connect PDFs, documents & SQL databases using Vector DBs",
      "Stop AI hallucinations with accurate source citations",
      "Test accuracy and speed for real business queries"
    ],
    output: "Build 2: Document & Knowledge AI Assistant"
  },
  {
    sprintCode: "WEEKS 5 - 6",
    weeksLabel: "Agents & Cloud",
    title: "AI Agents & Live Cloud Deployment",
    points: [
      "Build tool-calling AI Agents that automate real tasks",
      "Package with Docker and deploy to a public Cloud URL",
      "API security, cost control & live monitoring"
    ],
    output: "Build 3: Cloud-Deployed Autonomous AI Agent"
  },
  {
    sprintCode: "WEEKS 7 - 8",
    weeksLabel: "Career Launch",
    title: "Industry Capstone & Interview Prep",
    points: [
      "End-to-end Enterprise & Automotive AI capstone project",
      "GitHub portfolio & FDE resume building for Students & Pros",
      "Mock interviews & VIMS Enterprise Completion Certificate"
    ],
    output: "Final Output: Industry Capstone + Verified Certificate"
  }
];

export const MENTORS: MentorProfile[] = [
  {
    id: "guruprasath",
    name: "Guruprasath",
    badge: "Program Host",
    simpleLine: "AI Solutions & Forward Deployment Lead · VIMS Enterprise",
    photo: "/images/mentor-guruprasath.jpg"
  },
  {
    id: "gowthamraj",
    name: "Gowthamraj Mahadevan",
    badge: "Program Host",
    simpleLine: "ADAS & Systems Engineering Lead · VIMS Enterprise",
    photo: "/images/mentor-gowthamraj.jpg"
  },
  {
    id: "vimalraj",
    name: "Vimal Raj",
    badge: "Supporting Mentor",
    simpleLine: "Hands-On Lab & Student Project Support · VIMS Academy",
    photo: "/images/mentor-vimalraj.jpg"
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
      "I watched dozens of playlists without knowing how companies ship real AI. Learning live APIs and Cloud deployment in Tamil made everything crystal clear."
  },
  {
    id: "r2",
    name: "Priya Dharshini",
    role: "Software Developer · Coimbatore",
    tag: "Working IT Pro",
    quote:
      "Walking into technical interviews with live deployed RAG and Agent URLs changed how hiring managers evaluated me compared to standard certificate holders."
  },
  {
    id: "r3",
    name: "Arun Prakash",
    role: "Working Core Engineer · Bengaluru",
    tag: "Core-to-AI Switch",
    quote:
      "Switching from core engineering into practical AI felt tough until VIMS mentors guided me step by step from Python fundamentals to live deployment."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Who can join this FDE program?",
    answer:
      "Specially designed for College Students (all engineering/CS/IT streams), Freshers, and Working Professionals (IT or Core engineers) looking to move into high-demand AI engineering roles."
  },
  {
    question: "When does the class start and what is the teaching language?",
    answer:
      "The batch starts on Saturday, 12th December 2026 at 10:00 AM IST (Live Online). All concepts are taught clearly in Tamil while using standard English technical terms."
  },
  {
    question: "Do I get recordings and a certificate?",
    answer:
      "Yes! Every live session recording, full source code, and an official VIMS Enterprise Completion Certificate are included."
  },
  {
    question: "What is the program fee?",
    answer:
      "One-time fee of ₹2,999 + 18% GST (₹3,539 total). Only 50 seats are available so mentors can guide every participant personally."
  }
];
