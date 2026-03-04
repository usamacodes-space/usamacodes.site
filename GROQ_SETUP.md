# Optional: Groq AI Chat (free tier)

The chat uses **rule-based FAQ matching** by default (no API keys). For smarter, LLM-powered answers, you can enable **Groq** (free tier, no credit card).

## 1. Get a Groq API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Create an API key

## 2. Deploy to Vercel

The Groq integration uses a Vercel serverless function (`/api/chat`). It only works when deployed to Vercel.

1. Push your code and deploy to [Vercel](https://vercel.com)
2. In the project **Settings → Environment Variables**, add:
   - Name: `GROQ_API_KEY`
   - Value: your Groq API key

3. Redeploy so the env var is applied

## 3. Local dev

Create `.env.local` in the project root with:

```
GROQ_API_KEY=your_groq_api_key
```

Then run `npm run dev`. The Vite dev server includes an `/api/chat` proxy that calls Groq. No Vercel CLI needed.
