# Design System Implementation Review

**Date:** 2026-02-20
**Scope:** All changes from `design-system-rollout-plan.md` (original) and `design-system-fixes-plan.md` (fixes pass)
**Files reviewed:** 25

---

### ✅ Looks Good

- Shared utility approach is solid: `heading-display`, `heading-display-stroke`, `heading-display-stroke-sm`, and `card-brutalist` centralise the design system and avoid per-page drift
- `card-brutalist` responsive border (12px mobile → 20px md+) is a meaningful UX improvement; 20px on mobile was consuming too much card content area
- `heading-display-stroke-sm` (1px stroke) makes inner-page H1s legible while preserving brutalist character — this was a real user-facing bug fix
- `MostReadHero` and `BlogList` components now correctly use the lighter card treatments (`border-4`, `border-2`) per the rollout spec — these were confirmed missing
- `FinalCta` component is well-extracted and consistent across all pages
- All `rounded-full` / `rounded-lg` / `rounded-xl` / `rounded-2xl` on pills, badges, cards, pagination, and filter buttons removed site-wide (sharp corners throughout)
- No linter errors across all 25 modified files
- No `any` types, no `@ts-ignore`, no debug statements

---

### ⚠️ Issues Found

#### Homepage Visual Regression

- **[HIGH]** `app/page.tsx:104` — Homepage hero heading lost its tight letter-spacing, making the heading look visually thinner/weaker than intended
  - **Root cause:** The original rollout (Step 19) changed the H1 from `heading-stroke font-bebas uppercase` to `heading-display-stroke`. The old approach inherited `letter-spacing: -0.025em` from the base heading styles. The new `heading-display-stroke` explicitly sets `letter-spacing: 0.025em`. That's a 0.05em delta — at text-8xl/9xl sizes (~7–8rem), this creates a visible change in visual density.
  - **Confirmed via:** git diff shows this change was made in the initial rollout, not the fixes pass. Both screenshots confirm the visual regression.
  - **Fix:** Remove `letter-spacing: 0.025em` from `.heading-display-stroke` and `.heading-display-stroke-sm` in `globals.css`. Let these classes inherit the `-0.025em` from the base heading styles. The `heading-display` (no-stroke) class can keep `0.025em` since it's used on H2 section headings where wider spacing works well at smaller sizes.
  - **Impact:** All 7 homepage slide headings + all inner-page H1s will render with tighter spacing, restoring the original homepage visual density

- **[HIGH]** `app/globals.css:147–158` — Same root cause as above but affects all homepage slide H2s too
  - The 7 homepage `heading-display-stroke` H2s (Slides 2–7) also shifted from tight to wide letter-spacing
  - **Fix:** Same as above — remove `letter-spacing` from `heading-display-stroke`

#### Missed Heading Conversions

- **[MEDIUM]** `app/about/page.tsx:137` — Business highlight H3 titles still use `text-lg font-semibold` instead of `heading-display text-lg`
  - This is the businesses timeline section on the about page (the compact entries, not full cards)
  - **Fix:** Change `text-lg font-semibold text-brand-900` → `heading-display text-lg text-brand-900`

- **[MEDIUM]** `app/speaker/page.tsx:342` — "How Virtual Delivery Works" step titles use `font-semibold text-brand-900` instead of `heading-display`
  - **Fix:** Change `font-semibold text-brand-900` → `heading-display text-brand-900`

- **[MEDIUM]** `app/speaker/page.tsx:429` — Speaker FAQ question titles use `text-lg font-semibold text-brand-900` instead of `heading-display`
  - Note: This is the inline FAQ on `/speaker`, separate from the `FaqSection` component (which was already fixed)
  - **Fix:** Change `text-lg font-semibold text-brand-900` → `heading-display text-lg text-brand-900`

#### Intentionally Preserved `rounded-full` on Homepage

- **[LOW]** `app/page.tsx:353,369` — 16-bit character images on the Testimonials slide use `rounded-full` to create a circular portrait crop
  - **Why this is OK:** These are decorative character illustrations, not UI elements. The circular crop is an intentional design choice for the 16-bit pixel art portraits. Not a design system violation.
  - **Action:** No change needed

#### Raw HTML Body Styling

- **[LOW]** `app/blog/[slug]/page.tsx:272-278` — Raw HTML body content uses `[&>img]:rounded-lg`, `[&_figure_img]:rounded-lg`, and `[&>iframe]:rounded-lg` for imported legacy content
  - **Why this is OK:** The rollout plan explicitly says "Body content: NO changes — keep `prose` / raw HTML styling as-is for readability." These are styling rules for CMS-imported content, not design system UI elements.
  - **Action:** No change needed

- **[LOW]** `app/archive/[slug]/page.tsx:155` — Same pattern: raw HTML body uses `[&>img]:rounded-lg` for legacy content
  - **Why this is OK:** Same rationale — legacy imported HTML. The plan says "Body content: NO changes — legacy HTML."
  - **Action:** No change needed

#### Contact Form Success State

- **[LOW]** `app/contact/contact-form.tsx:96` — Success message H2 uses `text-2xl font-bold text-green-800` instead of `heading-display`
  - This is a transient success confirmation, not a persistent page heading. Using `heading-display` here would look visually jarring with the Bebas font on a small confirmation message.
  - **Action:** Optional — could change to `heading-display` for consistency, but the current treatment is arguably better UX for a confirmation state

---

### 📋 Prioritised Action Plan

**High Priority (visual regression):**
- [x] `app/globals.css` — Remove `letter-spacing: 0.025em` from `.heading-display-stroke` and `.heading-display-stroke-sm`. Keep it on `.heading-display` only. This restores the homepage hero to its original tight-spaced visual density while maintaining wider spacing on section H2s where it works well.

**Medium Priority (consistency):**
- [x] `app/about/page.tsx:137` — Business timeline H3: `text-lg font-semibold` → `heading-display text-lg`
- [x] `app/speaker/page.tsx:342` — Virtual delivery step H3: `font-semibold` → `heading-display`
- [x] `app/speaker/page.tsx:429` — Speaker FAQ H3: `text-lg font-semibold` → `heading-display text-lg`

**Low Priority (no action needed):**
- `app/page.tsx:353,369` — 16-bit portraits `rounded-full` — intentional design
- `app/blog/[slug]/page.tsx:272-278` — Legacy body `rounded-lg` — per plan
- `app/archive/[slug]/page.tsx:155` — Legacy body `rounded-lg` — per plan
- `app/contact/contact-form.tsx:96` — Success H2 styling — optional

---

### 📊 Summary

- Files reviewed: 25
- Critical issues: 0
- High issues: 1 (homepage letter-spacing regression — affects all homepage headings)
- Medium issues: 3 (missed heading conversions on about + speaker pages)
- Low issues: 4 (all intentional / no action needed)
