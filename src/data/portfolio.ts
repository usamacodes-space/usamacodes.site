/** Single source of truth for portfolio data (no React/JSX – safe for Node/API). */

import type { Experience as ExpType, Education as EduType, FunBuild } from "../types";
import { SITE_EMAIL, SITE_HOST, SITE_URL } from "@/lib/site";

export const CONTACT_EMAIL = SITE_EMAIL;
export const RESUME_URL = "/resume.pdf";

export const LINKEDIN_URL = "https://linkedin.com/in/usamacodes-space";
export const GITHUB_URL = "https://github.com/usamacodes-space";
export const PORTFOLIO_URL = SITE_URL;

/** Replace with project-specific repo URLs when available (e.g. https://github.com/usamacodes-space/qr-menu-saas). */
export const PROJECTS = [
  { title: "QR Menu SaaS", description: "Full-stack restaurant management platform featuring role-based dashboards, subscription billing, and dynamic QR menu generation.", tags: ["Next.js", "Express.js", "PostgreSQL", "Prisma"], icon: "QrCode", sourceUrl: "https://github.com/usamacodes-space", demoUrl: PORTFOLIO_URL },
  { title: "ChatDocs (AI Chat)", description: "Developed an AI-driven document chat system enabling users to upload files and interact through natural language via RAG.", tags: ["LangChain", "FastAPI", "Ollama", "Python"], icon: "MessageSquare", sourceUrl: "https://github.com/usamacodes-space", demoUrl: PORTFOLIO_URL },
  { title: "GX Tickets", description: "Backend development for a large-scale ticketing and event workflow system with robust security.", tags: ["NestJS", "PostgreSQL", "JWT", "Prisma"], icon: "Ticket", sourceUrl: "https://github.com/usamacodes-space", demoUrl: PORTFOLIO_URL },
  { title: "QuikTix", description: "Collaborative project focused on scalable backend architectures and real-world production constraints.", tags: ["Clean Architecture", "REST API", "Database Design"], icon: "Layout", sourceUrl: "https://github.com/usamacodes-space", demoUrl: PORTFOLIO_URL },
];

/**
 * Live demos and small products — add rows here (like an [Indie Page](https://indiepa.ge/marclou)).
 * Each `url` should be a public link visitors can open to try the build.
 */
export const FUN_BUILDS: FunBuild[] = [
  {
    id: 'fun-builds:this-portfolio',
    title: "This portfolio",
    description: "Interactive terminal, AI Q&A, and the page you are on right now.",
    url: PORTFOLIO_URL,
    emoji: "✨",
    status: "live",
  },
];

export const EXPERIENCE: ExpType[] = [
  {
    role: "Software engineer",
    company: "FBM Solutions (Pvt) Ltd",
    period: "oct 2023 — sep 2025",
    highlights: [
      "Developed high-availability NestJS services utilizing PostgreSQL and Redis.",
      "Optimized complex relational queries and implemented efficient indexing strategies.",
      "Architected secure microservices with centralized JWT/RBAC protocols.",
      "Standardized environment parity using multi-stage Docker builds.",
    ],
  },
];

export const EDUCATION: EduType[] = [
  { degree: "MSc in AI & Data Science", institution: "Keele University, UK", period: "Session: 2025 — 2026", badge: "Current" },
  { degree: "BS in Software Engineering", institution: "UET Pakistan", period: "Class Of 2025" },
];

export const RESUME_CONTENT = `
Usama Shafique
Backend & AI-Integrated Software Engineer
Location: Stoke-on-Trent, England, UK
Email: ${SITE_EMAIL}
Web: www.${SITE_HOST}
GitHub: github.com/usamacodes-space
LinkedIn: linkedin.com/in/usamacodes-space

=== PROFESSIONAL SUMMARY ===
Backend Software Engineer with 2+ years of professional experience building AI-integrated Node.js systems using NestJS, PostgreSQL, and Docker. Skilled in developing scalable REST APIs, authentication systems, and real-time features with Socket.io. Passionate about using tools like LangChain, FastAPI, and Ollama to bring AI automation into production systems. Currently pursuing an MSc in AI & Data Science at Keele University, UK, to deepen expertise in machine learning, NLP, and intelligent system design.

=== PROFESSIONAL EXPERIENCE ===

Software Engineer — FBM Solutions (Pvt) Ltd | Remote | Oct 2023 – Sep 2025 (2 years)

Core Responsibilities:
- Developed and maintained high-performance REST APIs and real-time WebSocket services using NestJS and Node.js, serving thousands of concurrent users.
- Designed and optimized PostgreSQL database schemas, including advanced indexing strategies, query optimization, and migration management via Prisma ORM.
- Implemented robust, production-grade authentication and authorization systems using JWT tokens, bcrypt password hashing, and fine-grained Role-Based Access Control (RBAC) supporting admin, manager, and user roles.
- Architected and deployed microservices using multi-stage Docker builds, Docker Compose orchestration, and environment parity across dev/staging/production.
- Built real-time features including live notifications, chat systems, and collaborative editing using Socket.io with room management and namespace separation.
- Integrated AI-driven features into existing backend systems using Ollama for local LLM inference and FastAPI for lightweight AI microservices.
- Implemented caching layers with Redis for session management, API response caching, and rate limiting.
- Established CI/CD pipelines, conducted code reviews, wrote unit and integration tests, and mentored junior developers.
- Collaborated with cross-functional teams including frontend developers, designers, and product managers in agile sprints.

Key Achievements at FBM Solutions:
- Reduced average API response time by 40% through PostgreSQL query optimization and Redis caching.
- Designed a reusable authentication module adopted across 3 company products.
- Successfully migrated a legacy Express.js monolith to a modular NestJS microservice architecture.
- Implemented real-time event-driven architecture handling 5,000+ concurrent WebSocket connections.

=== PROJECTS (DETAILED) ===

1. QR Menu SaaS — Full-Stack Restaurant Management Platform
   Role: Full-stack developer (solo project)
   Tech Stack: Next.js 14, Express.js, PostgreSQL, Prisma ORM, Tailwind CSS, Stripe
   Description: A complete SaaS platform that allows restaurant owners to create, customize, and manage digital menus accessible via QR codes. Customers scan a QR code at their table to view the menu on their phone.
   Key Features:
   - Multi-tenant architecture supporting multiple restaurants, each with isolated data and custom branding.
   - Role-based dashboards: Owner dashboard (analytics, menu management, settings), Manager dashboard (order management, staff), and Customer-facing menu view.
   - Dynamic QR code generation tied to specific tables, branches, or promotional campaigns.
   - Subscription billing integration with Stripe for monthly/annual plans (Free, Pro, Enterprise tiers).
   - Menu builder with drag-and-drop category/item ordering, image uploads, dietary tags (vegan, gluten-free, halal), and pricing variants.
   - Real-time order notifications via WebSocket to kitchen displays.
   - Analytics dashboard showing menu item popularity, peak hours, and revenue tracking.
   - Responsive design working on all devices — from kitchen tablets to customer smartphones.
   Challenges Solved:
   - Building role-based access control across multi-tenant data isolation.
   - Generating unique, trackable QR codes programmatically with embedded metadata.
   - Implementing real-time order flow from customer phone to kitchen display.
   - Handling concurrent menu edits with optimistic locking.

2. ChatDocs — AI Document Chat System
   Role: Full-stack developer
   Tech Stack: LangChain, FastAPI, Ollama (Llama 2 / Mistral models), Python, React, ChromaDB, PyPDF2
   Description: An AI-powered document interaction system that allows users to upload PDFs, Word documents, or text files and ask natural language questions. The system uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers sourced directly from the uploaded documents.
   Key Features:
   - Document ingestion pipeline: upload → parse (PyPDF2, python-docx) → chunk (recursive text splitter, 500-token chunks with 50-token overlap) → embed (sentence-transformers) → store in ChromaDB vector database.
   - RAG query pipeline: user question → embed → similarity search (top-k=5 relevant chunks) → construct prompt with retrieved context → LLM inference via Ollama → return answer with source citations.
   - Support for multiple document formats: PDF, DOCX, TXT, and Markdown.
   - Conversation memory with chat history context for follow-up questions.
   - FastAPI backend with async endpoints for concurrent document processing.
   - React frontend with a chat interface, document upload area, and source highlighting.
   - Local LLM deployment via Ollama — no data leaves the user's machine, ensuring privacy.
   Challenges Solved:
   - Optimizing chunk size and overlap for best retrieval accuracy.
   - Handling large documents (100+ pages) with efficient batch processing.
   - Reducing hallucination by enforcing strict context-only prompting.
   - Managing multiple simultaneous chat sessions with isolated document contexts.

3. GX Tickets — Enterprise Ticketing & Event Workflow System
   Role: Backend developer
   Tech Stack: NestJS, PostgreSQL, Prisma ORM, JWT, bcrypt, Redis, Docker
   Description: A large-scale backend system for managing events, ticket sales, and attendee workflows. Built for an enterprise client requiring robust security, audit trails, and high concurrency during ticket sale windows.
   Key Features:
   - Secure RESTful API with JWT authentication and RBAC (admin, organizer, attendee roles).
   - Event CRUD with rich metadata: venue, capacity, pricing tiers, early-bird discounts, and promo codes.
   - Ticket purchasing flow with inventory management, seat selection, and payment status tracking.
   - QR-code-based ticket validation at event check-in points.
   - Audit logging for all administrative actions (event creation, refunds, role changes).
   - Rate limiting and request throttling using Redis to prevent abuse during high-demand ticket drops.
   - Automated email notifications for booking confirmations, reminders, and cancellations.
   - Admin dashboard API supporting analytics: ticket sales over time, revenue breakdown, attendee demographics.
   Challenges Solved:
   - Handling race conditions during concurrent ticket purchases (pessimistic locking on inventory).
   - Designing a scalable schema supporting thousands of events with millions of tickets.
   - Implementing secure, tamper-proof QR codes for event check-in.
   - Building a reliable audit trail without impacting API performance.

4. QuikTix — Scalable Event & Ticket Management Backend
   Role: Backend developer (collaborative project)
   Tech Stack: Clean Architecture, NestJS, REST API, PostgreSQL, Database Design, Docker
   Description: A collaborative backend project focused on applying Clean Architecture principles to build a maintainable, testable, and scalable ticket management system.
   Key Features:
   - Strict Clean Architecture with separated layers: domain entities, use cases, interface adapters, and infrastructure.
   - Repository pattern with Prisma for data access, fully decoupled from business logic.
   - Comprehensive REST API with versioning (v1/v2), pagination, filtering, and sorting.
   - Input validation with class-validator and custom pipes.
   - Error handling with custom exception filters and standardized error responses.
   - Database design with normalized schemas, composite indexes, and migration management.
   - Integration and unit testing with Jest, achieving 80%+ code coverage.
   - Docker containerization for consistent development and deployment environments.
   Challenges Solved:
   - Enforcing architectural boundaries in a team setting.
   - Designing database schemas that balance normalization with query performance.
   - Implementing API versioning without breaking existing consumers.

=== EDUCATION (DETAILED) ===

MSc in Artificial Intelligence & Data Science — Keele University, UK
Period: September 2025 – September 2026 (Expected)
Status: Currently enrolled
Focus Areas: Deep learning, natural language processing (NLP), computer vision, data mining, statistical modeling, and practical deployment of AI systems.
Relevance: Extending backend engineering expertise with formal ML/AI training to build end-to-end intelligent systems. Coursework includes neural networks, reinforcement learning, big data analytics, and research methods.
Thesis/Project: Expected to focus on applied NLP or RAG system optimization (topic to be finalized).

BS in Software Engineering — University of Engineering & Technology (UET), Pakistan
Period: 2019 – 2025
Degree: Bachelor of Science in Software Engineering
Coursework: Data structures & algorithms, object-oriented programming, database systems, software architecture, operating systems, computer networks, web engineering, software project management, and software testing & quality assurance.
Achievements: Completed a senior year capstone project; gained strong foundation in software design patterns, system design, and engineering best practices.

=== TECHNICAL SKILLS (DETAILED) ===

BACKEND:
- NestJS: Primary backend framework. Expert-level. Built modular monoliths and microservices. Proficient with modules, controllers, services, guards, interceptors, pipes, custom decorators, middleware, exception filters, and dynamic modules. Experience with @nestjs/swagger for auto-generated API docs, @nestjs/schedule for cron jobs, and @nestjs/websockets for real-time features.
- Node.js: Runtime for all backend services. Deep understanding of event loop, streams, clustering, and async patterns.
- Express.js: Used in QR Menu SaaS and legacy projects. Experience with middleware chains, routing, error handling, and migration to NestJS.
- PostgreSQL: Primary relational database. Expert in schema design, complex JOINs, window functions, CTEs (Common Table Expressions), indexing (B-tree, GIN, partial indexes), EXPLAIN ANALYZE for query profiling, and performance tuning.
- Prisma ORM: Type-safe database client. Proficient with schema definitions, migrations, relations (one-to-one, one-to-many, many-to-many), raw queries, middleware, and connection pooling.
- Redis: Used for caching (API responses, sessions), rate limiting, pub/sub messaging, and leaderboard/ranking systems.
- Docker: Multi-stage Dockerfiles, Docker Compose for local dev orchestration, environment parity across dev/staging/production. Experience with health checks, volume management, and network configuration.
- Socket.io: Real-time bidirectional communication. Built live notifications, chat systems, and collaborative features. Experience with rooms, namespaces, acknowledgements, and reconnection handling.
- REST API Design: Proficient in RESTful conventions, HATEOAS, versioning (URI, header-based), pagination (cursor, offset), filtering, sorting, error response standardization, and API documentation with Swagger/OpenAPI.
- JWT & bcrypt: Authentication with JSON Web Tokens (access + refresh token rotation), password hashing with bcrypt, and session management.
- RBAC: Fine-grained Role-Based Access Control with hierarchical roles (super-admin, admin, manager, user) and permission-based access.

AI & MACHINE LEARNING:
- LangChain: Orchestrating LLM workflows. Experience with chains, agents, document loaders, text splitters (recursive, character-based), embeddings, vector stores (ChromaDB, FAISS), retrieval chains, and prompt templates.
- FastAPI: Building lightweight, high-performance AI microservices. Async endpoints, Pydantic validation, dependency injection, background tasks.
- Ollama: Local LLM deployment and inference. Experience running Llama 2, Mistral, and other open-source models. Model management, context window tuning, and temperature/top-p configuration.
- RAG (Retrieval-Augmented Generation): End-to-end pipeline design — document ingestion, chunking strategies, embedding generation, vector similarity search, context assembly, and LLM prompting with retrieved context.
- Python: AI/ML scripting, data preprocessing, Jupyter notebooks, and integration with scientific computing libraries.
- Prompt Engineering: Designing effective system prompts, few-shot examples, chain-of-thought prompting, and output format control.

FRONTEND:
- React: Component architecture, hooks (useState, useEffect, useRef, useCallback, useMemo), context API, React.lazy/Suspense for code splitting, and performance optimization (memoization, virtualization).
- Next.js: Server-side rendering (SSR), static site generation (SSG), API routes, middleware, App Router, and image optimization.
- Tailwind CSS: Utility-first CSS, responsive design (mobile-first breakpoints), custom themes with CSS variables, animations, and dark mode.
- TypeScript: Strong typing across all projects. Generics, utility types, discriminated unions, type guards, declaration files, and strict mode.
- Material UI (MUI): Component library for React. Theming, sx prop, responsive utilities, and custom component styling.

DEVOPS & TOOLS:
- Git: Version control, branching strategies (Git Flow, trunk-based), rebasing, cherry-picking, and collaborative workflows with pull requests.
- CI/CD: GitHub Actions for automated testing, linting, and deployment pipelines.
- Vercel: Serverless deployment for Next.js and static sites. Edge functions and environment variable management.
- Linux/Shell: Comfortable with Linux environments, bash scripting, and server administration basics.
- Testing: Jest for unit/integration tests, Vitest, React Testing Library, and API testing with Supertest.

=== WORK METHODOLOGY ===
- Agile/Scrum practitioner with experience in sprint planning, daily standups, and retrospectives.
- Strong advocate for clean code, SOLID principles, and design patterns (Repository, Factory, Strategy, Observer).
- Emphasis on type safety (TypeScript strict mode everywhere), comprehensive error handling, and defensive programming.
- Code review culture — both giving and receiving constructive feedback.
- Documentation-driven development — maintains API docs, architectural decision records, and onboarding guides.

=== AVAILABILITY & PREFERENCES ===
- Currently based in Stoke-on-Trent, England, UK.
- Open to remote, hybrid, or on-site roles within the UK.
- Available for freelance/contract work alongside MSc studies.
- Preferred communication: email (${SITE_EMAIL}) or LinkedIn.
- Languages: English (professional), Urdu (native).
`;

export const FAQ_ITEMS = [
  { question: "What is your primary tech stack?", answer: "I specialize in the T3/JavaScript ecosystem. My core backend stack includes NestJS, Node.js, and PostgreSQL. On the frontend, I work with React, Next.js, and Tailwind CSS." },
  { question: "How do you handle AI integration?", answer: "I focus on RAG (Retrieval-Augmented Generation) pipelines. I use LangChain to orchestrate models, FastAPI for lightweight AI microservices, and Ollama or Gemini for the LLM core." },
  { question: "Are you open to remote work or relocation?", answer: "I have extensive experience working remotely with international teams (UK, Pakistan). I am currently based in Stoke-on-Trent, UK, and open to hybrid or remote opportunities within the region." },
  { question: "Can you help with legacy code migration?", answer: "Yes, I have experience refactoring older Express.js or PHP systems into modern, type-safe NestJS architectures with better scalability and Docker containerization." },
];

export function getPortfolioContextForAI(): string {
  const faqBlock = FAQ_ITEMS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  const funBlock =
    FUN_BUILDS.length > 0
      ? `\n\n=== PROJECTS FOR FUN (live demos) ===\n${FUN_BUILDS.map((b) => `${b.title} (${b.status ?? "live"}): ${b.description} — ${b.url}`).join("\n")}`
      : "";
  return `${RESUME_CONTENT.trim()}

=== FAQ (use these answers when the question matches) ===
${faqBlock}

=== CONTACT & LINKS ===
Email: ${CONTACT_EMAIL}
Portfolio: ${PORTFOLIO_URL}
LinkedIn: ${LINKEDIN_URL}
GitHub: ${GITHUB_URL}${funBlock}`;
}
