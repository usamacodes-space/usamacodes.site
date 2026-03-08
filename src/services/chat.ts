import { CONTACT_EMAIL, FAQ_ITEMS, PROJECTS } from "../constants";

const DEBUG = import.meta.env.DEV;
const CHAT_COOLDOWN_MS = 2000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 500;

let lastRequestTime = 0;

/** Normalize text for matching: lowercase, collapse whitespace, extract words. */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreMatch(queryWords: string[], target: string): number {
  const targetWords = new Set(tokenize(target));
  let score = 0;
  for (const w of queryWords) {
    if (targetWords.has(w)) score += 2;
    else if ([...targetWords].some((t) => t.includes(w) || w.includes(t)))
      score += 1;
  }
  return score;
}

const PROMPT_MAPPINGS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["qr", "menu", "saas"],
    answer:
      "QR Menu SaaS is a full-stack restaurant management platform I built solo using Next.js, Express.js, PostgreSQL, and Prisma. It features multi-tenant architecture supporting multiple restaurants with isolated data and custom branding. Key features include role-based dashboards (Owner, Manager, Customer), dynamic QR code generation tied to tables/branches, subscription billing via Stripe (Free, Pro, Enterprise tiers), a drag-and-drop menu builder with dietary tags and pricing variants, real-time order notifications to kitchen displays via WebSocket, and an analytics dashboard showing item popularity and revenue. The main challenges were building RBAC across multi-tenant isolation, programmatic QR generation with metadata, and handling concurrent menu edits with optimistic locking.",
  },
  {
    keywords: ["chatdocs", "document", "chat", "upload", "pdf"],
    answer:
      "ChatDocs is an AI-powered document chat system I built using LangChain, FastAPI, Ollama (Llama 2/Mistral), Python, React, and ChromaDB. Users upload PDFs, Word docs, or text files and ask questions in natural language. The RAG pipeline works as: document upload → parse (PyPDF2) → chunk (recursive text splitter, 500-token chunks, 50-token overlap) → embed (sentence-transformers) → store in ChromaDB. At query time: embed the question → similarity search (top-k=5 chunks) → construct prompt with context → LLM inference → return answer with source citations. It supports conversation memory for follow-up questions, and all processing is local via Ollama for data privacy.",
  },
  {
    keywords: ["gx", "tickets", "ticketing", "event"],
    answer:
      "GX Tickets is an enterprise-grade ticketing and event workflow system I built as a backend developer using NestJS, PostgreSQL, Prisma, JWT, Redis, and Docker. It features secure RESTful APIs with RBAC (admin, organizer, attendee), event CRUD with rich metadata (venue, capacity, pricing tiers, promo codes), ticket purchasing with inventory management and seat selection, QR-based ticket validation at check-in, audit logging for all admin actions, Redis-based rate limiting for high-demand ticket drops, automated email notifications, and admin analytics APIs. I solved race conditions during concurrent purchases using pessimistic locking and designed schemas supporting thousands of events with millions of tickets.",
  },
  {
    keywords: ["quiktix", "clean", "architecture", "scalable"],
    answer:
      "QuikTix is a collaborative backend project focused on Clean Architecture principles using NestJS, PostgreSQL, and Docker. It features strict layer separation (domain entities, use cases, interface adapters, infrastructure), the Repository pattern with Prisma fully decoupled from business logic, versioned REST APIs (v1/v2) with pagination/filtering/sorting, class-validator input validation, custom exception filters, and Jest testing achieving 80%+ coverage. The key challenge was enforcing architectural boundaries in a team setting while balancing schema normalization with query performance.",
  },
  {
    keywords: ["optimize", "postgresql", "postgres", "queries", "database", "indexing"],
    answer:
      "For PostgreSQL optimization, I focus on: proper indexing (B-tree, GIN, partial indexes on frequently queried columns), using EXPLAIN ANALYZE for query profiling, Prisma's select/include to avoid over-fetching, raw queries for complex aggregations, connection pooling, avoiding N+1 queries with eager loading, CTEs and window functions for complex analytics, and schema design balancing normalization with performance. At FBM Solutions, I reduced average API response time by 40% through these techniques combined with Redis caching layers.",
  },
  {
    keywords: ["rag", "pipeline", "langchain", "retrieval", "augmented"],
    answer:
      "I build end-to-end RAG (Retrieval-Augmented Generation) pipelines. My approach: document ingestion (PyPDF2, python-docx) → chunking (recursive text splitter, optimized 500-token chunks with 50-token overlap) → embedding (sentence-transformers) → vector storage (ChromaDB/FAISS) → at query time: embed the question, similarity search for top-k relevant chunks, assemble context with the prompt, and run LLM inference via Ollama. I use LangChain to orchestrate chains, agents, and prompt templates. Key optimizations include chunk size tuning for retrieval accuracy, strict context-only prompting to reduce hallucination, and conversation memory for follow-up questions.",
  },
  {
    keywords: ["msc", "keele", "university", "masters", "postgraduate"],
    answer:
      "I'm currently pursuing an MSc in Artificial Intelligence & Data Science at Keele University, UK (Sep 2025 – Sep 2026). My focus areas include deep learning, NLP, computer vision, data mining, statistical modeling, and practical deployment of AI systems. The coursework covers neural networks, reinforcement learning, big data analytics, and research methods. I'm building on my backend and RAG experience to combine scalable software engineering with modern ML workflows. My thesis is expected to focus on applied NLP or RAG system optimization.",
  },
  {
    keywords: ["nestjs", "nest", "backend", "framework"],
    answer:
      "NestJS is my primary backend framework — I'm at expert level. I've built modular monoliths and microservices with it. I'm proficient with modules, controllers, services, guards, interceptors, pipes, custom decorators, middleware, exception filters, and dynamic modules. I use @nestjs/swagger for auto-generated API docs, @nestjs/schedule for cron jobs, and @nestjs/websockets for real-time features. At FBM Solutions, I migrated a legacy Express.js monolith to a modular NestJS microservice architecture.",
  },
  {
    keywords: ["docker", "container", "deploy", "devops"],
    answer:
      "I use Docker extensively for development and deployment. I write multi-stage Dockerfiles for optimized production images, use Docker Compose for local orchestration of multi-service stacks (API + PostgreSQL + Redis), and ensure environment parity across dev/staging/production. I configure health checks, volume management, and network isolation. At FBM Solutions, I standardized all services to Docker containers, significantly reducing deployment issues.",
  },
  {
    keywords: ["socket", "websocket", "realtime", "real-time", "live"],
    answer:
      "I build real-time features using Socket.io with NestJS. I've implemented live notifications, chat systems, and collaborative editing features. I'm experienced with rooms (grouping connections), namespaces (separating concerns), acknowledgements (delivery confirmation), and reconnection handling. At FBM Solutions, I built an event-driven architecture handling 5,000+ concurrent WebSocket connections for real-time updates.",
  },
  {
    keywords: ["redis", "cache", "caching", "session"],
    answer:
      "I use Redis for multiple purposes: API response caching to reduce database load, session storage for stateless authentication, rate limiting to prevent API abuse, and pub/sub messaging for inter-service communication. At FBM Solutions, combining Redis caching with PostgreSQL query optimization helped reduce average API response time by 40%.",
  },
  {
    keywords: ["react", "frontend", "component", "hooks"],
    answer:
      "On the frontend, I use React with TypeScript. I'm proficient with hooks (useState, useEffect, useRef, useCallback, useMemo), context API for state management, React.lazy/Suspense for code splitting, and performance optimization through memoization and virtualization. This portfolio site itself is built with React, Material UI, Tailwind CSS, and GSAP animations.",
  },
  {
    keywords: ["nextjs", "next", "ssr", "server"],
    answer:
      "I use Next.js for full-stack applications. I'm experienced with server-side rendering (SSR), static site generation (SSG), API routes for backend logic, middleware for auth/redirects, the App Router architecture, and built-in image optimization. I used Next.js 14 for the QR Menu SaaS project.",
  },
  {
    keywords: ["typescript", "type", "typed", "types"],
    answer:
      "TypeScript is used across all my projects — both frontend and backend. I enforce strict mode everywhere and am proficient with generics, utility types (Partial, Required, Pick, Omit), discriminated unions, type guards, declaration files, and interface/type composition. Type safety is a core part of my development philosophy.",
  },
  {
    keywords: ["prisma", "orm", "migration", "schema"],
    answer:
      "Prisma is my primary ORM for PostgreSQL. I'm proficient with schema definitions, migrations, relations (one-to-one, one-to-many, many-to-many), nested writes, raw SQL queries when needed, Prisma middleware for logging/auditing, and connection pooling. I use Prisma's type-safe client generation to ensure compile-time database query safety.",
  },
  {
    keywords: ["fastapi", "python", "microservice", "ai"],
    answer:
      "I use FastAPI for building lightweight, high-performance AI microservices. It's my go-to for AI endpoints because of its async support, automatic OpenAPI docs, Pydantic validation, dependency injection, and background task handling. In ChatDocs, FastAPI serves as the bridge between the React frontend and the LangChain/Ollama AI pipeline.",
  },
  {
    keywords: ["ollama", "llm", "local", "model", "inference"],
    answer:
      "I use Ollama for local LLM deployment and inference. I've worked with Llama 2, Mistral, and other open-source models. I'm experienced with model management, context window tuning, temperature/top-p configuration, and integrating Ollama with LangChain and FastAPI. Local deployment via Ollama ensures data privacy — no data leaves the user's machine.",
  },
  {
    keywords: ["jwt", "auth", "authentication", "security", "bcrypt", "rbac"],
    answer:
      "I implement production-grade authentication using JWT (access + refresh token rotation), bcrypt for password hashing, and fine-grained RBAC supporting hierarchical roles (super-admin, admin, manager, user). At FBM Solutions, I designed a reusable authentication module that was adopted across 3 company products. I also implement secure session management with Redis and protect APIs with guards and middleware.",
  },
  {
    keywords: ["rest", "api", "design", "endpoint"],
    answer:
      "I design RESTful APIs following best practices: proper HTTP methods, resource-based URLs, versioning (URI and header-based), pagination (cursor and offset), filtering, sorting, error response standardization with custom exception filters, and comprehensive documentation with Swagger/OpenAPI. At FBM Solutions, I built high-availability APIs serving thousands of concurrent users.",
  },
  {
    keywords: ["fbm", "solutions", "company", "job", "work", "employment"],
    answer:
      "I worked as a Software Engineer at FBM Solutions (Pvt) Ltd for 2 years (Oct 2023 – Sep 2025), remotely. I built and maintained REST APIs and WebSocket services in NestJS, designed PostgreSQL schemas, implemented JWT/RBAC auth, deployed with Docker, integrated AI features, and implemented Redis caching. Key achievements: reduced API response time by 40%, designed a reusable auth module adopted across 3 products, migrated a legacy Express.js monolith to NestJS microservices, and built real-time systems handling 5,000+ concurrent WebSocket connections.",
  },
  {
    keywords: ["git", "version", "control", "github", "collaboration"],
    answer:
      "I use Git for all projects with branching strategies (Git Flow, trunk-based development). I'm comfortable with rebasing, cherry-picking, and collaborative workflows using pull requests with code reviews. My code is hosted on GitHub at github.com/usamacodes-space. I also set up CI/CD pipelines with GitHub Actions for automated testing and deployment.",
  },
  {
    keywords: ["test", "testing", "jest", "vitest", "coverage"],
    answer:
      "I write unit and integration tests using Jest and Vitest. For React components I use React Testing Library, and for NestJS APIs I use Supertest. In the QuikTix project, I achieved 80%+ code coverage. I believe in testing business-critical paths thoroughly while maintaining pragmatic coverage targets.",
  },
  {
    keywords: ["tailwind", "css", "styling", "design", "responsive"],
    answer:
      "I use Tailwind CSS for utility-first styling with mobile-first responsive breakpoints, custom themes via CSS variables, animations, and dark mode support. This portfolio site is styled with Tailwind CSS combined with Material UI components. I'm experienced with responsive design that works across all devices from phones to desktops.",
  },
  {
    keywords: ["methodology", "agile", "scrum", "process", "workflow"],
    answer:
      "I'm an Agile/Scrum practitioner with experience in sprint planning, daily standups, and retrospectives. I'm a strong advocate for clean code, SOLID principles, and design patterns (Repository, Factory, Strategy, Observer). I emphasize type safety, comprehensive error handling, code reviews, and documentation-driven development.",
  },
  {
    keywords: ["freelance", "hire", "available", "availability", "contract"],
    answer:
      "I'm currently based in Stoke-on-Trent, UK, and available for freelance/contract work alongside my MSc studies. I'm open to remote, hybrid, or on-site roles within the UK. Best way to reach me is via email at hello@usamacodes.space or LinkedIn (linkedin.com/in/usamacodes-space). I speak English (professional) and Urdu (native).",
  },
  {
    keywords: ["bs", "bachelor", "uet", "undergraduate", "software", "engineering"],
    answer:
      "I hold a BS in Software Engineering from the University of Engineering & Technology (UET), Pakistan (2019–2025). Coursework included data structures & algorithms, OOP, database systems, software architecture, OS, computer networks, web engineering, and software testing. I completed a senior year capstone project and gained a strong foundation in design patterns and system design.",
  },
];

function ruleBasedQuery(prompt: string): string {
  const text = prompt.trim() || "What can you tell me about Usama?";
  const words = tokenize(text);

  const outOfScopeTopics = ["game", "gaming", "hobby", "hobbies", "sport", "music", "film", "movie", "travel", "personal"];
  if (words.some((w) => outOfScopeTopics.some((t) => w.includes(t) || t.includes(w)))) {
    return `I don't have that information in my portfolio. Please reach out at ${CONTACT_EMAIL} for more details.`;
  }

  for (const { keywords, answer } of PROMPT_MAPPINGS) {
    const matchCount = keywords.filter((k) =>
      words.some((w) => w.length >= 3 && (w.includes(k) || k.includes(w)))
    ).length;
    if (matchCount >= 2) return answer;
  }

  let bestFaq = { score: 0, answer: "" };
  for (const faq of FAQ_ITEMS) {
    const qScore = scoreMatch(words, faq.question);
    const aScore = scoreMatch(words, faq.answer);
    const score = qScore * 2 + aScore;
    if (score > bestFaq.score) bestFaq = { score, answer: faq.answer };
  }
  if (bestFaq.score >= 2) return bestFaq.answer;

  for (const p of PROJECTS) {
    const titleWords = tokenize(p.title);
    const matchTitle = words.some((w) =>
      titleWords.some((t) => t.includes(w) || w.includes(t))
    );
    const matchDesc = scoreMatch(words, p.description) >= 1;
    if (matchTitle || matchDesc) {
      return `${p.title}: ${p.description} Technologies: ${p.tags.join(", ")}. Demo: ${p.demoUrl}`;
    }
  }

  if (
    words.some((w) => ["skill", "stack", "tech", "technologies"].includes(w)) ||
    (words.includes("what") && words.some((w) => ["use", "work", "know"].includes(w)))
  ) {
    return "My tech stack spans backend, AI, and frontend. Backend: NestJS (expert), Node.js, Express.js, PostgreSQL, Prisma ORM, Redis, Docker, Socket.io, REST API design, JWT/RBAC auth. AI & ML: LangChain, FastAPI, Ollama (Llama 2, Mistral), RAG pipelines, ChromaDB, prompt engineering, Python. Frontend: React, Next.js, TypeScript, Tailwind CSS, Material UI. DevOps: Git, GitHub Actions CI/CD, Docker, Vercel. Testing: Jest, Vitest, React Testing Library, Supertest.";
  }
  if (words.some((w) => ["experience", "job", "role", "employment"].includes(w)) && !words.some((w) => ["project"].includes(w))) {
    return "I worked as a Software Engineer at FBM Solutions (Pvt) Ltd for 2 years (Oct 2023 – Sep 2025), remotely. I built high-performance REST APIs and WebSocket services in NestJS, designed and optimized PostgreSQL schemas, implemented JWT/RBAC authentication, deployed with Docker, integrated AI features using Ollama and FastAPI, and implemented Redis caching. Key achievements: reduced API response time by 40%, designed a reusable auth module adopted across 3 products, migrated a legacy Express.js monolith to NestJS microservices, and built real-time systems handling 5,000+ concurrent WebSocket connections.";
  }
  if (words.some((w) => ["education", "degree", "university", "keele", "school", "study", "studying"].includes(w))) {
    return "MSc in Artificial Intelligence & Data Science at Keele University, UK (Sep 2025 – Sep 2026, currently enrolled). Focus areas: deep learning, NLP, computer vision, data mining, and AI deployment. BS in Software Engineering from University of Engineering & Technology (UET), Pakistan (2019–2025), covering data structures, algorithms, OOP, database systems, software architecture, and web engineering.";
  }
  if (words.some((w) => ["contact", "email", "reach", "hire", "get", "touch", "collaborate"].includes(w))) {
    return `You can reach me at ${CONTACT_EMAIL}, via LinkedIn (linkedin.com/in/usamacodes-space), or through the Contact section on this site. I'm currently based in Stoke-on-Trent, UK, and open to remote, hybrid, or on-site roles. I'm also available for freelance/contract work alongside my MSc studies.`;
  }
  if (words.some((w) => ["project", "projects", "built", "portfolio", "showcase"].includes(w))) {
    return "I've built 4 major projects: (1) QR Menu SaaS — a full-stack restaurant management platform with Next.js, Express.js, PostgreSQL, and Stripe billing. (2) ChatDocs — an AI document chat system using LangChain, FastAPI, Ollama, and ChromaDB with RAG pipelines. (3) GX Tickets — an enterprise ticketing system with NestJS, JWT auth, Redis rate limiting, and audit trails. (4) QuikTix — a collaborative backend project focused on Clean Architecture with 80%+ test coverage. Ask about any specific project for detailed information!";
  }
  if (
    (words.some((w) => ["who", "about", "tell"].includes(w)) && words.length <= 6) ||
    words.includes("introduce") || words.includes("yourself")
  ) {
    return "I'm Usama Shafique, a Backend & AI-Integrated Software Engineer with 2+ years of experience, based in Stoke-on-Trent, UK. I specialize in building scalable Node.js systems with NestJS, PostgreSQL, and Docker, and integrating AI using LangChain, FastAPI, and Ollama. I'm currently pursuing an MSc in AI & Data Science at Keele University. Previously, I worked at FBM Solutions where I built high-availability APIs, real-time WebSocket systems, and migrated legacy services to modern architectures.";
  }

  return `I don't have specific information about that in my portfolio. For more details, reach out at ${CONTACT_EMAIL} — I'd be glad to chat!`;
}

export interface ChatResult {
  text: string;
  source: "api" | "rule";
  error?: boolean;
  /** When error is true, optional message from API (e.g. "GROQ_API_KEY not configured"). */
  errorMessage?: string | null;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function queryPortfolio(prompt: string, isOnline = true): Promise<ChatResult> {
  const text = prompt.trim() || "What can you tell me about Usama?";

  const now = Date.now();
  if (now - lastRequestTime < CHAT_COOLDOWN_MS) {
    await sleep(CHAT_COOLDOWN_MS - (now - lastRequestTime));
  }
  lastRequestTime = Date.now();

  if (!isOnline) {
    const answer = ruleBasedQuery(text);
    if (DEBUG) console.log("[Chat] Offline, rule-based:", { query: text });
    return { text: answer, source: "rule", error: false };
  }

  let lastError: string | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const answer = data?.text ?? ruleBasedQuery(text);
        if (DEBUG) console.log("[Chat] API response:", { query: text });
        return { text: answer, source: "api", error: false };
      }
      lastError = typeof data?.error === "string" ? data.error : res.statusText || "Request failed";
      if (res.status === 429) {
        const answer = ruleBasedQuery(text);
        if (DEBUG) console.log("[Chat] Rate limited (429), silent rule-based fallback:", { query: text });
        return { text: answer, source: "rule", error: false };
      }
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    } catch {
      lastError = "Network error";
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }

  const answer = ruleBasedQuery(text);
  if (DEBUG) console.log("[Chat] API failed, silent rule-based fallback:", { query: text });
  return { text: answer, source: "rule", error: false };
}
