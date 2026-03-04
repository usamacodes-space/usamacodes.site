# Task Tracker

This file tracks what's done and what remains for the project.

---

## Done ✅

| ID | Task | Notes |
|----|------|-------|
| S1-T1 | Fix immediate broken reference + ensure dev runs cleanly | `src/` layout, index.html entry `/src/index.tsx`, index.css created, imports fixed |
| S1-T2 | Add `.env.example` with `GEMINI_API_KEY` | New devs have clear env setup |
| S2-T1 | Production build verification | `npm run build` and `npm run preview` work |
| S2-T2 | Error boundary for React | ErrorBoundary wraps App; prevents full crash |
| S3-T1 | `.env.local` in `.gitignore` | Already covered by `*.local` |
| S3-T2 | README update | Links to PROJECT, TASKS, CONTRIBUTING |
| **Client-ready** | Profile photo + social links | Sidebar: avatar (fallback to UI Avatars), social icons |
| **Client-ready** | Project Source/Demo buttons | ProjectCard: wired to sourceUrl, demoUrl |
| **Client-ready** | Contact form | mailto: opens email client with pre-filled message |
| **Client-ready** | Favicon + OG meta tags | public/favicon.svg, og:title, og:description, twitter:card |
| **Client-ready** | Deployment config | vercel.json, netlify.toml |
| **Client-ready** | Version bump | 1.0.0 |

---

## Todo ⏳

| ID | Task | Priority | Notes |
|----|------|----------|-------|
| S1-T3 | Add `CHANGELOG.md` | Medium | Track version history |
| S2-T3 | Loading / error states for Gemini calls | Medium | UX polish when API fails or is slow |
| S3-T3 | Optional: Migrate Tailwind from CDN to PostCSS | Low | Better tree-shaking, production assets |
| **Optional** | Replace project URLs with real repos/demos | - | Update constants.tsx with actual links |
| **Optional** | Add `public/avatar.jpg` for real photo | - | Replace initials fallback |

---

## Acceptance Criteria (Reference)

- Fresh clone → `npm install` → `npm run dev` → app loads, no fatal console errors.
- No missing `/index.css` or broken imports.
- Gemini calls may fail without API key; app must not crash.
- Portfolio is client-showable: contact works, social links visible, projects linkable.
