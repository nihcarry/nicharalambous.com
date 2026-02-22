# Feature Implementation Plan

**Overall Progress:** `75%`

## TLDR
Standardize non-navigation typography across the site to a single font family: Inter. This removes mixed font usage and enforces a consistent heading and body system, including a no-orphan policy for `h1`/`h2`. The implementation will update global typography tokens/utilities, add strict heading fitting behavior, and replace existing non-nav display font usage in pages/components.

## Critical Decisions
- Decision: Exclude navigation typography from this change - nav font/styling stays exactly as-is per requirement.
- Decision: Use Inter as the single non-nav font family - it is already globally loaded and minimizes migration risk.
- Decision: Keep monospace for code snippets only - preserves code readability and existing behavior in portable text.
- Decision: Enforce no-orphan behavior for non-nav `h1`/`h2` with layered strategy - CSS baseline for broad coverage plus runtime fitting for strict enforcement.
- Decision: Apply stricter fitting on desktop/tablet and softer enforcement on mobile - balances visual polish and readability on small screens.

## Tasks:

- [x] 🟩 **Step 1: Establish Inter-Only Typography Tokens**
  - [x] 🟩 Update typography tokens/utilities in `app/globals.css` for Inter-only heading/display roles.
  - [x] 🟩 Retire Bebas-oriented utility intent in non-nav typography (`heading-display*`/related usage targets).
  - [x] 🟩 Keep nav typography selectors untouched.

- [x] 🟩 **Step 2: Implement H1/H2 No-Orphan System**
  - [x] 🟩 Add CSS baseline for `h1`/`h2` (`text-wrap: balance` and last-word non-breaking support).
  - [x] 🟩 Build reusable `SmartHeading` component for strict orphan detection and font-size step-down.
  - [x] 🟩 Add resize/content reflow handling with bounded min/max font sizes.

- [x] 🟩 **Step 3: Migrate Non-Nav Usage to New Heading System**
  - [x] 🟩 Replace non-nav `font-bebas` and `heading-display*` usage across `app/**` and `components/**`.
  - [x] 🟩 Apply new Inter heading/display utilities by semantic role (`Display`, `H1`-`H6`, body/meta/CTA).
  - [x] 🟩 Validate that blog/page display copy follows the new Inter display rules.

- [ ] 🟨 **Step 4: Verify Visual Consistency and Stability**
  - [ ] 🟨 Run visual checks on key templates (home, blog list/detail, keynotes, speaker, books, contact, topics, about).
  - [ ] 🟨 Confirm no-orphan `h1`/`h2` behavior across representative viewport widths.
  - [ ] 🟨 Ensure no nav typography regressions and no semantic/accessibility regressions.
