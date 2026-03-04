# Contributing to Usama Shafique Portfolio

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node)

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional, for AI features)**
   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
   - Without this, the app runs but Gemini queries will fail (gracefully)

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   - Opens at http://localhost:3000/

## Build & Preview

```bash
npm run build   # Production build (output in dist/)
npm run preview # Preview production build locally
```

## Deployment

- **Vercel:** Connect the repo; `vercel.json` is configured.
- **Netlify:** Connect the repo; `netlify.toml` is configured.
- Set `GEMINI_API_KEY` in the platform's environment variables for AI features.

## Project Structure

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Main layout, tabs, sidebar |
| `src/index.tsx` | Entry point |
| `src/constants.tsx` | Data: projects, FAQ, nav, resume text |
| `src/types.ts` | TypeScript interfaces |
| `src/services/gemini.ts` | Gemini API integration |
| `src/components/` | Reusable UI components |

## Guidelines

- Keep imports relative and paths consistent with `src/`.
- Use TypeScript for new files.
- For major changes, update `TASKS.md` and `CHANGELOG.md` when applicable.

## Documentation

- **PROJECT.md** — Overview, stack, architecture, societal value
- **TASKS.md** — Done vs. todo, acceptance criteria
- **README.md** — Quick start
