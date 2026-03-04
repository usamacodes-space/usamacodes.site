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
    keywords: ["qr", "menu", "saas", "challenges", "technical", "faced", "project"],
    answer:
      "With QR Menu SaaS, the main challenges were building role-based dashboards, integrating subscription billing, and generating dynamic QR codes for menus. I used Next.js and Express.js for the full stack, with PostgreSQL and Prisma for data. The platform handles multiple restaurants, each with their own menu and branding.",
  },
  {
    keywords: ["optimize", "postgresql", "postgres", "queries", "nestjs"],
    answer:
      "For PostgreSQL optimization in NestJS, I focus on: (1) proper indexing on frequently queried columns, (2) using Prisma's select/include to avoid over-fetching, (3) raw queries for complex aggregations when needed, (4) connection pooling via Prisma, and (5) avoiding N+1 queries with eager loading. I've also worked on schema design and query profiling to identify bottlenecks.",
  },
  {
    keywords: ["rag", "pipeline", "langchain", "process", "building"],
    answer:
      "I focus on RAG (Retrieval-Augmented Generation) pipelines. I use LangChain to orchestrate models, FastAPI for lightweight AI microservices, and Ollama or similar models for the LLM core. For document chat (e.g. ChatDocs), I typically: chunk documents, embed them, store in a vector DB, then retrieve relevant chunks at query time and pass them as context to the LLM.",
  },
  {
    keywords: ["msc", "keele", "focus", "areas", "career", "roadmap"],
    answer:
      "During my MSc in AI & Data Science at Keele (2025–2026), my focus areas include deep learning, NLP, and practical deployment of AI systems. I'm building on my backend and RAG experience to combine scalable software with modern ML workflows.",
  },
];

function ruleBasedQuery(prompt: string): string {
  const text = prompt.trim() || "What can you tell me about Usama?";
  const words = tokenize(text);

  for (const { keywords, answer } of PROMPT_MAPPINGS) {
    const matchCount = keywords.filter((k) =>
      words.some((w) => w.includes(k) || k.includes(w))
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
    const skills =
      "NestJS, PostgreSQL, Docker, Socket.io, LangChain, FastAPI, Ollama, Prisma, React, Next.js";
    return `I specialize in the T3/JavaScript ecosystem. My core stack includes NestJS, Node.js, and PostgreSQL. On the frontend I use React, Next.js, and Tailwind. For AI integration I work with LangChain, FastAPI, and Ollama. Full skills: ${skills}.`;
  }
  if (words.some((w) => ["experience", "job", "work", "role", "employment"].includes(w))) {
    return "I'm a Backend & AI-Integrated Software Engineer. I worked as a Software Engineer at FBM Solutions (Pvt) Ltd (Oct 2023 – Sep 2025), building REST APIs, WebSocket services, and AI-driven features with NestJS, PostgreSQL, and Docker.";
  }
  if (words.some((w) => ["education", "degree", "university", "keele", "school"].includes(w))) {
    return "MSc in Artificial Intelligence & Data Science at Keele University (2025–2026 expected). BS in Software Engineering from University of Engineering & Technology (2019–2025).";
  }
  if (words.some((w) => ["contact", "email", "reach", "hire", "get", "touch"].includes(w))) {
    return `You can reach me at ${CONTACT_EMAIL} or via the Contact section on this site.`;
  }
  if (
    (words.some((w) => ["who", "about"].includes(w)) && words.length <= 5) ||
    words.includes("introduce")
  ) {
    return "I'm Usama Shafique, a Backend & AI-Integrated Software Engineer based in Stoke-on-Trent, UK. I build scalable Node.js systems with NestJS and integrate AI using LangChain and Ollama.";
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
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    } catch {
      lastError = "Network error";
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS);
    }
  }

  const answer = ruleBasedQuery(text);
  if (DEBUG) console.log("[Chat] API failed, rule-based fallback:", { query: text });
  return { text: answer, source: "rule", error: true, errorMessage: lastError ?? undefined };
}
