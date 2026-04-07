# Deploy (Next.js + Vercel) — usamacodes.site

1. **Repo**: Push this project to GitHub (or GitLab / Bitbucket).

2. **Vercel**: Import the repo → Framework Preset **Next.js** (auto). Build: `npm run build`, Output: Next default.

3. **Domain & canonical URL**: In Vercel → **Settings → Domains**, set your real primary domain (e.g. `usamacodes.space` or `usamacodes.site`). Then in **Settings → Environment Variables** set:

   - `NEXT_PUBLIC_SITE_URL` = your canonical origin with HTTPS, e.g. `https://usamacodes.space` (must match the primary domain you want in Google).

   Next.js bakes this into metadata at **build** time — redeploy after changing it. Defaults in code: `https://usamacodes.space` if unset. See `src/lib/site.ts`.

4. **Environment variables** (Production + Preview as needed):

   | Variable | Required | Notes |
   |----------|----------|--------|
   | `GROQ_API_KEY` | Optional | AI chat; without it, rule-based answers still work. |
   | `RESEND_API_KEY` | For contact form | Without it, `/api/contact` returns 500. |
   | `CONTACT_TO_EMAIL` | Optional | Inbox for contact notifications (defaults to `hello@usamacodes.site`). |
   | `RESEND_FROM` | Optional | Verified sender, e.g. `Portfolio Contact <noreply@usamacodes.site>`. Defaults to `noreply@usamacodes.site` — **must** be verified in [Resend](https://resend.com) for that domain. |

5. **Assets**: Add `public/resume.pdf` for the resume link; `public/avatar.jpg` is optional (fallback avatar is used if missing).

6. **Smoke test**: Home, About, Projects, Contact, AI chat, resume download, light/dark theme.

7. **Search**: After go-live, add the **same** origin as `NEXT_PUBLIC_SITE_URL` in [Google Search Console](https://search.google.com/search-console) and submit `https://<your-domain>/sitemap.xml`.
