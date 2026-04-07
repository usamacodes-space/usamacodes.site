import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioContextForAI } from '@/data/portfolio';
import { getClientIp } from '@/lib/getClientIp';
import { SITE_EMAIL } from '@/lib/site';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const RATE_LIMIT_MS = 500;

const ipLastRequest = new Map<string, number>();

const SYSTEM_PROMPT = `You are Usama Shafique's portfolio AI assistant. You have been given comprehensive data about Usama — his skills, projects, experience, education, and everything in his CV. Use this data to answer any question the visitor asks.

Guidelines:
- Be conversational, helpful, and professional. Speak as if you know Usama well.
- Give detailed, informative answers. Don't be overly brief — share relevant specifics from the data (tech stack details, project features, achievements, numbers, etc.).
- When asked about a skill or technology, explain Usama's proficiency level, where he used it, and what he built with it.
- When asked about a project, describe it thoroughly — the purpose, tech stack, features, and challenges he solved.
- You can connect related pieces of information to give richer answers. For example, if asked about NestJS, mention both his FBM Solutions work and relevant projects.
- If the user asks something not covered in the data at all, say something like: "That's not covered in my portfolio data, but feel free to reach out at ${SITE_EMAIL} to ask Usama directly!"
- Do NOT invent facts that aren't in the data. But you CAN elaborate on what IS there and present it engagingly.
- Format responses naturally. Use short paragraphs. You can use bullet points for lists of skills or features when appropriate.

Here is Usama's complete portfolio data:

`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
  }

  const ip = getClientIp(req);
  const now = Date.now();
  const last = ipLastRequest.get(ip);
  if (last != null && now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }
  ipLastRequest.set(ip, now);

  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const text = (body.prompt || 'What can you tell me about Usama?').trim();
  const context = getPortfolioContextForAI();

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + context },
          { role: 'user', content: text },
        ],
        max_tokens: 1024,
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const err = data?.error?.message ?? response.statusText;
      return NextResponse.json({ error: String(err) }, { status: response.status });
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ??
      "I couldn't generate a response. Please try again.";
    return NextResponse.json({ text: reply });
  } catch (err) {
    console.error('Groq API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
