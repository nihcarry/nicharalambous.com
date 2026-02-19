# Landing Page Design System — Implementation Plan

**Overall Progress:** `100%` ✅

---

## TLDR

Apply the brutalist design language established on Slide 2 ("What Nic Speaks About") across all 8 landing page slides. Each slide is styled independently so any one can be changed without affecting the others. The system is: Bebas Neue display headings with a 4px black text stroke, a per-slide thematic SVG icon repeat background, 20px blue-bordered white cards with slight rotations, and sharp-cornered Bebas Neue CTA buttons.

---

## Design System Tokens (Established on Slide 2)

| Token | Value |
|---|---|
| Display font | `font-bebas` — Bebas Neue, uppercase |
| Heading stroke | `WebkitTextStroke: "4px black"`, `paintOrder: "stroke fill"` applied inline per slide |
| Card border | `border-[20px] border-accent-600` |
| Card background | `bg-white`, hover `bg-accent-50` |
| Card tilt | Unique `rotate()` per card, e.g. `-1.5deg / 1deg / -0.75deg` |
| CTA button | `!rounded-none font-bebas uppercase` |
| Background | Per-slide CSS utility class, each independent, light neutral base + inline SVG icon |

---

## Critical Decisions

- **Each slide is fully independent** — backgrounds, heading styles, and card treatments are applied slide-by-slide so any slide can be changed, swapped, or removed without touching the others
- **No shared heading utility class** — text stroke and Bebas Neue are applied as inline styles directly on each heading so per-slide overrides are trivial
- **Per-slide background CSS utilities in globals.css** — each slide gets its own named class (`.bg-mic-pattern`, `.bg-pen-pattern`, etc.). Changing a slide's background means swapping one class name
- **CSS-only patterns, zero image files** — all backgrounds are inline SVG data URIs; ~2KB total CSS addition, zero HTTP requests, zero SEO impact
- **Icon themes tied to Nic's identity** — every icon is drawn from the three core pillars: entrepreneur, virtual keynote speaker, AI product builder
- **Slide 7 (Final CTA) loses the blue background** — replaced with a neutral light background + pattern, consistent with all other slides. Heading stroke stays black like the rest
- **Slide 8 (Footer) stays clean** — no pattern, it's a utility slide not a content statement
- **Body/prose text stays as Inter** — only headings and card titles switch to Bebas Neue

---

## Per-Slide Background Icons

| Slide | Icon | Theme connection |
|---|---|---|
| 1 — Hero | Rocket | Entrepreneur launching ventures |
| 2 — Keynotes | Handheld mic ✅ | Keynote speaker on stage |
| 3 — Blog/Thinking | Pen / nib | Writing, publishing, ideas |
| 4 — Topics | Lightbulb | Innovation, curiosity, AI ideas |
| 5 — Testimonials | Speech bubble | Audience voice, speaker feedback |
| 6 — As Seen At | Broadcast tower | Media, stage, global reach |
| 7 — Final CTA | Calendar | Booking, events, engagements |
| 8 — Footer | None | Clean utility slide |

---

## Tasks

- [x] 🟩 **Step 1: Slide 2 — "What Nic Speaks About"** *(complete)*
  - [x] 🟩 Bebas Neue loaded via next/font, `font-bebas` token in globals.css
  - [x] 🟩 `.bg-mic-pattern` — handheld mic, tilted 25°, 72px tile
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline
  - [x] 🟩 Cards → border-[20px], bg-white, rotated, sharp corners
  - [x] 🟩 CTA → !rounded-none, font-bebas, uppercase

- [x] 🟩 **Step 2: Add remaining background CSS utilities to globals.css**
  - [x] 🟩 `.bg-rocket-pattern` — rocket icon (Hero slide)
  - [x] 🟩 `.bg-pen-pattern` — pen/nib icon (Blog slide)
  - [x] 🟩 `.bg-lightbulb-pattern` — lightbulb icon (Topics slide)
  - [x] 🟩 `.bg-speech-pattern` — speech bubble icon (Testimonials slide)
  - [x] 🟩 `.bg-broadcast-pattern` — broadcast tower icon (As Seen At slide)
  - [x] 🟩 `.bg-calendar-pattern` — calendar icon (Final CTA slide)

- [x] 🟩 **Step 3: Slide 1 — Hero**
  - [x] 🟩 Background → `.bg-rocket-pattern`
  - [x] 🟩 h1 → font-bebas, 4px black stroke inline (retains blue/dark colour split on spans)
  - [x] 🟩 Both CTA buttons → !rounded-none, font-bebas, uppercase

- [x] 🟩 **Step 4: Slide 3 — "Latest Thinking" (blog posts, conditional)**
  - [x] 🟩 Background → `.bg-pen-pattern`
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline
  - [x] 🟩 Post cards → border-[20px], bg-white, per-card rotation, sharp corners
  - [x] 🟩 Post card h3 → font-bebas, uppercase, accent-600
  - [x] 🟩 CTA → !rounded-none, font-bebas, uppercase

- [x] 🟩 **Step 5: Slide 4 — "Explore Topics"**
  - [x] 🟩 Background → `.bg-lightbulb-pattern`
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline
  - [x] 🟩 All 6 topic cards → border-[20px], bg-white, per-card rotation, sharp corners
  - [x] 🟩 Topic card h3 → font-bebas, uppercase, accent-600
  - [x] 🟩 CTA → !rounded-none, font-bebas, uppercase

- [x] 🟩 **Step 6: Slide 5 — "What Clients Say" (testimonials)**
  - [x] 🟩 Background → removed stage-glow.jpg image prop, added `.bg-speech-pattern`
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline
  - [x] 🟩 Blockquote cards → border-[20px], bg-white, per-card rotation, sharp corners
  - [x] 🟩 Author name → font-bebas, uppercase

- [x] 🟩 **Step 7: Slide 6 — "As Seen At"**
  - [x] 🟩 Background → removed bg-brand-50, added `.bg-broadcast-pattern`
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline
  - [x] 🟩 Brand name spans → font-bebas, uppercase, text-2xl, accent-600

- [x] 🟩 **Step 8: Slide 7 — Final CTA**
  - [x] 🟩 Background → removed bg-accent-600 and stage-glow.jpg, added `.bg-calendar-pattern`
  - [x] 🟩 h2 → font-bebas, uppercase, 4px black stroke inline (black on light bg)
  - [x] 🟩 Body text → text-brand-700
  - [x] 🟩 Both CTA buttons → !rounded-none, font-bebas, uppercase, styled for light background

- [x] 🟩 **Step 9: Review pass**
  - [x] 🟩 Desktop visual consistency check — all 8 slides confirmed consistent
  - [x] 🟩 No linter errors on page.tsx or globals.css
  - [x] 🟩 Unused SlideImage import removed
