# Deploy to Vercel (usamacodes.space)

1. **Assets**: `public/resume.pdf` is required for the Download Resume link. Add `public/avatar.jpg` optionally (otherwise initials fallback is used).

2. **Environment**: In Vercel → Project → Settings → Environment Variables, add:
   - `GROQ_API_KEY` — your Groq API key (Production and Preview if you want chat on preview deploys). See `.env.example`.

3. **Build**: Uses `vercel.json` (build: `npm run build`, output: `dist`). The `api/` folder is deployed as serverless functions; `/api/chat` will work once `GROQ_API_KEY` is set.

4. **Domain**: After deploy, set the production domain to **usamacodes.space** in Vercel so it matches meta and links.

5. **Smoke test**: Open the live URL, try the Start chat, Projects scroll, Contact form, and Resume download.
