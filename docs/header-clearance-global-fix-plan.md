# Header Clearance Global Fix — Implementation Plan

**Overall Progress:** `100%`

## TLDR
Replace the fragile, per-page hardcoded header offsets with a single measured CSS variable (`--header-clearance`) set by `ResizeObserver` in the Header component. Every page and SlideDeck slide references this one variable for content clearance, with a 12px buffer below the nav. Also removes the mobile "Nic Haralambous" branding pill.

## Critical Decisions
- Measure actual nav height via `ResizeObserver` in Header — adapts automatically to font loading, design changes
- 12px buffer below nav bottom edge — baked into the variable, no per-page arithmetic
- Keep `--header-height-desktop: 8rem` as SSR fallback — prevents flash of content behind nav before JS runs
- Preserve SlideDeck negative-margin pattern — bg patterns still bleed behind the transparent nav
- Remove mobile "Nic Haralambous" pill — simplifies mobile offset to just the bottom nav

## Tasks:

- [x] 🟩 **Step 1: Add `ResizeObserver` to Header**
  - [x] 🟩 Wrap desktop nav content (pill + status bar) in a ref'd div
  - [x] 🟩 Add `useEffect` with `ResizeObserver` to measure `offsetHeight`
  - [x] 🟩 Set `--header-clearance` on `document.documentElement` to `actualHeight + 12px`

- [x] 🟩 **Step 2: Add CSS fallback variable**
  - [x] 🟩 In `globals.css` @theme, add `--header-clearance` defaulting to `--header-height-desktop`

- [x] 🟩 **Step 3: Update `layout.tsx` main padding**
  - [x] 🟩 Change `md:pt-[var(--header-height-desktop)]` to `md:pt-[var(--header-clearance)]`

- [x] 🟩 **Step 4: Update `slide-deck.tsx` negative margin**
  - [x] 🟩 Change `md:-mt-[var(--header-height-desktop)]` to `md:-mt-[var(--header-clearance)]`

- [x] 🟩 **Step 5: Standardise first-slide offsets on all SlideDeck pages**
  - [x] 🟩 Homepage (`app/page.tsx`) — replace hero inner div `md:pt-[var(--header-height-desktop)]` with `md:pt-[var(--header-clearance)]`
  - [x] 🟩 Speaker (`app/speaker/page.tsx`) — replace first slide `md:pt-[calc(var(--header-height-desktop)+1rem)]` with `md:pt-[var(--header-clearance)]`
  - [x] 🟩 Keynotes (`app/keynotes/page.tsx`) — same replacement
  - [x] 🟩 Topics (`app/topics/page.tsx`) — same replacement
  - [x] 🟩 Businesses (`app/businesses/page.tsx`) — same replacement
  - [x] 🟩 Books (`app/books/page.tsx`) — same replacement

- [x] 🟩 **Step 6: Remove mobile branding pill**
  - [x] 🟩 Delete the "Nic Haralambous" `<Link>` element from Header
  - [x] 🟩 Remove `--top-branding-height-mobile` references from `globals.css`, `layout.tsx`, and page files
  - [x] 🟩 Clean up the `page-bg` utility class that references this variable

- [x] 🟩 **Step 7: Verify all pages**
  - [x] 🟩 Confirm dev server compiles with zero errors
  - [x] 🟩 Spot-check homepage, speaker, keynotes, topics, businesses, books, blog, about, contact in browser
