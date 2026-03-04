# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-02-08

### Client-ready release

- **Profile photo:** Avatar uses `/avatar.jpg` (fallback to initials via UI Avatars); add `public/avatar.jpg` for your photo
- **Social links:** GitHub, LinkedIn, Twitter, Portfolio icons in Sidebar
- **Project cards:** Source and Demo buttons wired to `sourceUrl` and `demoUrl`
- **Contact form:** Sends via `mailto:` — opens email client with pre-filled message
- **Favicon + meta:** SVG favicon; Open Graph and Twitter card meta tags for sharing
- **Deployment:** `vercel.json` and `netlify.toml` for one-click deploy
- **Error Boundary:** Catches React render errors; app no longer white-screens
- **Environment:** `.env.example` for `GEMINI_API_KEY` setup

### Earlier

- **S1-T1:** `src/` layout, clean dev run, index.html entry point
