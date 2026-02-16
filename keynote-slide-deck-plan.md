# Keynote Slide Deck — Implementation Plan

**Overall Progress:** 100%

## TLDR

Transform the homepage into a full-viewport slide deck that feels like a PowerPoint/Prezi presentation. Each section becomes a 100vh slide with optional images, parallax effects, and scroll-snap. Add a 4-color theme switcher in the nav (replacing Share). Mobile reverts to standard scroll.

## Critical Decisions

- **Framer Motion for effects** — Parallax, scroll-triggered animations, and `useReducedMotion` support; complements React/Next.js stack
- **CSS scroll-snap** — Native proximity snap for slide landing; no library needed
- **Footer as final slide** — Footer becomes the 8th slide on home; layout conditionally hides default Footer when on home
- **Replace Share with theme switcher** — 4-color palette in nav status bar (red section); Share removed from nav
- **Mobile: standard scroll** — No deck, no scroll-snap below breakpoint (`md`); normal vertical scroll
- **Placeholder images** — Source from Unsplash/Pexels or static assets; 2–3 to start, reusable across slides

## Tasks

- [x] 🟩 **Step 1: Add dependencies and create Slide component**
  - [x] 🟩 Add `framer-motion` dependency
  - [x] 🟩 Create `Slide` component with variant prop (`hero` | `centered` | `grid-3` | `grid-6` | `logos` | `cta` | `footer`)
  - [x] 🟩 Implement layout variants: header slot, content slot (children), optional CTA slot
  - [x] 🟩 Apply `min-height: 100vh`, `scroll-snap-align: start` per slide

- [x] 🟩 **Step 2: Create scroll-snap container and home deck wrapper**
  - [x] 🟩 Create `SlideDeck` client component: scroll container with `scroll-snap-type: y proximity`, `overflow-y: auto`, `height: 100%`
  - [x] 🟩 Apply deck styles only at `md` breakpoint and up; below `md`, render children without snap (standard scroll)
  - [x] 🟩 Create `ConditionalFooter` client component: if `pathname === '/'` return null, else return `<Footer />`
  - [x] 🟩 Update root layout to use `ConditionalFooter` instead of `Footer`

- [x] 🟩 **Step 3: Refactor home page into Slide components**
  - [x] 🟩 Extract footer content into `FooterContent` component (used by `Footer` and footer slide)
  - [x] 🟩 Map Hero → `Slide variant="hero"`
  - [x] 🟩 Map Featured Keynotes → `Slide variant="grid-3"`
  - [x] 🟩 Map Latest Thinking (conditional) → `Slide variant="grid-3"`
  - [x] 🟩 Map Explore Topics → `Slide variant="grid-6"`
  - [x] 🟩 Map What Clients Say → `Slide variant="grid-3"`
  - [x] 🟩 Map As Seen At → `Slide variant="logos"`
  - [x] 🟩 Map Final CTA → `Slide variant="cta"`
  - [x] 🟩 Add footer slide → `Slide variant="footer"` with `FooterContent`
  - [x] 🟩 Wrap all slides in `SlideDeck`; preserve all existing copy, CMS data, and CTAs

- [x] 🟩 **Step 4: Add SlideImage and placeholder images**
  - [x] 🟩 Create `SlideImage` component: optional image with position prop (`top-right` | `bottom` | `left` | `right` | `background`)
  - [x] 🟩 Add `public/slides/` directory; source 2–3 placeholder JPGs from Unsplash
  - [x] 🟩 Wire optional images to slides (hero, keynotes, testimonials, cta — reused across slides)

- [x] 🟩 **Step 5: Add Framer Motion effects**
  - [x] 🟩 Create `SlideParallaxImage` wrapper with `useScroll` + `useTransform` for parallax on images
  - [x] 🟩 Create `SlideContent` wrapper with `whileInView` for subtle enter animations
  - [x] 🟩 Use `useReducedMotion()` to disable parallax and animations when user prefers reduced motion

- [x] 🟩 **Step 6: Theme switcher in nav**
  - [x] 🟩 Define 4 theme palettes (CSS custom properties for accent, backgrounds, etc.)
  - [x] 🟩 Create `ThemeProvider` and `ThemeContext`; persist choice in `localStorage`
  - [x] 🟩 Create `ThemeSwitcher` component: 4 color swatches with label ("Themes")
  - [x] 🟩 Replace Share button in `NavStatusBar` with `ThemeSwitcher`
  - [x] 🟩 Remove Share modal and Share-related state from header
