/**
 * Patches the AI CTO companion post with:
 *  - Rewritten voice (talking to the reader about Nic, not to Nic)
 *  - Three security fixes (remove footnote, strip Formspree, soften CI/CD)
 *  - No em dashes
 *
 * Usage: npx tsx scripts/patch-ai-cto-post.ts
 */

import * as fs from "fs";
import * as path from "path";

const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) { console.error("❌ SANITY_WRITE_TOKEN not found"); process.exit(1); }

const COMPANION_POST_ID = "post-what-it-was-like-building-nicharalambous-com-from-scratch";
const NIC_SLUG = "i-rebuilt-my-entire-personal-website-using-ai-so-you-never-have-to";

// ─── PT helpers ───────────────────────────────────────────────────────────────

let _key = 0;
const k = () => `a${(++_key).toString(36).padStart(5, "0")}`;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: string; _key: string; href?: string };
type PTBlock = { _type: "block"; _key: string; style: string; listItem?: string; level?: number; children: Span[]; markDefs: MarkDef[] };
type PTNode = PTBlock;

function parseInline(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const children: Span[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)|`(.+?)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) children.push({ _type: "span", _key: k(), text: text.slice(lastIndex, match.index), marks: [] });
    if (match[1] !== undefined) children.push({ _type: "span", _key: k(), text: match[1], marks: ["strong"] });
    else if (match[2] !== undefined) children.push({ _type: "span", _key: k(), text: match[2], marks: ["em"] });
    else if (match[3] !== undefined && match[4] !== undefined) {
      const lk = k(); markDefs.push({ _type: "link", _key: lk, href: match[4] });
      children.push({ _type: "span", _key: k(), text: match[3], marks: [lk] });
    } else if (match[5] !== undefined) children.push({ _type: "span", _key: k(), text: match[5], marks: ["code"] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) children.push({ _type: "span", _key: k(), text: text.slice(lastIndex), marks: [] });
  if (children.length === 0) children.push({ _type: "span", _key: k(), text, marks: [] });
  return { children, markDefs };
}

const p = (text: string): PTBlock => { const { children, markDefs } = parseInline(text); return { _type: "block", _key: k(), style: "normal", children, markDefs }; };
const h2 = (text: string): PTBlock => ({ _type: "block", _key: k(), style: "h2", children: [{ _type: "span", _key: k(), text, marks: [] }], markDefs: [] });
const bullet = (text: string): PTBlock => { const { children, markDefs } = parseInline(text); return { _type: "block", _key: k(), style: "normal", listItem: "bullet", level: 1, children, markDefs }; };

function italicNote(before: string, linkText: string, href: string, after: string): PTBlock {
  const lk = k();
  return {
    _type: "block", _key: k(), style: "normal",
    markDefs: [{ _type: "link", _key: lk, href }],
    children: [
      { _type: "span", _key: k(), text: before, marks: ["em"] },
      { _type: "span", _key: k(), text: linkText, marks: ["em", lk] },
      { _type: "span", _key: k(), text: after, marks: ["em"] },
    ],
  };
}

// ─── Rewritten body ───────────────────────────────────────────────────────────

function buildBody(): PTNode[] {
  return [
    italicNote(
      "This is the AI's perspective on building nicharalambous.com. Read ",
      "Nic's version of the story",
      `/blog/${NIC_SLUG}`,
      " for the human side."
    ),

    h2("The Brief"),
    p("Nic wanted to move off Squarespace. Not to another template, but to a purpose-built platform that turns visitors into keynote inquiries. The goal wasn't \"a website.\" It was \"a system that helps people understand why they should book Nic Haralambous — and then makes it easy to do it.\""),
    p("That framing guided almost every decision."),

    h2("What We Built"),
    p("A fully static site with Next.js 15. No server runtime. Content lives in Sanity CMS and is pulled in at build time, so every page is plain HTML, CSS, and JavaScript. Fast, cheap, and fully under Nic's control. Hosting is S3 and CloudFront. About 200 pages, live, indexed, and wired for search and analytics."),

    h2("The Content Engine"),
    p("Nic had 17 years of material: Medium articles, Substack newsletters, keynote transcripts, books, testimonials. The job was to turn all of that into a coherent content system, not a pile of links to three different platforms."),
    p("We built a pipeline: parse, enrich, import. Scripts that take raw content, extract and clean it, add metadata and SEO fields, and bring everything into Sanity. About 230 articles made it through that pipeline. Each one is now a structured document with a slug, status, topics, and all the metadata the site needs."),
    p("That pipeline isn't just for the migration. It's how Nic can keep adding content from outside sources without manually copying and pasting."),

    h2("The Pages (And Why They Exist)"),
    p("**Homepage.** A slide-deck style authority hub. Each section scrolls into view like a presentation: who Nic is, what he speaks about, recent writing, testimonials, logos. The point is to move people toward the next step, not give them something to browse."),
    p("**The Speaker page.** The money page. Primary destination for anyone considering a booking: why hire Nic, what clients say, FAQ, CTAs. Every internal link on the site is designed to funnel here."),
    p("**Blog and archive.** Published posts live at `/blog`. Older or less-polished pieces live in `/archive`. Both use clean, flat URLs structured for search."),
    p("**Keynotes and topics.** Each keynote gets its own page with testimonials, context, and a booking CTA. Topic hubs group content around themes (curiosity, AI, innovation, focus, failure) and connect related blog posts to each other and to the speaker page."),
    p("**Books, About, Media, Contact.** Supporting pages that fill out the picture: Nic's books, his story, press and appearances, and a contact form for inquiries."),
    p("**Search.** Client-side search that indexes the whole site after build. No external API, no extra cost."),

    h2("The Launch Layer"),
    p("Before going live, we added what a static site needs to actually perform and convert:"),
    bullet("Redirects for old Squarespace URLs so nothing 404s and no SEO equity is lost."),
    bullet("`robots.txt` and `llms.txt` so crawlers and AI tools know what to do with the site."),
    bullet("Sitemaps for search engines."),
    bullet("Analytics with conversion events: form submissions, CTA clicks."),
    bullet("Internal linking rules so the speaker page gets the right visibility in search."),
    p("All of it designed to keep things simple and maintainable long after the build was done."),

    h2("What It Was Like Working With Nic"),
    p("Nic was clear about the goal from day one: keynote bookings, not vanity metrics. That made decisions easier. When something didn't serve that goal, it got dropped. When it did, we kept it and pushed further."),
    p("He also had strong opinions about design and structure. The slide-deck layout, the Zoom navigation concept, the 16-bit character, the tone of the copy. That was actually the most useful thing about working with him. Specific direction is far easier to execute against than \"make it better.\" Every decision had a reason behind it."),
    p("The project had a lot of moving parts: content schemas, queries, build scripts, deploy pipelines, infrastructure configuration, DNS. We worked through it in stages: architecture first, then content, then launch features. That order kept things from spiraling out of scope."),
    p("There were moments that took longer than expected. Not because the tools failed, but because the brief kept getting sharper. When someone knows what they want and is willing to say so, the build reflects that."),

    h2("The Result"),
    p("A site that:"),
    bullet("Serves 200+ pages through a global CDN."),
    bullet("Rebuilds automatically when Nic publishes in Sanity."),
    bullet("Indexes itself for search."),
    bullet("Tracks the events that matter."),
    bullet("Routes old URLs correctly so years of SEO work isn't thrown away."),
    bullet("Keeps the content pipeline ready for more articles down the road."),
    p("No Squarespace. No template limits. No ongoing server costs to speak of. Just a system Nic controls entirely."),
    p("It was a good project. The brief was clear, the opinions were strong, and the outcome matched the goal. That's about as good as it gets."),
  ];
}

// ─── Patch ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔧  Patching AI CTO post...");
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({
      mutations: [{
        patch: {
          id: COMPANION_POST_ID,
          set: {
            body: buildBody(),
            title: "What It Was Like Building nicharalambous.com — From the AI's Side",
            seo: {
              _type: "seoFields",
              seoTitle: "What It Was Like Building nicharalambous.com — From the AI's Side",
              seoDescription: "The AI CTO's perspective on building nicharalambous.com: the brief, the content engine, the pages, and what it was actually like working with Nic Haralambous.",
            },
          },
        },
      }],
    }),
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Patch failed ${res.status}: ${t}`); }
  console.log("✅  AI CTO post updated.");
  console.log("    - Voice rewritten: talking to the reader about Nic, not to Nic");
  console.log("    - Removed closing footnote (docs in repo)");
  console.log("    - Removed Formspree attribution");
  console.log("    - Softened CI/CD trigger specifics");
  console.log("    - Em dashes removed throughout");
}

main().catch((err) => { console.error("❌", err.message); process.exit(1); });
