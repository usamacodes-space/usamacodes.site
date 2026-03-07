# Stitch: Mobile UI Redesign Brief — usamacodes.space Portfolio

**Purpose:** Redesign the mobile UI for the portfolio site. One screen is given to Stitch at a time; Stitch produces a screenshot/mockup; the client verifies; then we move to the next screen or provide change requests. After all screens are approved, implementation follows.

**Product:** Personal portfolio for Usama Shafique — Software Engineer, AI/backend focus. Site: usamacodes.space (React/Vite, Tailwind, dark-first).

---

## Global constraints (all screens)

- **Viewport:** Mobile only. Design for **375×812** (iPhone X/11/12/13 narrow) as primary; should scale to 360px and 414px width.
- **Brand (do not change):**
  - Background: `#0f1117` (dark).
  - Accent: `#f97316` (orange) — CTAs, active states, key highlights.
  - Slate: `#5d707f` (borders, muted UI). Light text: `#ecebf3`; secondary text: `#b5c1d2`.
  - Typography: Monospace/code-like font throughout.
- **Safe area:** Account for bottom safe area (e.g. home indicator). Main content and bottom nav must not be clipped.
- **Touch:** Minimum ~44px touch targets; no overlapping hit areas.

---

## Screen 1: App shell (header + hamburger, no sidebar open)

**When:** User is on mobile; sidebar is **closed**. This is the default mobile state.

**Layout:**
- **Top:** No visible “header bar” — just a **hamburger (menu) button** in the top-left. Button: rounded rectangle, subtle border, icon color `#f97316`, background `#0f1117` with slight transparency. Enough left padding so the icon doesn’t sit on the screen edge.
- **Main area:** Full-width content area below. Content has left padding so it doesn’t sit under the hamburger (e.g. content starts after ~56px from left).
- **Bottom:** A **fixed bottom navigation bar** (see Screen 1b for full spec). For this screen, only ensure the main content has bottom padding so it isn’t hidden behind the bottom nav (e.g. `pb-20` equivalent).

**Content visible in main area:** Depends on active tab (handled in other screens). Here we only define the **shell**: hamburger top-left, content area, and space reserved for bottom nav.

**Verify:** Hamburger is clearly tappable; no overlap with content; safe area respected; monospace and brand colors used.

---

## Screen 1b: Bottom navigation bar (all screens)

**When:** Visible on every mobile screen, fixed to bottom.

**Content (left to right):**
1. **Start** (icon: grid/layout)
2. **Projects** (icon: folder)
3. **Experience** (icon: briefcase)
4. **Education** (icon: graduation cap)
5. **FAQ** (icon: help)
6. **Contact** (icon: mail)
7. **Resume** (icon: download) — link, not tab
8. **Theme** (icon: sun or moon) — light/dark toggle

**Behavior:** Icons ~20px; below each icon a short label (e.g. “Start”, “Build”, “Exp”, “Edu”, “FAQ”, “Contact”, “Resume”, “Light”/“Dark”). Active tab: accent color `#f97316`; inactive: `#b5c1d2`. Bar: full width, subtle top border, background with slight blur/opacity. **Safe area:** Padding at bottom = `max(8px, env(safe-area-inset-bottom))`.

**Verify:** All 8 items visible without crowding; labels don’t collapse or overlap; active state clear; bar doesn’t cover content.

---

## Screen 2: Start (home) — AI chat terminal

**When:** Tab “Start” is active. Sidebar closed.

**Layout:**
- Shell as Screen 1 (hamburger top-left, bottom nav).
- Centered content, max-width ~600px, with side padding.

**Content (top to bottom):**
1. **Headline:** “Ask Me Anything” with a small sparkle/star icon (accent).
2. **Subline:** “Instant Answers About My Work, Projects, And Experience”
3. **Input card:** One text field, placeholder e.g. “Ask Anything (e.g. experience with Docker?)…”  
   Below the input: small “Groq” pill; mic (disabled) and clear buttons; primary **“Run”** button (accent background).
4. **Optional response card:** After user runs a query, a response box appears: “Response Context” label, checkmark icon, then AI response text (or typing dots). Error state: short message + “Try again” link.

**Verify:** Input and Run are thumb-friendly; response area readable; no horizontal scroll; hierarchy clear (title → input → response).

---

## Screen 3: Projects

**When:** Tab “Projects” is active.

**Content:**
- **Title:** “Build log” (or equivalent) centered.
- **List of project cards** (scrollable). Each card shows:
  - **Title** (e.g. “QR Menu SaaS”, “ChatDocs (AI Chat)”, “GX Tickets”, “QuikTix”)
  - **Short description** (1 line)
  - **Tags** (e.g. “Next.js”, “Express.js”, “PostgreSQL”) as small pills
  - **Footer:** “Project demos will be live soon” (no “Source” link on mobile)
- Cards: rounded, dark background, border; accent on hover/focus. Enough spacing between cards.

**Verify:** Cards stack vertically; tags wrap; no overlap; scroll works; bottom nav still visible when scrolled.

---

## Screen 4: Experience

**When:** Tab “Experience” is active.

**Content:**
- **Title:** “Experience” (or “Work log”) centered.
- **One experience card** (current data):
  - **Role:** “Software engineer”
  - **Company:** “FBM Solutions (Pvt) Ltd”
  - **Period:** “oct 2023 — sep 2025”
  - **Highlights:** 4 bullet points (NestJS, PostgreSQL, microservices, Docker).
- Card style: same dark card + border + accent hover as other screens.

**Verify:** Bullets readable; spacing between role, company, period, and list; no overflow.

---

## Screen 5: Education (Academic logs)

**When:** Tab “Education” is active.

**Content:**
- **Title:** “Academic logs” centered.
- **Two education cards:**

  **Card 1:**
  - **Degree:** “MSc in AI & Data Science”
  - **University badge:** “Keele University, UK” (pill, directly below degree, tight spacing)
  - **Badge:** “Current” (small, accent) — e.g. top-right of card or next to degree
  - **Period:** “Session: 2025 – 2026”

  **Card 2:**
  - **Degree:** “BS in Software Engineering”
  - **University badge:** “UET Pakistan”
  - **Period:** “Class Of 2025”
  - No “Current” badge.

**Verify:** University badge sits **below** course name with minimal gap; “Current” and “Keele University, UK” do not overlap; cards have clear separation.

---

## Screen 6: FAQ (Terminal FAQ)

**When:** Tab “FAQ” is active.

**Content:**
- **Title:** “Terminal FAQ” centered.
- **List of FAQ items** (accordion or stacked cards). Each item:
  - **Question** (with small help icon)
  - **Answer** (collapsed or expanded)
- Example questions: “What tech stack do you use?”, “Do you do freelance?”, “How can I contact you?”, etc.

**Verify:** Questions are tappable; answer text readable; spacing between items; no overlap with nav.

---

## Screen 7: Contact

**When:** Tab “Contact” is active.

**Content:** Multi-step form (3 steps).
- **Step 1:** “What’s Your Name?” + text input + “Next”
- **Step 2:** “What’s Your Email?” + email input + “Back” + “Next”
- **Step 3:** “What Would You Like To Tell Me?” + textarea + “Back” + “Send” (opens mailto)

Validation: name ≥2 chars; email valid; message ≥10 chars. Buttons: primary = accent; secondary = outline/muted.

**Verify:** One step visible at a time; Back/Next/Send clear; inputs large enough; no layout jump between steps.

---

## Screen 8: Sidebar open (overlay / drawer)

**When:** User tapped hamburger. Sidebar is **open**.

**Layout:**
- **Sidebar:** Slides in from left (or overlay). Width ~256px. Contains:
  - Close button (chevron or X) top-right
  - Avatar (circle, ~64px)
  - Name: “Usama Shafique”
  - Subtitle: “Software Engineer”
  - Short bio line
  - “Download Resume” link
  - Social icons (GitHub, LinkedIn, Twitter, Portfolio)
  - Nav links (same 6 tabs as bottom nav: Start, Projects, Experience, Education, FAQ, Contact)
  - Toggles: Snow effect, Theme, Settings
- **Main area:** Dimmed or partially visible; tapping it should close sidebar (if that’s the current behavior).

**Verify:** Sidebar doesn’t cover bottom nav (or bottom nav remains visible and usable). All links and toggles have clear touch targets. Close control obvious.

---

## Screen 9: Settings modal

**When:** User opens Settings (from sidebar or elsewhere). Modal over entire screen.

**Content:**
- **Title:** “System parameters” with close (X) button.
- **Rows:**
  1. “AI Reasoning Core” / “Simulated Processing Delay” — toggle (on/off).
  2. “Global Atmosphere” / “Seasonal Particle Effects” — toggle (snow on/off).
- **Footer:** “Execute” button (primary, closes modal).
- Backdrop: dimmed; modal centered, rounded, max-width ~320px.

**Verify:** Toggles are thumb-sized; Execute and Close are clear; modal doesn’t feel cramped on 375px.

---

## Workflow for Stitch

1. **Give Stitch one screen** (e.g. “Screen 2: Start — AI chat terminal”) by copying the section above.
2. Stitch produces a **mobile mockup/screenshot** (375×812 or similar).
3. **Client verifies:** Layout, copy, brand colors, no overlap, safe area, touch targets.
4. Either **approve** or **request changes** (describe in a short bullet list).
5. Repeat for next screen until all are done.
6. After approval, **implementation** will apply the redesign in code (same repo, Tailwind/React).

---

## Copy and data reference

- **Name:** Usama Shafique  
- **Role:** Software Engineer  
- **Tagline:** “I Build AI-Integrated Systems And Scalable Backends. Focused On RAG Pipelines And Automation.”  
- **Resume:** Download link = “/resume.pdf”  
- **Contact email:** hello@usamacodes.space  
- **Projects:** See `src/data/portfolio.ts` (QR Menu SaaS, ChatDocs, GX Tickets, QuikTix).  
- **Experience:** FBM Solutions (Pvt) Ltd, oct 2023 — sep 2025, 4 highlights.  
- **Education:** MSc AI & Data Science (Keele, 2025–2026, Current); BS Software Engineering (UET Pakistan, Class Of 2025).  
- **FAQ:** Use existing FAQ_ITEMS from the app (questions + short answers).

Use this doc as the single source for screen-by-screen mobile redesign. After verification of each screen, we implement.
