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

const SYSTEM_PROMPT = `You are the AI for Usama Shafique's portfolio. Your ONLY source of truth is the DATA below (CV, LinkedIn-style profile, projects). You have NO other knowledge about Usama.

STRICT RULES:
1. Answer ONLY using information that appears in the DATA. Do not use your general knowledge or training data.
2. If the question is about ANY topic, experience, skill, or project NOT explicitly mentioned in the DATA, you MUST respond with exactly: "I don't have that information in my portfolio. Please reach out at hello@usamacodes.space for more details."
3. Do NOT mention RAG, pipelines, LangChain, or other technical work unless the user's question is clearly about something that appears in the DATA (e.g. a project or role that mentions it).
4. Do NOT make up facts, dates, projects, experience, hobbies, or skills. For questions like "experience in X" or "do you have experience with Y", if X or Y is not in the DATA, use the response in rule 2.
5. Be concise (1–2 short paragraphs). Use FAQ answers only when the question matches something in the DATA.
6. Stay professional and friendly.

DATA:
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
        max_tokens: 512,
        temperature: 0.1,
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
