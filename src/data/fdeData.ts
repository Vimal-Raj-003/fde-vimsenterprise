export interface ShowcaseSystem {
  id: string;
  numeral: string;
  domain: string;
  title: string;
  description: string;
  architecture: string[];
  metrics: {
    latency: string;
    reliability: string;
    deployment: string;
  };
}

export interface CurriculumSprint {
  sprintCode: string;
  weeksLabel: string;
  title: string;
  subtitle: string;
  summary: string;
  topics: string[];
  deliverable: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  badge: string;
  role: string;
  bio: string;
  domains: string[];
  linkedin?: string;
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

export const SHOWCASE_SYSTEMS: ShowcaseSystem[] = [
  {
    id: "auto-rag",
    numeral: "01",
    domain: "Automotive & ECU Systems",
    title: "Automotive Diagnostic RAG Copilot",
    description:
      "Synthesizes thousands of pages of ECU fault specifications and UDS/CAN diagnostic logs to isolate root causes in under three seconds with exact manual citations.",
    architecture: [
      "Semantic Spec Chunking",
      "Hybrid Vector + BM25 Rerank",
      "Citation Guardrails",
      "FastAPI + Docker Cloud"
    ],
    metrics: {
      latency: "142 ms",
      reliability: "98.2% Grounded",
      deployment: "Production API"
    }
  },
  {
    id: "ent-agent",
    numeral: "02",
    domain: "Enterprise Operations",
    title: "Autonomous Workflow Execution Agent",
    description:
      "Integrates securely with live SQL databases, CRM webhooks, and internal REST services to execute multi-step operational workflows with full auditability.",
    architecture: [
      "Typed SQL & REST Tools",
      "Deterministic State Machine",
      "Role & Policy Validation",
      "Live Trace Observability"
    ],
    metrics: {
      latency: "185 ms",
      reliability: "99.1% Schema Valid",
      deployment: "Cloud Container"
    }
  },
  {
    id: "doc-intel",
    numeral: "03",
    domain: "Document Intelligence",
    title: "Multi-Modal Engineering Document Pipeline",
    description:
      "Extracts complex bills of materials, compliance tables, and invoices from unstructured scans directly into validated ERP payloads with confidence scoring.",
    architecture: [
      "Vision-LLM Layout Parse",
      "Strict Pydantic Contracts",
      "Async Queue Workers",
      "Webhook Delivery"
    ],
    metrics: {
      latency: "210 ms",
      reliability: "97.8% Eval Pass",
      deployment: "Event-Driven API"
    }
  },
  {
    id: "cloud-gateway",
    numeral: "04",
    domain: "Cloud AI Infrastructure",
    title: "Resilient Multi-Model Inference Gateway",
    description:
      "Routes production traffic dynamically across frontier and open-weight models with automatic failover, token budget controls, and sub-second caching.",
    architecture: [
      "Latency-Aware Routing",
      "Semantic Cache Layer",
      "Rate & Cost Guardrails",
      "Zero-Downtime CI/CD"
    ],
    metrics: {
      latency: "96 ms",
      reliability: "99.9% Uptime Design",
      deployment: "Edge + Cloud"
    }
  },
  {
    id: "eval-suite",
    numeral: "05",
    domain: "Quality & Safety Engineering",
    title: "Automated Hallucination & Eval Harness",
    description:
      "Tests every prompt, retrieval index, and agent tool call against golden industry datasets before a single line of AI code reaches customer production.",
    architecture: [
      "Golden Dataset Synthesis",
      "Faithfulness Scoring",
      "Regression Gateways",
      "SLA Telemetry Alerts"
    ],
    metrics: {
      latency: "Automated",
      reliability: "Zero Unverified Releases",
      deployment: "CI Pipeline"
    }
  }
];

export const CURRICULUM_SPRINTS: CurriculumSprint[] = [
  {
    sprintCode: "PHASE I",
    weeksLabel: "Weeks 1 & 2",
    title: "Production Python, APIs & LLM Systems Architecture",
    subtitle: "From isolated scripts to structured inference services",
    summary:
      "Move well beyond playground prompts. You will design typed backend services that communicate with frontier and open-weight LLMs reliably, enforce strict JSON schemas, and handle edge-case failures gracefully.",
    topics: [
      "The Forward Deployment Engineer (FDE) mandate inside modern AI and enterprise teams",
      "Production Python, asynchronous FastAPI services, and clean REST architecture",
      "Context window engineering, token economics, and deterministic structured outputs",
      "Pydantic contracts, automated retries, rate-limit resilience, and regression checks"
    ],
    deliverable: "Milestone I: Ship a schema-enforced AI microservice with live REST endpoints."
  },
  {
    sprintCode: "PHASE II",
    weeksLabel: "Weeks 3 & 4",
    title: "Enterprise RAG, Vector Engines & Hallucination Control",
    subtitle: "Grounding intelligence on private institutional data",
    summary:
      "Organizations cannot deploy AI that guesses. You will architect end-to-end Retrieval-Augmented Generation systems over complex PDFs, engineering manuals, and relational databases with measurable precision.",
    topics: [
      "Embeddings, semantic chunking strategies, and Vector Databases (Qdrant / pgvector)",
      "Hybrid retrieval (dense vectors + BM25) paired with cross-encoder reranking",
      "Strict citation enforcement, abstention guardrails, and hallucination elimination",
      "Quantitative evaluation harnesses measuring faithfulness, recall, and latency"
    ],
    deliverable: "Milestone II: Deploy a citation-backed Enterprise Technical Knowledge Copilot."
  },
  {
    sprintCode: "PHASE III",
    weeksLabel: "Weeks 5 & 6",
    title: "Autonomous AI Agents, Tool Calling & Cloud Deployment",
    subtitle: "Taking architectures out of localhost into live environments",
    summary:
      "Bridge the divide between local prototypes and customer production. Wire tool-calling agents into real APIs and databases, containerize with Docker, and ship to live cloud infrastructure.",
    topics: [
      "Agentic workflows: tool calling, deterministic state machines, and multi-step planning",
      "Connecting external REST APIs, webhooks, authentication, and SQL databases",
      "Docker containerization, secret management, and cloud deployment pipelines",
      "Production observability, execution tracing, latency tuning, and cost control"
    ],
    deliverable: "Milestone III: Containerized Tool-Calling AI Agent live on a public cloud URL."
  },
  {
    sprintCode: "PHASE IV",
    weeksLabel: "Weeks 7 & 8",
    title: "Industry Capstone & FDE Career Readiness",
    subtitle: "End-to-end client simulation, portfolio & interview mastery",
    summary:
      "Operate like a practicing Forward Deployment Engineer: scope an industry problem across Automotive, Enterprise, or AI SaaS, ship a complete deployment, and position your work for top roles.",
    topics: [
      "Domain capstones spanning Automotive diagnostics, Enterprise ops, and AI tools",
      "Translating client requirements into SLAs, system architecture, and deployed MVPs",
      "Executive-grade GitHub portfolio, architecture walkthroughs, and FDE resume craft",
      "Mock technical and system-deployment interviews with direct mentor feedback"
    ],
    deliverable: "Final Milestone: Full Industry Capstone + VIMS Academy Completion Certificate."
  }
];

export const MENTORS: MentorProfile[] = [
  {
    id: "guruprasath",
    name: "Guruprasath",
    badge: "Program Host",
    role: "AI Solutions & Forward Deployment Lead",
    bio: "Specializes in architecting and shipping applied LLM pipelines, enterprise RAG systems, and tool-calling agents into live customer environments. Conducts live sessions in clear, accessible Tamil.",
    domains: [
      "Applied LLMs & RAG",
      "Agentic Workflows",
      "Cloud & API Deployment",
      "Production AI Architecture"
    ]
  },
  {
    id: "gowthamraj-mahadevan",
    name: "Gowthamraj Mahadevan",
    badge: "Program Host",
    role: "ADAS & Automotive Systems Engineering · VIMS Enterprise",
    bio: "Practicing systems engineer turning complex real-world requirements into verifiable, production-grade architectures. Instills rigorous systems thinking, traceability, and industrial engineering discipline.",
    domains: [
      "Systems Engineering",
      "Automotive & ADAS",
      "Requirements Architecture",
      "Industrial Validation"
    ],
    linkedin: "https://www.linkedin.com/in/gowthamrajmahadevan/"
  },
  {
    id: "vimal-raj",
    name: "Vimal Raj",
    badge: "Supporting Mentor",
    role: "Hands-On Lab Execution & Implementation Support",
    bio: "Works closely alongside participants during weekly build labs to unblock API integrations, resolve Python and Docker setup hurdles, and ensure every learner deploys working systems on schedule.",
    domains: [
      "Live Lab Debugging",
      "API & Cloud Setup",
      "Code Walkthroughs",
      "1-on-1 Build Unblocking"
    ]
  }
];

export const STUDENT_REVIEWS: StudentReview[] = [
  {
    id: "rev-1",
    name: "Karthik Raja",
    role: "Final-Year B.E. Candidate · Chennai",
    tag: "Clarity & Depth",
    quote:
      "I had watched countless AI playlists online without understanding how an actual company ships a reliable system. Hearing working engineers break down production architecture step by step in live Tamil sessions made everything click effortlessly."
  },
  {
    id: "rev-2",
    name: "Priya Dharshini",
    role: "Software Developer · Coimbatore",
    tag: "Production Confidence",
    quote:
      "Rather than toy notebook scripts, we built structured APIs, grounded retrieval pipelines, and live deployments. Walking into interviews with deployed engineering projects completely transformed how hiring managers evaluated me."
  },
  {
    id: "rev-3",
    name: "Arun Prakash",
    role: "Embedded Engineer Transitioning to Applied AI · Bengaluru",
    tag: "Systems Perspective",
    quote:
      "Coming from core engineering, I wondered how my background would fit modern AI. Gowthamraj and the VIMS team connected real systems engineering discipline directly to Forward Deployment AI roles."
  },
  {
    id: "rev-4",
    name: "vigneshwaran M",
    role: "Full-Stack Developer · Madurai",
    tag: "Hands-On Mentorship",
    quote:
      "Whenever my Docker build or vector retrieval pipeline hit an edge case, Vimal Raj and the hosts helped debug the exact root cause live. It felt like working inside a real engineering team rather than taking a course."
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What defines a Forward Deployment Engineer (FDE), and why is demand surging?",
    answer:
      "While many candidates stop at prompt writing or isolated notebooks, companies urgently need engineers who can take LLMs, RAG pipelines, and AI agents and integrate them into real customer APIs, databases, and cloud infrastructure. Pioneered by leaders like Palantir and OpenAI, the FDE role bridges cutting-edge AI with real-world production reliability."
  },
  {
    question: "What language are the live sessions conducted in?",
    answer:
      "All live online classes, architectural walkthroughs, and interactive Q&A sessions are taught in Tamil so you absorb complex concepts naturally, while all code, frameworks, and technical terminology follow global English engineering standards."
  },
  {
    question: "What prior coding or math background is expected?",
    answer:
      "Advanced calculus or ML research experience is not required. Foundational programming logic is sufficient. Phase I builds your production Python, FastAPI, and LLM API skills systematically, backed by continuous lab support from our mentoring team."
  },
  {
    question: "Are session recordings and source repositories provided if I miss a live class?",
    answer:
      "Yes. Full HD recordings, complete GitHub starter repositories, and deployment checklists are shared after every session so both university students and working engineers can progress smoothly."
  },
  {
    question: "How is the program fee structured, and how do I lock my enrollment?",
    answer:
      "The complete 8-week cohort fee is ₹2,999 + 18% GST (₹3,539 total, one-time payment with official GST invoice). Click Reserve Your Seat to view live seat availability and complete instant checkout via Razorpay (UPI, GPay, PhonePe, Cards, or NetBanking)."
  },
  {
    question: "Do participants receive certification and career preparation?",
    answer:
      "Yes. Graduates who complete the industry capstone receive a verified Completion Certificate from VIMS Academy (Powered by award-winning VIMS Enterprise), alongside GitHub portfolio structuring, FDE resume refinement, and mock technical interviews."
  }
];
