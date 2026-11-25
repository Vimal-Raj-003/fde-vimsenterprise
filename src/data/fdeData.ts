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
  languageLabel: "நேரடி தமிழ் வகுப்பு",
  audienceLabel: "College Students & Working Professionals",
  durationLabel: "1-Week Intensive Program"
};

export const RAPID_MASTERY_STEPS: RapidMasteryStep[] = [
  {
    icon: "rocket",
    dayLabel: "DAY 1 · RAPID CLARITY",
    phase: "தொடக்கம் முதலே தெளிவு",
    title: "Grasp Full AI Stack & Live APIs",
    points: [
      "அடிப்படை FDE கட்டமைப்பை எளிமையாகப் புரிந்துகொள்ளுதல்",
      "உங்கள் முதல் FastAPI + LLM Live API உருவாக்கம்",
      "புரியாத ஆங்கில வார்த்தைகள் இன்றி நேரடி demo"
    ],
    milestone: "Day 1 இரவே உங்கள் முதல் Live AI API ரெடி"
  },
  {
    icon: "database",
    dayLabel: "DAY 2 · CORE MASTERY",
    phase: "நேரடி ப்ராஜெக்ட் பயிற்சி",
    title: "Build Real RAG & Vector Systems",
    points: [
      "PDF கோப்புகள் & Company Data-வை AI உடன் இணைத்தல்",
      "தவறான பதில்கள் இல்லாமல் துல்லியமான RAG output",
      "48 மணி நேரத்தில் செயல்படும் AI Assistant"
    ],
    milestone: "2 நாட்களில் Live Data AI Assistant ரெடி"
  },
  {
    icon: "cloud",
    dayLabel: "DAYS 3 - 7 · DEPLOY",
    phase: "லைவ் கிளவுட் & வேலைவாய்ப்பு",
    title: "Ship AI Agents & Live Portfolio",
    points: [
      "வேலைகளைத் தானாகச் செய்யும் Enterprise AI Agents",
      "Docker & HTTPS மூலம் நேரடியாக Cloud Deploy",
      "GitHub Portfolio + VIMS Academy சான்றிதழ்"
    ],
    milestone: "Public Cloud URLs + VIMS சான்றிதழ்"
  }
];

export const VISUAL_PROJECTS: VisualProjectCard[] = [
  {
    id: "llm-rag",
    tag: "RAG Architecture",
    title: "LLMs, RAG & Vector Search",
    points: [
      "PDF & Database-ஐ தேடி பதில் தரும் RAG pipeline",
      "Hallucination இல்லாத Enterprise Knowledge AI"
    ],
    image: "/images/realtime-rag-architecture.jpg"
  },
  {
    id: "cloud-api",
    tag: "FastAPI & Cloud",
    title: "Live FastAPI & Swagger Endpoints",
    points: [
      "Production Python REST APIs with Swagger /docs",
      "Docker மூலம் Live HTTPS Cloud Deployment"
    ],
    image: "/images/realtime-fastapi-swagger.png"
  },
  {
    id: "ai-agents",
    tag: "AI Agent Workflow",
    title: "Autonomous Enterprise AI Agents",
    points: [
      "Gmail, Slack & Tools இணைக்கும் real AI Agents",
      "Multi-step office workflows-ஐ automate செய்தல்"
    ],
    image: "/images/realtime-ai-agent-workflow.png"
  },
  {
    id: "career-bench",
    tag: "GitHub Portfolio",
    title: "Live GitHub & Career Readiness",
    points: [
      "Hiring teams செக் செய்யும் Active GitHub profile",
      "Resume, Mock Interview & VIMS சான்றிதழ்"
    ],
    image: "/images/realtime-github-activity.png"
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "DAYS 1 - 2",
    daysLabel: "முதல் 2 நாட்கள்: அடிப்படை",
    title: "Full FDE Architecture, APIs & RAG",
    points: [
      {
        icon: "brain",
        text: "FDE architecture & AI workflow-ஐ முழுமையாகத் தமிழில் புரிந்துகொள்ளுதல்"
      },
      {
        icon: "code",
        text: "FastAPI backend + Real LLM APIs & Structured JSON நேரடி பயிற்சி"
      },
      {
        icon: "database",
        text: "PDFs & Company Data-வை Vector Search உடன் Day 2-லேயே இணைத்தல்"
      }
    ],
    output: "48 மணி நேரத்தில்: உங்கள் முதல் Live Knowledge AI API ரெடி"
  },
  {
    sprintCode: "DAYS 3 - 4",
    daysLabel: "Enterprise RAG பயிற்சி",
    title: "Citation Accuracy & Production Tuning",
    points: [
      {
        icon: "shield",
        text: "AI தவறான பதில்களைத் தடுக்கும் Source Citation நுட்பங்கள்"
      },
      {
        icon: "rocket",
        text: "வேகமான பதில் மற்றும் multi-document retrieval optimization"
      },
      {
        icon: "check",
        text: "கம்பெனி தரத்தில் AI accuracy testing மற்றும் production tuning"
      }
    ],
    output: "நடு வார Build: Production Grounded Document Assistant"
  },
  {
    sprintCode: "DAYS 5 - 6",
    daysLabel: "AI Agents & Live Cloud",
    title: "Autonomous Agents & Docker Cloud",
    points: [
      {
        icon: "agent",
        text: "வேலைகளைத் தானாகச் செய்யும் Tool-Calling AI Agents உருவாக்கம்"
      },
      {
        icon: "cloud",
        text: "Docker மூலம் package செய்து Public HTTPS Cloud URL-இல் Live செய்தல்"
      },
      {
        icon: "shield",
        text: "API பாதுகாப்பு, செலவு கட்டுப்பாடு மற்றும் live monitoring"
      }
    ],
    output: "Live Cloud Build: Public HTTPS AI Agent System"
  },
  {
    sprintCode: "DAY 7",
    daysLabel: "வேலைவாய்ப்பு & சான்றிதழ்",
    title: "Capstone Review & Interview Readiness",
    points: [
      {
        icon: "portfolio",
        text: "உங்கள் 1 வார AI ப்ராஜெக்ட்களை GitHub Portfolio-வாக வெளியிடுதல்"
      },
      {
        icon: "rocket",
        text: "Students & Working Pros-க்கான Resume + Interview வழிகாட்டல்"
      },
      {
        icon: "award",
        text: "அதிகாரப்பூர்வ VIMS Academy Completion Certificate பெறுதல்"
      }
    ],
    output: "நிறைவு: Live Portfolio + VIMS Academy சான்றிதழ்"
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
    question: "1 வாரத்தில் Beginners கூட கத்துக்க முடியுமா?",
    answer:
      "நிச்சயமாக! அடிப்படைகளில் இருந்து முழுமையாகத் தமிழ்லயே கத்துக்கலாம். முதல் 2 நாட்களிலேயே FastAPI, LLMs & RAG workflow புரிந்துவிடும்; Days 3 முதல் 7-க்குள் Live Cloud AI Agents & Portfolio முடித்துவிடுவீர்கள்."
  },
  {
    question: "Who should join this FDE live class?",
    answer:
      "Tailored for College Students, Freshers, and Working Professionals (both IT and Core engineers) who want production-deployed AI projects rather than passive theory."
  },
  {
    question: "வகுப்பு எப்போது தொடங்கும்? Recordings கிடைக்குமா?",
    answer:
      "Saturday, 12th December 2026 காலை 10:00 AM IST-க்கு நேரலை வகுப்பு தொடங்கும். Full HD recordings, source code, மற்றும் VIMS Academy Certificate வழங்கப்படும்."
  }
];
