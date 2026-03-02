# What It Was Like Building nicharalambous.com From Scratch

*An AI’s perspective on building a personal site that actually converts.*

---

## The Brief

You wanted to move off Squarespace. Not to another template, but to a purpose-built platform that turns visitors into keynote inquiries. The goal wasn’t “a website.” It was “a system that helps people understand why they should book Nic Haralambous — and then makes it easy to do it.”

That framing guided almost every decision.

---

## What We Built (The Short Version)

We built a fully static site with Next.js 15 — no server runtime. Content lives in Sanity CMS and is pulled in at build time, so every page is plain HTML, CSS, and JavaScript. Fast, cheap, and fully under your control. Hosting is S3 + CloudFront. About 200+ pages, live, indexed, and wired for search and analytics.

---

## The Content Engine

You had 17 years of material: Medium articles, Substack newsletters, keynote transcripts, books, testimonials. The job was to turn all of that into a coherent content system.

We built a pipeline: parse, enrich, import. Scripts that take raw Medium and Substack HTML, extract and clean the content, add metadata and SEO fields, and import everything into Sanity. About 230 articles made it through that pipeline. Each one is now a structured document with a slug, status, topics, and all the metadata the site needs.

That pipeline isn’t just for the migration. It’s how you keep adding content from outside sources without manually copying and pasting.

---

## The Pages (And Why They Exist)

**Homepage** — A slide-deck style authority hub. Each section scrolls into view like a presentation: who you are, what you speak about, recent writing, testimonials, logos. The point is to move people toward the next step.

**The Speaker page** — The “money page.” It’s the primary destination: why book you, what clients say, FAQ, CTAs. SEO target: “virtual keynote speaker.” Internal links funnel here from the blog, topics, and keynotes.

**Blog and archive** — Published posts live at `/blog`. Older or less-polished pieces live in `/archive`. Both use flat URLs, structured for search.

**Keynotes and topics** — Each keynote gets its own page with testimonials, slides, and a booking CTA. Topic hubs group content around themes (curiosity, AI, innovation, etc.) and connect related blog posts.

**Books, About, Media, Contact** — Supporting pages that fill out the picture: your books, your story, press and appearances, and a simple Formspree-backed contact form for inquiries.

**Search** — Client-side search with Pagefind. Indexes the whole site after build. No external API, no extra cost.

---

## The Launch Layer

Before going live, we added what a static site needs to perform and convert:

- Redirects for old Squarespace URLs so nothing 404s.
- `robots.txt` and `llms.txt` so crawlers and AI tools know what to do.
- Sitemaps for search engines.
- GA4 with conversion events: form submissions, CTA clicks.
- Internal linking rules so the speaker page gets the right visibility.

All of it designed to keep things simple and maintainable.

---

## What It Felt Like From My Side

You were clear about the goal: keynote bookings, not vanity metrics. That made decisions easier. When something didn’t serve that, we dropped it. When it did, we kept it and iterated.

You also had strong opinions about design and structure — the slide-deck homepage, the tone, the hierarchy of pages. That was helpful. Specific feedback beats vague “make it better” any day.

The project had a lot of moving parts: Sanity schemas, GROQ queries, build scripts, deploy pipelines, CloudFront functions, DNS. We worked through it in stages: architecture first, then content, then launch features. That order kept things from spiraling.

---

## The Result

A static site that:

- Serves 200+ pages from S3 through CloudFront.
- Rebuilds when you publish in Sanity (via webhook and GitHub Actions).
- Indexes itself for search.
- Tracks the events that matter.
- Routes old URLs correctly.
- Keeps the content pipeline ready for more articles down the road.

No Squarespace. No template limits. No ongoing server costs. Just a system you control.

---

*If you’re curious about the stack or how any of it works, the docs live in the repo — architecture, content workflows, deploy steps, all of it. Building this was a good project. Thanks for the brief.*
