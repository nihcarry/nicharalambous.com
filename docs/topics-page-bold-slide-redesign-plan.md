# Feature Implementation Plan

**Overall Progress:** `75%`

## TLDR
Redesign `/topics` from a static grid into a bold slide-based experience that aligns with the speaker/keynotes design language while keeping its own identity. The page will use a shared hero style family (with sizing tweaks), filter to six specific topics on this page only, and present them as three narrative slides with two topics each. This improves visual impact and storytelling without changing topic hub content models.

## Critical Decisions
- Decision: Use `SlideDeck` + `Slide` architecture on `/topics` - matches established interaction and layout patterns already used on `/speaker` and `/keynotes`.
- Decision: Match hero style family (not exact copy) from speaker/keynotes - keeps design system consistency while preserving page-specific tuning.
- Decision: Filter topic list on `/topics` only to `Agency`, `AI`, `Curiosity`, `Entrepreneurship`, `Failure`, `Innovation` - fulfills the visual goal without changing global data/content.
- Decision: Use bold Option B storyboard direction with alternating slide compositions - creates stronger visual contrast and narrative flow than uniform cards.
- Decision: Narrative order will be:
  1) `Curiosity` + `Agency` (mindset and ownership),
  2) `Innovation` + `AI` (systems and leverage),
  3) `Entrepreneurship` + `Failure` (execution and resilience) - gives a clear arc from thinking to building to learning.

## Tasks:

- [x] 🟩 **Step 1: Align `/topics` Hero with Design System**
  - [x] 🟩 Update `/topics` hero `h1` styling to the same visual family as `/speaker` and `/keynotes` with page-specific size tuning.
  - [x] 🟩 Update subhead typography/spacing so it matches the same family and rhythm as speaker/keynotes hero copy.
  - [x] 🟩 Keep existing `/topics` metadata and JSON-LD behavior unchanged.

- [x] 🟩 **Step 2: Apply Six-Topic Filter and Narrative Grouping**
  - [x] 🟩 Filter topic source in `app/topics/page.tsx` to only: `agency`, `ai`, `curiosity`, `entrepreneurship`, `failure`, `innovation`.
  - [x] 🟩 Implement deterministic grouping/order: (`curiosity`,`agency`) → (`innovation`,`ai`) → (`entrepreneurship`,`failure`).
  - [x] 🟩 Ensure grouping logic is resilient if CMS ordering differs.

- [x] 🟩 **Step 3: Convert `/topics` to Bold Storyboard Slide Layout**
  - [x] 🟩 Replace current section/grid layout with `SlideDeck` structure (hero + 3 topic slides).
  - [x] 🟩 Build three alternating two-topic slide compositions (Option B bold treatment), reusing existing design tokens/utilities.
  - [x] 🟩 Add clear per-topic CTAs/links to `/topics/[slug]` within each slide while preserving accessibility/readability.

- [ ] 🟨 **Step 4: Validate UX and Visual Consistency**
  - [ ] 🟨 Run local dev server and verify desktop slide snapping behavior plus mobile stacked behavior for `/topics`.
  - [ ] 🟨 Confirm heading/subhead consistency against `/speaker` and `/keynotes` without requiring exact class parity.
  - [ ] 🟨 Check for regressions in spacing, contrast, and link usability across all four new `/topics` slides.
