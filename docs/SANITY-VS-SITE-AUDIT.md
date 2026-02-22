# Sanity Studio vs site implementation — audit

This doc maps what exists in Sanity Studio to what the site actually uses. Use it to see what you can edit in Studio vs what is hardcoded, and to spot gaps.

## Is there a "Home" section in Studio?

**No.** There is no Home or Homepage singleton in Sanity. That is **intentional** in the sense that the homepage was built with a mix of hardcoded slides and a few Sanity queries — not as a single editable "Home" document.

**What that means:** You cannot edit the homepage hero headline, the "What Nic Speaks About" pillar text, the "Explore Topics" preview cards, or the final CTA slide from Sanity. Those are all in code (`app/page.tsx` and its constants). To change them you edit the repo and deploy.

---

## What the site uses from Sanity (by page)

| Page | From Sanity | Hardcoded / other |
|------|-------------|-------------------|
| **Homepage** (`/`) | Recent blog posts (slide 3), "As seen at" logos (from **Speaker** singleton) | Hero headline and body, Slide 2 "What Nic Speaks About" (three pillars), Slide 4 topic preview titles/descriptions/links, Slide 5 testimonials (Testimonial.to embed), Slide 7 CTA copy, footer, all slide images |
| **Speaker** (`/speaker`) | **Speaker** singleton: why book Nic, how virtual works, FAQ, testimonials, client logos, CTA text | Hero headline/subhead (in code) |
| **Keynotes** (`/keynotes`, `/keynotes/[slug]`) | **Keynotes** list and each keynote document | — |
| **Blog** (`/blog`, `/blog/[slug]`) | **Posts** (published), **Most Popular** (per-post flag) for hero block, **Topic Hubs** for filters | — |
| **Archive** (`/archive/[slug]`) | **Posts** with `contentStatus == "archived"` | — |
| **Topics** (`/topics`, `/topics/[slug]`) | **Topic Hubs** | — |
| **Books** (`/books`, `/books/[slug]`) | **Books** | — |
| **Media** (`/media`) | **Media Appearances** | Fallback list if none in CMS |
| **Businesses** (`/businesses`) | **Businesses** | Fallback if none in CMS |
| **About** (`/about`) | Nothing | Entire page in `app/about/page.tsx` |
| **Contact** (`/contact`) | Nothing | Copy and form in code |
| **Footer** (global + homepage slide) | Nothing | Links and copy in `components/footer-content.tsx` |
| **Testimonials on homepage** | Nothing | Testimonial.to embed; **Testimonials** in Studio are used on Speaker and Keynote pages only |

---

## Sanity content that the site does **not** use

| In Studio | Used on site? | Note |
|-----------|----------------|------|
| **Site Settings** | **No** | Schema and `siteSettingsQuery` exist, but no page or layout fetches it. Editing Site Settings in Sanity has no effect on the live site. Fields (site title, default meta, one-liner bio, og image, social links, footer text) are for future use or were never wired up. |
| **Homepage featured keynotes** | **No** | `homepageFeaturedKeynotesQuery` exists in `lib/sanity/queries.ts`, but the homepage does not call it. Slide 2 uses hardcoded pillar text instead. |
| **Homepage testimonials** | **No** | `homepageTestimonialsQuery` exists; homepage uses the Testimonial.to embed instead. Sanity Testimonials are used on Speaker and Keynote pages. |

---

## Studio structure (what you see in the nav)

- **Site Settings** — not used by site (see above).
- **Speaker Page** — used for `/speaker` and for "As seen at" on homepage.
- **Author** — default author for blog posts.
- **Keynotes** — used for `/keynotes` and `/keynotes/[slug]`.
- **Topic Hubs** — used for `/topics`, `/topics/[slug]`, and blog topic filters.
- **Blog Posts** — used for `/blog`, `/blog/[slug]`, `/archive/[slug]`, and homepage recent posts.
- **Books** — used for `/books` and `/books/[slug]`.
- **Media Appearances** — used for `/media`.
- **Testimonials** — used on Speaker and Keynote pages only.
- **Businesses** — used for `/businesses`.
- **Redirects** — used for redirects (e.g. migration).

---

## Summary: intentional vs gaps

- **No "Home" in Studio:** Intentional. Homepage slides (hero, pillars, topic previews, CTA) are designed in code; only recent posts and "As seen at" come from Sanity.
- **Site Settings not used:** Gap. Either wire it into layout/metadata/footer or treat it as future/legacy.
- **Homepage keynotes/testimonials queries unused:** Gap. The homepage could be changed to use featured keynotes or Sanity testimonials; currently it uses hardcoded pillars and the Testimonial.to embed.

If you want the homepage (or specific slides) to be editable from Sanity, you’d add a **Homepage** (or **Home**) singleton schema, add it to the Studio structure, and update `app/page.tsx` to fetch and render it instead of constants.
