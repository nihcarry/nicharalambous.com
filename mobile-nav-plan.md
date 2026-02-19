# Feature Implementation Plan: Mobile Bottom Navigation

**Overall Progress:** 100%

## TLDR
Replace the current mobile top nav (hamburger + drawer) with a Zoom-style bottom navigation bar. Four items: Home, Speaker, Keynotes, and More (overflow). Keep "Nic Haralambous" branding in a small top-left pill, highlight the active page, and add safe-area support for notched devices. Desktop layout unchanged.

## Critical Decisions
- Four bottom nav items (Home, Speaker, Keynotes, More) — matches Zoom-style density and user preference
- More opens a sheet/drawer containing Building, Topics, Blog, Books, Book Nic, About Nic, theme switcher — consolidates secondary actions
- "Nic Haralambous" stays top-left in dark pill as per reference image — maintains branding without competing with content
- Active route highlighted in bottom bar — reuses existing `isNavLinkActive` logic
- Safe-area support via `env(safe-area-inset-bottom)` — supports notched iPhones
- Small top padding on hero — keeps visual balance without top header

## Tasks

- [x] 🟩 **Step 1: Add CSS Variables and Layout Tokens**
  - [x] 🟩 Add `--bottom-nav-height-mobile` in `globals.css` (height of bottom bar)
  - [x] 🟩 Add `--top-branding-height-mobile` for "Nic Haralambous" pill height (used for hero padding)

- [x] 🟩 **Step 2: Refactor Header for Mobile Bottom Nav**
  - [x] 🟩 Mobile only: replace hamburger + drawer with fixed bottom bar (Home, Speaker, Keynotes, More)
  - [x] 🟩 Add top-left "Nic Haralambous" pill (dark, minimal) on mobile only
  - [x] 🟩 Style bottom nav: dark `bg-nav-bg`, icon above label, white text/icons, Zoom aesthetic
  - [x] 🟩 Apply active state highlight for current route using `isNavLinkActive`
  - [x] 🟩 Add `padding-bottom: env(safe-area-inset-bottom)` to bottom bar
  - [x] 🟩 Remove `min-w-[480px]` from mobile bar; use full-width responsive bar

- [x] 🟩 **Step 3: Implement More Overflow Menu**
  - [x] 🟩 More button opens sheet/drawer from bottom (or modal overlay) on mobile
  - [x] 🟩 Include links: Building, Topics, Blog, Books
  - [x] 🟩 Include NavStatusBar content: Book Nic, About Nic, ThemeSwitcher
  - [x] 🟩 Close on item click or backdrop tap

- [x] 🟩 **Step 4: Update Layout Padding and Heights**
  - [x] 🟩 In `layout.tsx`: mobile `main` uses `pb-[var(--bottom-nav-height-mobile)]` instead of top padding; desktop unchanged
  - [x] 🟩 In `slide-deck.tsx`: remove/adjust `-mt-[var(--header-height-mobile)]` on mobile (no top header)
  - [x] 🟩 In `page.tsx` hero: use `pt-[var(--top-branding-height-mobile)]` or small fixed padding on mobile

- [x] 🟩 **Step 5: Verify and Polish**
  - [x] 🟩 Ensure desktop (md+) layout unchanged
  - [x] 🟩 Test on narrow viewport (~375px) — no overflow
  - [x] 🟩 Test homepage slides, footer slide visibility above bottom nav
  - [x] 🟩 Run `npm run dev` and visually verify
