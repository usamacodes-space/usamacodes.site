# Usama Shafique Portfolio — AI Studio Edition

## What This Project Is

A developer portfolio web app inspired by Google AI Studio. It showcases Usama Shafique's professional experience, projects, education, and FAQ. A **Gemini-powered interactive terminal** lets visitors ask natural-language questions about his background (e.g., "What's your experience with Docker?") and receive AI-generated answers grounded in his resume.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | Vite 6 |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS (CDN) |
| AI | Google Gemini (@google/genai) |
| Icons | lucide-react |

---

## Architecture Overview

```
src/
├── index.tsx          # Entry point, mounts React root
├── App.tsx            # Main layout, routing, sidebar, tab views
├── constants.tsx      # Projects, FAQ, nav items, resume text
├── types.ts           # Project, Experience, Education interfaces
├── services/
│   └── gemini.ts      # Gemini API integration, queryPortfolio()
└── components/
    ├── Sidebar.tsx    # Navigation, settings, snow toggle
    ├── SearchTerminal.tsx  # AI query input + response display
    └── ProjectCard.tsx     # Project card for Build Pipeline
```

**Tabs:** Start (AI terminal), Projects, Experience, Education, FAQ, Contact.

---

## How It's Useful for Society

- **Job seekers:** Demonstrates how to combine portfolio presentation with AI for interactive self-introduction.
- **Hiring managers:** Offers a modern, queryable alternative to static CVs.
- **Developers:** Example of integrating Gemini into a production-ready React app.
- **Students:** Reference for building portfolio sites with Vite, React, and TypeScript.

---

## Project Goal

> "Organize it by every mean" — production-grade structure, maintainability, cleanup, and documentation.

---

## Current Status

- **Structure:** `src/` layout in place; dev runs cleanly.
- **Docs:** PROJECT.md, TASKS.md, CONTRIBUTING.md, CHANGELOG.md.
- **Client-ready:** Profile photo (add `public/avatar.jpg`), social links, project Source/Demo, contact form (mailto), favicon, OG meta, deployment config, Error Boundary.
- **Remaining:** See [TASKS.md](./TASKS.md) for done vs. todo.

---

## Related Links

- AI Studio: https://ai.studio/apps/drive/18xSN3KmUrOVc-cY3Zzmdc0sMR-fF0NmG
