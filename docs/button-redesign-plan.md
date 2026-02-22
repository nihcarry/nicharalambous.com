# CTA Button Redesign — Primary/Secondary with Icons and Solid Shadow

**Overall Progress:** `100%`

## TLDR

Redesign all site CTA buttons to match the reference: primary (accent fill) and secondary (e.g. white/outline) with an icon plus text in each button, a solid offset drop shadow (bottom-right, no blur), and **square corners** (not rounded). Button colors already respond to theme randomization via existing accent CSS variables; no theme changes required.

## Critical Decisions

- **Single component** — All CTAs use `CTAButton` in [components/cta-button.tsx](components/cta-button.tsx). All visual and structural changes live there; call sites only need to pass an optional icon (or use a default per variant).
- **Square corners by default** — Buttons use `rounded-none` in the component so the reference “square” look is the default; remove redundant `!rounded-none` from call sites over time or leave as no-op override.
- **Solid drop shadow** — Use a custom, unblurred box-shadow (e.g. 4px 4px 0 theme color) so it reads as a “sticker” cut-out. Shadow color: dark neutral (e.g. `brand-900`) so it works with all theme accents.
- **Icons via optional prop** — Add an optional `icon` prop to `CTAButton` (e.g. `icon?: React.ReactNode` or a named icon key). Use an icon library (e.g. `lucide-react`) for consistent, accessible SVGs; render icon left of label with a small gap.
- **Theme** — Primary = `bg-accent-600` (already); secondary = border + light fill (e.g. white or brand-50) with dark text. Existing theme provider overrides `--color-accent-*`; no change needed for “theme randomization.”

## Tasks

- [x] 🟩 **Step 1: Add icon dependency and solid shadow token**
  - [x] 🟩 Add `lucide-react` (or agreed icon library) to dependencies.
  - [x] 🟩 In [app/globals.css](app/globals.css) `@theme`, add a button shadow token (e.g. `--shadow-cta: 4px 4px 0 var(--color-brand-900)` or equivalent) for the solid offset shadow.

- [x] 🟩 **Step 2: Update CTAButton component — shape, shadow, icon**
  - [x] 🟩 In [components/cta-button.tsx](components/cta-button.tsx), change base styles: `rounded-none` (square), and apply the solid drop shadow (e.g. `shadow-[var(--shadow-cta)]` or Tailwind arbitrary value).
  - [x] 🟩 Add optional `icon?: React.ReactNode` (or named icon) prop; render icon before `children` with consistent size and gap (e.g. `gap-2`, icon size ~1rem).
  - [x] 🟩 Keep primary variant: `bg-accent-600` with white (or high-contrast) text; ensure icon color matches text.
  - [x] 🟩 Adjust secondary variant to align with reference: e.g. white/light background, dark border and text (brand-800), same solid shadow; icon color matches text.

- [x] 🟩 **Step 3: Add icons to all CTAButton usages**
  - [x] 🟩 Audit every `CTAButton` call site (homepage, speaker, keynotes, books, blog, topics, about, archive, not-found, final-cta, contextual-cta, etc.).
  - [x] 🟩 For each button, choose an appropriate icon (e.g. calendar/mic for “Book…”, compass/list for “Explore…”, book for “Read the Blog”, home for “Go Home”) and pass it via the new `icon` prop (or map label to default icon inside the component if using a name-based API).

- [x] 🟩 **Step 4: Visual and responsive check**
  - [x] 🟩 Confirm primary and secondary buttons look correct across breakpoints and with theme switcher (default, ocean, forest, sunset, random).
  - [x] 🟩 Confirm shadow is clearly visible and square corners applied; remove any redundant `!rounded-none` from call sites if desired.

## Summary

| Item              | Approach                                                                 |
|-------------------|--------------------------------------------------------------------------|
| Shape             | Square (`rounded-none`)                                                 |
| Shadow            | Solid, offset bottom-right (e.g. 4px 4px 0), dark neutral color          |
| Primary           | Accent background, white text, icon + text                              |
| Secondary         | Light/white background, dark border and text, icon + text                 |
| Icons             | Optional prop; one icon per button, left of label; library (e.g. lucide)|
| Theme             | No change; existing accent CSS vars drive primary color                  |

After implementation, all CTAs across the site will match the primary/secondary reference with icon + text and square corners, and colors will continue to respond to theme randomization.
