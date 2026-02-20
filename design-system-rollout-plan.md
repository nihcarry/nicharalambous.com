# Design System Rollout — Implementation Plan

**Overall Progress:** `100%`

## TLDR

Extend the brutalist design language from the landing page across every page type on the site. Each page gets a tailored treatment — not a blanket copy-paste. The approach: update shared components first (CTAButton, final CTA sections), then work through each page category applying the right intensity of the design system for that context. High-conversion pages (speaker, keynotes) get the full treatment; long-form reading pages (blog posts, topic hubs) get a lighter touch that preserves readability.

## Critical Decisions

- **CTAButton gets updated globally**: Sharp corners (`!rounded-none`), Bebas Neue, uppercase — this single change propagates to every page and is the lowest-effort highest-impact move
- **Headings get Bebas Neue + stroke site-wide, but intensity varies**: H1s get Bebas + text stroke everywhere. H2s get Bebas + uppercase on listing/conversion pages. Content-heavy pages (blog posts, topic hubs) use a lighter heading treatment
- **Inner-page H1s use `heading-display-stroke-sm` (1px stroke)**: The full `heading-display-stroke` (2px/4px) is reserved for homepage slide headings only — it's over-inked at the smaller sizes used on inner pages. A dedicated `heading-display-stroke-sm` utility at 1px preserves the brutalist character without making letterforms illegible
- **Cards get the thick-border treatment on listing pages only**: Listing pages (keynotes, topics, businesses, books, media) use `card-brutalist` cards with rotations. Individual content pages keep clean borders for readability. `card-brutalist` is responsive: 12px on mobile, 20px on md+
- **Background patterns are landing-page only**: The SVG tile patterns stay exclusive to the homepage slides. Other pages keep solid alternating backgrounds (`bg-brand-50` / white) — this preserves the homepage's visual specialness
- **Final CTA sections get standardized**: Every page's bottom CTA section gets the same brutalist treatment (Bebas Neue heading, sharp buttons, pattern background) for visual consistency across the site
- **Blog prose content stays clean**: Body text in blog posts, book descriptions, keynote descriptions, and topic hub definitions stays Inter with no design system interference — readability first
- **Shared components used across pages get extracted**: Common card styles, heading styles, and CTA patterns become reusable to avoid drift
- **The header/nav stays untouched**: The Zoom-style dark nav bar is its own design system — it works as a frame for the brutalist content

---

## Tasks

- [x] 🟩 **Step 1: Update shared `CTAButton` component**
  - [x] 🟩 Change `rounded-lg` → `rounded-none` in baseStyles
  - [x] 🟩 Add `font-bebas uppercase tracking-wide` to baseStyles
  - [x] 🟩 Remove the `!rounded-none font-bebas uppercase` overrides on the landing page (now inherited)
  - [x] 🟩 Verify all pages render correctly with the new default button style

- [x] 🟩 **Step 2: Add design system utility classes to `globals.css`**
  - [x] 🟩 Add `.heading-display` utility: `font-bebas uppercase tracking-wide` for section headings without stroke
  - [x] 🟩 Add `.heading-display-stroke` utility: combines `.heading-display` with `.heading-stroke` — homepage slides only
  - [x] 🟩 Add `.heading-display-stroke-sm` utility: 1px stroke for inner-page H1s — legible at 4xl–6xl sizes
  - [x] 🟩 Add `.card-brutalist` utility: responsive border (12px mobile / 20px md+), `border-accent-600 bg-white`, sharp corners
  - [x] 🟩 Add `.bg-cta-pattern` background pattern for final CTA sections (star/asterisk icon)

- [x] 🟩 **Step 3: Standardize final CTA sections across all pages**
  - [x] 🟩 Create a shared `FinalCta` component that encapsulates the brutalist CTA pattern (Bebas heading + text stroke, pattern background, sharp buttons)
  - [x] 🟩 Replace the inline final CTA section on `/speaker`
  - [x] 🟩 Replace the inline final CTA section on `/about`
  - [x] 🟩 Replace the inline final CTA section on `/blog` listing
  - [x] 🟩 Replace the inline final CTA section on `/blog/[slug]`
  - [x] 🟩 Replace the inline final CTA section on `/keynotes` listing
  - [x] 🟩 Replace the inline final CTA section on `/keynotes/[slug]`
  - [x] 🟩 Replace the inline final CTA section on `/topics` listing
  - [x] 🟩 Replace the inline final CTA section on `/topics/[slug]`
  - [x] 🟩 Replace the inline final CTA section on `/businesses`
  - [x] 🟩 Replace the inline final CTA section on `/books` listing
  - [x] 🟩 Replace the inline final CTA section on `/books/[slug]`
  - [x] 🟩 Replace the inline final CTA section on `/media`

- [x] 🟩 **Step 4: Speaker page (`/speaker`) — full brutalist treatment**
  - [x] 🟩 H1 → Bebas Neue, uppercase, text stroke
  - [x] 🟩 All H2 section headings → Bebas Neue, uppercase
  - [x] 🟩 "Why Book Nic" cards → `card-brutalist`, per-card rotation, sharp corners
  - [x] 🟩 "Keynote Topics" cards → `card-brutalist`, per-card rotation, sharp corners, card title → Bebas Neue
  - [x] 🟩 "How Virtual Delivery Works" step numbers → sharp corners (square instead of `rounded-full`)
  - [x] 🟩 Testimonial blockquotes → `card-brutalist`, per-card rotation
  - [x] 🟩 FAQ section → Bebas Neue heading
  - [x] 🟩 "As Seen At" brand names → Bebas Neue, uppercase

- [x] 🟩 **Step 5: About page (`/about`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Key facts grid → `card-brutalist` cards with per-card rotation, fact numbers → `heading-display`
  - [x] 🟩 Timeline dots → square (no `rounded-full`)
  - [x] 🟩 Book teaser cards → `card-brutalist`, per-card rotation
  - [x] 🟩 "As Featured In" brand names → `heading-display`, uppercase
  - [x] 🟩 Outcome pills → sharp corners (removed `rounded-full`)

- [x] 🟩 **Step 6: Keynotes listing page (`/keynotes`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Keynote cards → `card-brutalist`, per-card rotation, sharp corners
  - [x] 🟩 Card H2 titles → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Topic pills inside cards → sharp corners
  - [x] 🟩 Metadata row (Format, Duration, Best for) → sharp divider

- [x] 🟩 **Step 7: Individual keynote page (`/keynotes/[slug]`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 "Virtual Keynote" label → `heading-display`, uppercase
  - [x] 🟩 Outcome list numbers → square (no `rounded-full`)
  - [x] 🟩 Testimonial blockquotes → `card-brutalist`, per-card rotation
  - [x] 🟩 Related topic pills → sharp corners
  - [x] 🟩 Video embed → sharp corners

- [x] 🟩 **Step 8: Topics listing page (`/topics`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Topic cards → `card-brutalist`, per-card rotation, sharp corners
  - [x] 🟩 Card H2 titles → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Related keynote pills inside cards → sharp corners

- [x] 🟩 **Step 9: Individual topic hub page (`/topics/[slug]`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 "Topic Hub" label → `heading-display`, uppercase
  - [x] 🟩 Related keynote cards → `card-brutalist`, rotation, sharp corners, titles → `heading-display`
  - [x] 🟩 Featured/recent post cards → `border-2 border-accent-600`, sharp corners, titles → `heading-display`
  - [x] 🟩 "All topics" pills → sharp corners

- [x] 🟩 **Step 10: Blog listing page (`/blog`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 `MostReadHero` component — cards → `border-4 border-accent-600`, sharp corners, rank circle square, label/topic pills sharp, titles → `heading-display`, thumbnail sharp
  - [x] 🟩 `BlogList` component — post cards → `border-2 border-accent-600`, sharp corners, titles → `heading-display`, topic tags sharp, filter pills sharp, pagination sharp

- [x] 🟩 **Step 11: Individual blog post page (`/blog/[slug]`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Topic tag pills (top + bottom) → sharp corners
  - [x] 🟩 TL;DR aside box → `border-l-[8px] border-accent-600`
  - [x] 🟩 Featured image → sharp corners
  - [x] 🟩 Body content: unchanged — prose/raw HTML readability preserved
  - [x] 🟩 `FaqSection` component — heading → `heading-display`, sharp dividers
  - [x] 🟩 `RelatedPosts` component — heading → `heading-display`; cards → `border-2 border-accent-600`, sharp, titles → `heading-display`
  - [x] 🟩 `ContextualCta` component — heading → `heading-display`; sharp corners; accent-50 bg preserved
  - [x] 🟩 `VideoReadAlong` component → sharp corners on video container and featured label badge

- [x] 🟩 **Step 12: Books listing page (`/books`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Book cards → `card-brutalist`, per-card rotation, sharp corners
  - [x] 🟩 Card H2 titles → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Cover image → sharp corners
  - [x] 🟩 Topic pills → sharp corners

- [x] 🟩 **Step 13: Individual book page (`/books/[slug]`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 "Book" label → `heading-display`, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Cover image → sharp corners
  - [x] 🟩 Buy link buttons → `border-2 border-accent-600`, sharp corners
  - [x] 🟩 Body description: unchanged — readability preserved
  - [x] 🟩 Related topic pills → sharp corners

- [x] 🟩 **Step 14: Businesses page (`/businesses`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 "What I'm Building Now" cards → `card-brutalist`, per-card rotation, sharp corners, titles → `heading-display`
  - [x] 🟩 "Past Startups" cards → `card-brutalist`, rotation, sharp corners, titles → `heading-display`
  - [x] 🟩 "Deadpool" cards → `border-4 border-brand-400`, sharp corners, titles → `heading-display` (visually demoted)
  - [x] 🟩 Outcome pills → sharp corners
  - [x] 🟩 Closing blockquote → `heading-display-stroke-sm`, Bebas Neue, 1px stroke

- [x] 🟩 **Step 15: Media page (`/media`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 All H2 section headings → `heading-display`, Bebas Neue, uppercase
  - [x] 🟩 Media outlet logos → `heading-display`, uppercase
  - [x] 🟩 Appearance cards → `card-brutalist`, per-card rotation, sharp corners, titles → `heading-display`
  - [x] 🟩 Type pills → sharp corners

- [x] 🟩 **Step 16: Contact page (`/contact`)**
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Form inputs → sharp corners (no `rounded-*`)
  - [x] 🟩 Submit button → sharp, Bebas, uppercase (hand-styled to match CTAButton; no rotations)
  - [x] 🟩 Form kept clean and scannable — no thick borders or rotations

- [x] 🟩 **Step 17: 404 page (`/not-found`)**
  - [x] 🟩 "404" label → `heading-display`, `text-8xl sm:text-9xl`, accent colour
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Navigation links → sharp corners
  - [x] 🟩 CTAs → `CTAButton` (inherits sharp, Bebas, uppercase)

- [x] 🟩 **Step 18: Archive post page (`/archive/[slug]`)**
  - [x] 🟩 Archive banner → `border-2 border-brand-300`, sharp corners
  - [x] 🟩 H1 → `heading-display-stroke-sm`, Bebas Neue, uppercase
  - [x] 🟩 Body content: unchanged — legacy HTML readability preserved
  - [x] 🟩 Bottom CTAs → replaced hand-rolled `<Link>` with `<CTAButton>` components; heading → `heading-display`

- [x] 🟩 **Step 19: Clean up landing page overrides**
  - [x] 🟩 Remove redundant `!rounded-none font-bebas uppercase` overrides on homepage CTAs (now inherited from updated CTAButton)
  - [x] 🟩 Replace inline `heading-stroke font-bebas uppercase` with `heading-display-stroke` utility
  - [x] 🟩 Replace inline `font-bebas uppercase` h3s with `heading-display` utility
  - [x] 🟩 Verify landing page still looks identical after shared component updates

- [x] 🟩 **Step 20: Visual review and polish**
  - [x] 🟩 Verify no linter errors across all modified files
  - [x] 🟩 Build passes (`npm run build`) — 202 pages generated successfully
  - [ ] 🟥 Desktop review of every page — check visual consistency (manual)
  - [ ] 🟥 Mobile review of every page — `card-brutalist` is now responsive (12px mobile / 20px md+), verify no overflow
