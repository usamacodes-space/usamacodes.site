/** Single source of truth for portfolio data (no React/JSX – safe for Node/API). */

import type { Experience as ExpType, Education as EduType } from "../types";

export const CONTACT_EMAIL = "hello@usamacodes.space";
export const RESUME_URL = "/resume.pdf";

export const LINKEDIN_URL = "https://linkedin.com/in/usama-shafique";
export const GITHUB_URL = "https://github.com/usama-shafique";
export const PORTFOLIO_URL = "https://usamacodes.space";

/** Replace with project-specific repo URLs when available (e.g. https://github.com/usama-shafique/qr-menu-saas). */
export const PROJECTS = [
  { title: "QR Menu SaaS", description: "Full-stack restaurant management platform featuring role-based dashboards, subscription billing, and dynamic QR menu generation.", tags: ["Next.js", "Express.js", "PostgreSQL", "Prisma"], icon: "QrCode", sourceUrl: "https://github.com/usama-shafique", demoUrl: "https://usamacodes.space" },
  { title: "ChatDocs (AI Chat)", description: "Developed an AI-driven document chat system enabling users to upload files and interact through natural language via RAG.", tags: ["LangChain", "FastAPI", "Ollama", "Python"], icon: "MessageSquare", sourceUrl: "https://github.com/usama-shafique", demoUrl: "https://usamacodes.space" },
  { title: "GX Tickets", description: "Backend development for a large-scale ticketing and event workflow system with robust security.", tags: ["NestJS", "PostgreSQL", "JWT", "Prisma"], icon: "Ticket", sourceUrl: "https://github.com/usama-shafique", demoUrl: "https://usamacodes.space" },
  { title: "QuikTix", description: "Collaborative project focused on scalable backend architectures and real-world production constraints.", tags: ["Clean Architecture", "REST API", "Database Design"], icon: "Layout", sourceUrl: "https://github.com/usama-shafique", demoUrl: "https://usamacodes.space" },
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
Email: hello@usamacodes.space
Web: www.usamacodes.space

Summary:
Backend Software Engineer experienced in building AI-integrated Node.js systems using NestJS, PostgreSQL, and Docker. Skilled in developing scalable REST APIs, authentication systems, and real-time features with Socket.io. Passionate about using tools like LangChain, FastAPI, and Ollama to bring AI automation into production systems.

Professional Experience:
Software Engineer, FBM Solutions (Pvt) Ltd - Remote (Oct 2023 - Sep 2025)
- Built and maintained high-performance REST APIs and WebSocket services in NestJS.
- Designed and optimized PostgreSQL schemas.
- Implemented robust authentication systems using JWT and bcrypt.
- Leveraged Prisma ORM and Docker to streamline development.
- Integrated AI-driven features using Ollama and FastAPI.

Projects:
1. QR Menu SaaS: Full-stack restaurant management platform with role-based dashboards and dynamic QR generation. (Next.js, Express.js, PostgreSQL, Prisma)
2. ChatDocs (AI Document Chat): AI-driven document chat system using RAG pipelines, LangChain, and Ollama.
3. GX Tickets: Ticketing and event workflow system with secure authentication.
4. QuikTix: Scalable backend system for event and ticket management.

Education:
- MSc in Artificial Intelligence & Data Science, Keele University (2025-2026 Expected)
- BS in Software Engineering, University of Engineering & Technology (2019-2025)

Skills: NestJS, PostgreSQL, Docker, Socket.io, LangChain, FastAPI, Ollama, Prisma, React, Next.js.
`;

export const FAQ_ITEMS = [
  { question: "What is your primary tech stack?", answer: "I specialize in the T3/JavaScript ecosystem. My core backend stack includes NestJS, Node.js, and PostgreSQL. On the frontend, I work with React, Next.js, and Tailwind CSS." },
  { question: "How do you handle AI integration?", answer: "I focus on RAG (Retrieval-Augmented Generation) pipelines. I use LangChain to orchestrate models, FastAPI for lightweight AI microservices, and Ollama or Gemini for the LLM core." },
  { question: "Are you open to remote work or relocation?", answer: "I have extensive experience working remotely with international teams (UK, Pakistan). I am currently based in Stoke-on-Trent, UK, and open to hybrid or remote opportunities within the region." },
  { question: "Can you help with legacy code migration?", answer: "Yes, I have experience refactoring older Express.js or PHP systems into modern, type-safe NestJS architectures with better scalability and Docker containerization." },
];

export function getPortfolioContextForAI(): string {
  const faqBlock = FAQ_ITEMS.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
  const projectsBlock = PROJECTS.map((p) => `- ${p.title}: ${p.description} [${p.tags.join(", ")}]`).join("\n");
  return `${RESUME_CONTENT.trim()}

FAQ (use these exact answers when the question matches):
${faqBlock}

Projects (detailed):
${projectsBlock}

Contact: ${CONTACT_EMAIL} | Portfolio: ${PORTFOLIO_URL} | LinkedIn: ${LINKEDIN_URL} | GitHub: ${GITHUB_URL}`;
}
