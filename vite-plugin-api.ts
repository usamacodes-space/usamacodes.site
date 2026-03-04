import type { Plugin } from "vite";
import { loadEnv } from "vite";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const SYSTEM_PROMPT = `You are the AI for Usama Shafique's portfolio. Your ONLY source of truth is the DATA below (CV, LinkedIn-style profile, projects).

STRICT RULES:
1. Answer ONLY using information that appears in the DATA. Do not use your general knowledge.
2. If the question cannot be answered from the DATA, say: "I don't have that information in my portfolio. Please reach out at hello@usamacodes.space for more details."
3. Do NOT make up facts, dates, projects, or experience. Do NOT answer general questions (e.g. "how does X work?") unless the answer is explicitly in the DATA.
4. Be concise (1–2 short paragraphs). Use FAQ answers when the question matches.
5. Stay professional and friendly.

DATA:
`;

export function groqApiPlugin(): Plugin {
  return {
    name: "groq-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      const apiKey = env.GROQ_API_KEY;

      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }
        if (!apiKey) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "GROQ_API_KEY not set in .env.local" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { prompt } = JSON.parse(body || "{}") as { prompt?: string };
            const text = (prompt || "What can you tell me about Usama?").trim();

            const { getPortfolioContextForAI } = await import("./lib/portfolio-context");
            const context = getPortfolioContextForAI();

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
              res.writeHead(response.status, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: data?.error?.message ?? response.statusText }));
              return;
            }
            const reply =
              data?.choices?.[0]?.message?.content?.trim() ??
              "I couldn't generate a response. Please try again.";
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ text: reply }));
          } catch (err) {
            console.error("[Groq API]", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      });
    },
  };
}
