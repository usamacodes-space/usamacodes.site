<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Usama Shafique Portfolio — AI Studio Edition

A developer portfolio with an AI-powered interactive terminal (Groq) to query Usama's background.

**Docs:** [PROJECT.md](./PROJECT.md) · [TASKS.md](./TASKS.md) · [CONTRIBUTING.md](./CONTRIBUTING.md)

View in AI Studio: https://ai.studio/apps/drive/18xSN3KmUrOVc-cY3Zzmdc0sMR-fF0NmG

## Run Locally

**Prerequisites:** Node.js

1. `npm install`
2. Create `.env.local` with `GROQ_API_KEY=your_key` (optional; see [GROQ_SETUP.md](./GROQ_SETUP.md))
3. Add `resume.pdf` to `public/` for the Download Resume link
4. `npm run dev` — Next.js dev server (default port 3000)

**Production:** `npm run build` then `npm run start`.

Optional env for contact form: `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (see API routes under `src/app/api/`).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full setup, build, and deployment instructions.

**Deploy:** Vercel auto-detects Next.js. Set the same env vars in the project dashboard.
