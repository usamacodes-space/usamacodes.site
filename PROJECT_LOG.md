# Portfolio Project – Complete Log (Top to Bottom)

**Last updated:** February 2025 (Groq + rule-based chat)
**Project:** Usama Shafique – AI-Integrated Software Engineer Portfolio
**LinkedIn:** linkedin.com/in/usamacodes-space

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **Name** | usama-shafique-portfolio---ai-studio-edition |
| **Version** | 1.0.0 |
| **Type** | module (ESM) |
| **Stack** | React 19, TypeScript, Vite, Tailwind, Groq AI (optional) + rule-based chat |
| **Deploy** | Vercel, Netlify |

---

## 2. Directory Structure

```
Portfolio/
├── .env.example
├── .env.local                 # GROQ_API_KEY (gitignored)
├── .gitignore
├── api/
│   └── chat.ts                # Vercel serverless: Groq API proxy
├── lib/
│   └── portfolio-context.ts   # AI context (no React/JSX)
├── vite-plugin-api.ts         # Vite dev: /api/chat → Groq
├── GROQ_SETUP.md              # Groq API setup instructions
├── public/
│   ├── avatar.jpg
│   ├── avatar.png
│   └── favicon.svg
├── src/
│   ├── App.tsx
│   ├── index.tsx
│   ├── constants.tsx
│   ├── types.ts
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── SearchTerminal.tsx
│   │   └── Sidebar.tsx
│   └── services/
│       └── chat.ts            # queryPortfolio: API + rule-based fallback
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## 3. Package Dependencies

### Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.4 | UI library |
| react-dom | ^19.2.4 | React DOM renderer |
| lucide-react | ^0.563.0 | Icons |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| @vercel/node | ^3.2.0 | Vercel serverless types |
| @types/node | ^22.14.0 | Node type definitions |
| @vitejs/plugin-react | ^5.0.0 | Vite React plugin |
| typescript | ~5.8.2 | TypeScript compiler |
| vite | ^6.2.0 | Build tool |

### Scripts
- `npm run dev` – start dev server (port 3000, includes /api/chat if GROQ_API_KEY in .env.local)
- `npm run dev:groq` – Vercel dev (alternative)
- `npm run build` – production build
- `npm run preview` – preview production build

---

## 4. Configuration Files

### 4.1 vite.config.ts
- **Plugins:** `@vitejs/plugin-react`, `groqApiPlugin`
- **Server:** port 3000, host 0.0.0.0
- **groqApiPlugin:** Serves `/api/chat` in dev, proxies to Groq (reads `GROQ_API_KEY` from .env.local)
- **Alias:** `@` → `src/`

### 4.2 tsconfig.json
- **Target:** ES2022
- **Module:** ESNext
- **JSX:** react-jsx
- **Paths:** `@/*` → `./*`
- **noEmit:** true (Vite handles emit)

### 4.3 vercel.json
- buildCommand: `npm run build`
- outputDirectory: `dist`
- framework: vite
- `/api/*` → serverless functions (api/chat.ts)

### 4.4 netlify.toml
- build: `npm run build`
- publish: `dist`
- SPA redirect: `/*` → `/index.html` (200)

### 4.5 .env.example
```
# No API keys required for rule-based chat.
# Add GROQ_API_KEY to .env.local for Groq AI (see GROQ_SETUP.md)
```

### 4.6 .gitignore
- Ignores: logs, node_modules, dist, *.local, editor/IDE files

---

## 5. index.html

### Head
- **Charset:** UTF-8
- **Viewport:** width=device-width, initial-scale=1.0
- **Title:** Usama Shafique | AI-Integrated Software Engineer
- **Meta description:** Backend & AI-Integrated Software Engineer with AI chat terminal
- **OG/Twitter:** og:title, og:description, og:type, twitter:card
- **Favicon:** /favicon.svg
- **Tailwind:** CDN (cdn.tailwindcss.com)
- **Font:** JetBrains Mono 400/500/600 (Google Fonts)
- **Import map:** @google/genai, react, react-dom, lucide-react (esm.sh)

### Inline Styles
- `body`: font JetBrains Mono, 14px, background var(--brand-bg), color #ecebf3, antialiased, ligatures
- `.font-mono`: same font stack
- Scrollbar: 8px width, track var(--brand-bg), thumb #7a8a98, hover #6d7f8f

### Body
- `<div id="root">` – React mount point
- Script: `/src/index.tsx` (module)

---

## 6. index.css

### 6.1 CSS Variables (:root)
| Variable | Value | Use |
|----------|-------|-----|
| --brand-bg | #0f1117 | Main background |
| --brand-slate | #5d707f | Borders, muted |
| --brand-slate-light | #9ca8b8 | Lighter text |
| --brand-accent | #f97316 | Accent/orange |
| --brand-light | #ecebf3 | Light text |

### 6.2 Keyframe Animations
| Name | Behavior |
|------|----------|
| fade-in | opacity 0→1 |
| fade-in-up | opacity 0→1, translateY 12px→0 |
| fade-in-down | opacity 0→1, translateY -12px→0 |
| scale-in | opacity 0→1, scale 0.96→1 |
| slide-in-right | opacity 0→1, translateX 8px→0 |
| shimmer | background-position -200%→200% |
| typing-dot | bounce/opacity for typing indicator |
| glow-pulse | box-shadow pulse (orange) |
| gradient-shift | background-position shift |
| live-pulse | scale + ring for profile live dot |

### 6.3 Animation Classes
- `.animate-fade-in`, `.animate-fade-in-up`, `.animate-fade-in-down`
- `.animate-scale-in`, `.animate-slide-in-right`
- `.animate-typing-dot`, `.animate-glow-pulse`, `.animate-live-pulse`
- `.stagger-1` … `.stagger-8` (60ms–480ms delays)

### 6.4 Base Polish
- input/textarea/button: transition 0.2s
- focus: orange ring (2px)
- button:active scale 0.98
- a: color/bg/transform transition
- html: scroll-behavior smooth
- @media (prefers-reduced-motion): minimal duration

---

## 7. Entry Point: src/index.tsx

- Imports: React, ReactDOM, App, ErrorBoundary
- Root: `document.getElementById('root')`
- Render: `ReactDOM.createRoot(root).render( React.StrictMode > ErrorBoundary > App )`

---

## 8. App Component (src/App.tsx)

### 8.1 State
| State | Type | Default | Purpose |
|-------|------|---------|---------|
| activeTab | string | 'start' | Current nav tab |
| query | string | '' | Search input |
| aiResponse | string \| null | null | AI reply |
| isTyping | boolean | false | Loading AI |
| sidebarOpen | boolean | true | Sidebar visibility |
| isSnowing | boolean | false | Snow effect |
| showSettings | boolean | false | Settings modal |
| thinkerMode | boolean | false | Simulated delay |
| contactName | string | '' | Contact form |
| contactEmail | string | '' | Contact form |
| contactMessage | string | '' | Contact form |
| contactStep | number | 1 | Contact step 1–3 |

### 8.2 Sub-components
- **Snowfall** – 100 animated snowflakes, CSS drift, fixed overlay
- **SignalNode** – Rotating rings + dot for experience timeline
- **Sidebar** – Nav, profile, social links
- **SearchTerminal** – AI query UI
- **ProjectCard** – Per project (via PROJECTS)

### 8.3 Contact Form
- Steps: name → email → message
- CONTACT_STEPS array with labels/placeholders
- submit: mailto with subject/body
- Back/next, step indicators (1–3)

### 8.4 handleSearch
- Uses `queryPortfolio` from chat service
- Optional thinkerMode delay (1s)
- Sets isTyping, aiResponse

### 8.5 Layout Structure
```
div (root flex container)
├── Snowfall (if isSnowing)
├── Settings modal (if showSettings)
├── Sidebar
└── main
    ├── Menu button (if !sidebarOpen)
    ├── Content (tab-based)
    │   ├── start → SearchTerminal
    │   ├── projects → ProjectCard grid
    │   ├── experience → Timeline + SignalNode
    │   ├── education → Cards (MSc, BS)
    │   ├── faq → FAQ_ITEMS
    │   └── contact → Form + mailto hint
    └── Footer (status bar)
```

### 8.6 Footer
- © 2025 usama_studio
- system_stable (ShieldCheck icon)
- ai_core_active / idle_wait (based on isTyping)
- connection: encrypted

---

## 9. Sidebar (src/components/Sidebar.tsx)

### Props
- sidebarOpen, setSidebarOpen
- activeTab, setActiveTab
- isSnowing, setIsSnowing
- setShowSettings

### Content
- Collapse button (ChevronLeft)
- Avatar: /avatar.jpg, fallback ui-avatars.com
- Live indicator: orange dot, animate-live-pulse, title "Available"
- Name: Usama Shafique
- Role: Software Engineer
- Bio: AI-integrated systems, RAG, automation
- Social links: GitHub, LinkedIn, Twitter, Portfolio
- Nav: NAV_ITEMS (start, projects, experience, education, faq, contact)
- Footer: "let it snow" / "stop snow", Settings

### Styling
- Width: 64 (open) / 0 (closed)
- Border-r, overflow-hidden
- bg-[var(--brand-bg)]

---

## 10. SearchTerminal (src/components/SearchTerminal.tsx)

### Props
- query, setQuery
- handleSearch
- aiResponse, isTyping

### Content
- Heading: "Ask me anything" + Sparkles
- Subtitle: instant answers about my work, projects, and experience
- Input: placeholder, Enter to search
- Status: local (or Groq when API configured)
- Buttons: Mic, Plus, Run
- Result: typing dots or text
- Suggested prompts: CAPABILITIES (4 cards)

---

## 11. ProjectCard (src/components/ProjectCard.tsx)

### Props
- project: Project

### Content
- Icon (MessageSquare, QrCode, Ticket, Layout, default Cpu)
- Tags
- Title, description
- Source, Demo links

---

## 12. ErrorBoundary (src/components/ErrorBoundary.tsx)

- Class component
- getDerivedStateFromError, componentDidCatch
- Fallback: "Something went wrong" + error message + "Try again"
- Optional custom fallback prop

---

## 13. Constants (src/constants.tsx)

### RESUME_CONTENT
- Full text bio for AI/rule-based context

### PROJECTS
- QR Menu SaaS, ChatDocs, GX Tickets, QuikTix

### FAQ_ITEMS
- 4 Q&A pairs (tech stack, AI, remote, legacy)

### CAPABILITIES
- 4 suggested prompts with icons

### CONTACT_EMAIL
- hello@usamacodes.space

### SOCIAL_LINKS
- GitHub, LinkedIn, Twitter, Portfolio

### NAV_ITEMS
- start, projects, experience, education, faq, contact

---

## 14. Types (src/types.ts)

```ts
Project: title, description, tags[], icon?, sourceUrl?, demoUrl?
Experience: role, company, period, highlights[]
Education: degree, institution, period
```

---

## 15. Chat Service (src/services/chat.ts)

### queryPortfolio(prompt: string)
- Tries `POST /api/chat` (Groq) first; falls back to rule-based if unavailable
- **Groq:** llama-3.3-70b-versatile, system prompt + portfolio context
- **Rule-based:** FAQ match, project match, intent detection, explicit prompt mappings for suggested prompts
- Debug: `[Chat] Rule-based:` / `[Chat] API response:` in dev console

### Groq API (api/chat.ts + vite-plugin-api.ts)
- Vercel serverless (`api/chat.ts`) for production
- Vite plugin (`vite-plugin-api.ts`) for local dev – serves `/api/chat` when `GROQ_API_KEY` in `.env.local`
- Context: `lib/portfolio-context.ts` (no React/JSX)

---

## 16. Public Assets

### favicon.svg
- 32×32, rx=6, fill #0f1117
- Text "US" in #f97316

### avatar.jpg
- Profile photo (from 1764690766889.jpg)

### avatar.png
- Backup/legacy avatar

---

## 17. Palette & Branding

### Colors (palette.svg / index.css)
- **#0f1117** – Background (dark)
- **#5d707f** – Slate (borders, muted)
- **#9ca8b8** – Slate light (secondary text)
- **#f97316** – Accent (orange)
- **#ecebf3** – Light text

### Font
- JetBrains Mono 400/500/600
- Ligatures enabled

---

## 18. Features Summary

| Feature | Location | Description |
|---------|----------|-------------|
| AI Terminal | SearchTerminal | Groq AI or rule-based Q&A |
| Projects | projects tab | 4 project cards |
| Experience | experience tab | FBM Solutions timeline |
| Education | education tab | MSc, BS cards |
| FAQ | faq tab | 4 questions |
| Contact | contact tab | 3-step mailto form |
| Snow | Sidebar | Seasonal snowfall |
| Settings | Sidebar | thinkerMode, snow toggle |
| Live dot | Sidebar | Pulse on profile pic |
| Status bar | Footer | ai_core_active, encrypted |

---

## 19. External Links

- **GitHub:** https://github.com/usama-shafique
- **LinkedIn:** https://linkedin.com/in/usama-shafique
- **Twitter:** https://twitter.com/usama_codes
- **Portfolio:** https://usamacodes.space
- **Email:** hello@usamacodes.space
- **Groq API:** https://console.groq.com (free tier, see GROQ_SETUP.md)

---

## 20. File-by-File Checklist

| File | Documented |
|------|------------|
| index.html | ✓ |
| index.css | ✓ |
| package.json | ✓ |
| vite.config.ts | ✓ |
| tsconfig.json | ✓ |
| vercel.json | ✓ |
| netlify.toml | ✓ |
| .env.example | ✓ |
| .gitignore | ✓ |
| src/index.tsx | ✓ |
| src/App.tsx | ✓ |
| src/constants.tsx | ✓ |
| src/types.ts | ✓ |
| src/services/chat.ts | ✓ |
| api/chat.ts | ✓ |
| lib/portfolio-context.ts | ✓ |
| vite-plugin-api.ts | ✓ |
| src/components/Sidebar.tsx | ✓ |
| src/components/SearchTerminal.tsx | ✓ |
| src/components/ProjectCard.tsx | ✓ |
| src/components/ErrorBoundary.tsx | ✓ |
| public/favicon.svg | ✓ |
| public/avatar.jpg | ✓ |

---

*End of log – every file and feature documented.*
