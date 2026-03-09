import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const RATE_LIMIT_MS = 500; // 1 request per 0.5s per IP; 429 is handled client-side as silent fallback

const ipLastRequest = new Map<string, number>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    if (first) return first.trim();
  }
  const real = req.headers["x-real-ip"];
  if (real && typeof real === "string") return real;
  return (req.socket?.remoteAddress as string) || "unknown";
}

const SYSTEM_PROMPT = `You are Usama Shafique's portfolio AI assistant. You have been given comprehensive data about Usama — his skills, projects, experience, education, and everything in his CV. Use this data to answer any question the visitor asks.

Guidelines:
- Be conversational, helpful, and professional. Speak as if you know Usama well.
- Give detailed, informative answers. Don't be overly brief — share relevant specifics from the data (tech stack details, project features, achievements, numbers, etc.).
- When asked about a skill or technology, explain Usama's proficiency level, where he used it, and what he built with it.
- When asked about a project, describe it thoroughly — the purpose, tech stack, features, and challenges he solved.
- You can connect related pieces of information to give richer answers. For example, if asked about NestJS, mention both his FBM Solutions work and relevant projects.
- If the user asks something not covered in the data at all, say something like: "That's not covered in my portfolio data, but feel free to reach out at hello@usamacodes.space to ask Usama directly!"
- Do NOT invent facts that aren't in the data. But you CAN elaborate on what IS there and present it engagingly.
- Format responses naturally. Use short paragraphs. You can use bullet points for lists of skills or features when appropriate.

Here is Usama's complete portfolio data:

`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const last = ipLastRequest.get(ip);
  if (last != null && now - last < RATE_LIMIT_MS) {
    res.status(429).json({ error: "Too many requests. Please wait a moment." });
    return;
  }
  ipLastRequest.set(ip, now);

  const { prompt } = req.body as { prompt?: string };
  const text = (prompt || "What can you tell me about Usama?").trim();

  const { getPortfolioContextForAI } = await import("../lib/portfolio-context");
  const context = getPortfolioContextForAI();

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + context },
          { role: "user", content: text },
        ],
        max_tokens: 1024,
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const err = data?.error?.message ?? response.statusText;
      res.status(response.status).json({ error: String(err) });
      return;
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      "I couldn't generate a response. Please try again.";
    res.status(200).json({ text: reply });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
