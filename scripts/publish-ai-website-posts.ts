/**
 * Publishes two blog posts to Sanity:
 *  1. Nic's article: "I rebuilt my entire personal website using AI so you never have to."
 *  2. AI companion post: "What It Was Like Building nicharalambous.com From Scratch"
 *
 * Usage: npx tsx scripts/publish-ai-website-posts.ts
 */

import * as fs from "fs";
import * as path from "path";

// ─── Load .env.local ─────────────────────────────────────────────────────────

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

if (!TOKEN) {
  console.error("❌  SANITY_WRITE_TOKEN not found in .env.local");
  process.exit(1);
}

// ─── Portable Text types & helpers ───────────────────────────────────────────

let _key = 0;
const k = () => `k${(++_key).toString(36).padStart(5, "0")}`;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: string; _key: string; href?: string };
type PTBlock = {
  _type: "block";
  _key: string;
  style: string;
  listItem?: string;
  level?: number;
  children: Span[];
  markDefs: MarkDef[];
};
type PTImage = {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};
type PTNode = PTBlock | PTImage;

/** Parse inline markdown: **bold**, *italic*, [text](url), `code` */
function parseInline(text: string): { children: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const children: Span[] = [];
  // Order matters: ** before * to avoid partial match
  const regex =
    /\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\)|`(.+?)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({
        _type: "span",
        _key: k(),
        text: text.slice(lastIndex, match.index),
        marks: [],
      });
    }
    if (match[1] !== undefined) {
      children.push({ _type: "span", _key: k(), text: match[1], marks: ["strong"] });
    } else if (match[2] !== undefined) {
      children.push({ _type: "span", _key: k(), text: match[2], marks: ["em"] });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const linkKey = k();
      markDefs.push({ _type: "link", _key: linkKey, href: match[4] });
      children.push({ _type: "span", _key: k(), text: match[3], marks: [linkKey] });
    } else if (match[5] !== undefined) {
      children.push({ _type: "span", _key: k(), text: match[5], marks: ["code"] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    children.push({
      _type: "span",
      _key: k(),
      text: text.slice(lastIndex),
      marks: [],
    });
  }
  if (children.length === 0) {
    children.push({ _type: "span", _key: k(), text, marks: [] });
  }
  return { children, markDefs };
}

function p(text: string): PTBlock {
  const { children, markDefs } = parseInline(text);
  return { _type: "block", _key: k(), style: "normal", children, markDefs };
}

function h2(text: string): PTBlock {
  return {
    _type: "block", _key: k(), style: "h2",
    children: [{ _type: "span", _key: k(), text, marks: [] }], markDefs: [],
  };
}

function h3(text: string): PTBlock {
  return {
    _type: "block", _key: k(), style: "h3",
    children: [{ _type: "span", _key: k(), text, marks: [] }], markDefs: [],
  };
}

function bullet(text: string): PTBlock {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block", _key: k(), style: "normal",
    listItem: "bullet", level: 1, children, markDefs,
  };
}

/** Italic paragraph with optional trailing link */
function italicNote(
  beforeText: string,
  linkText: string,
  href: string,
  afterText: string
): PTBlock {
  const linkKey = k();
  return {
    _type: "block", _key: k(), style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href }],
    children: [
      { _type: "span", _key: k(), text: beforeText, marks: ["em"] },
      { _type: "span", _key: k(), text: linkText, marks: ["em", linkKey] },
      { _type: "span", _key: k(), text: afterText, marks: ["em"] },
    ],
  };
}

function img(ref: string, alt: string): PTImage {
  return {
    _type: "image", _key: k(),
    asset: { _type: "reference", _ref: ref }, alt,
  };
}

// ─── Sanity API ───────────────────────────────────────────────────────────────

async function sanityMutate(mutations: Record<string, unknown>[]) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity mutate failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function uploadImage(
  filePath: string,
  mimeType: string,
  filename: string
): Promise<string> {
  const data = fs.readFileSync(filePath);
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      Authorization: `Bearer ${TOKEN}`,
    },
    body: data,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Image upload failed for ${filename}: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { document: { _id: string } };
  return json.document._id;
}

// ─── Post bodies ─────────────────────────────────────────────────────────────

const COMPANION_SLUG = "what-it-was-like-building-nicharalambous-com-from-scratch";
const NIC_SLUG = "i-rebuilt-my-entire-personal-website-using-ai-so-you-never-have-to";

function buildNicBody(images: {
  cursor: string;
  zoom: string;
  nics: string;
  tip: string;
}): PTNode[] {
  return [
    // Italic companion note at the top
    italicNote(
      "Curious about the technical side of this build? Read the ",
      "companion post written by my AI CTO",
      `/blog/${COMPANION_SLUG}`,
      "."
    ),

    // Intro
    p("I'm going to cut right to the chase: I rebuilt my entire personal website from the ground up using AI tools. And I'm here to tell you that you should probably never do this."),
    p("That's not a disclaimer. That's the whole point."),
    p("Before I explain, here's the number that matters. When I started looking at what this rebuild would cost me if I hired an agency, the cheapest quote I got was $20,000. I did it for under $250 in AI credits. The site went live with a 100% SEO score on desktop, 98% performance, 96% accessibility. Within days of launching, organic traffic was five to six times what it had ever been on my old site."),
    p("So yes. I'm telling you not to do this because of the complexity involved, but I also want you to understand exactly why I could."),

    // Section 1
    h2("I am not a software developer. I am not a designer."),
    p("I want to be very clear about that from the start. I have, however, spent over 20 years building technology products and businesses. I've launched things, failed at things, exited things, and broken things more times than I can count. I understand, at a high level, how systems fit together. What a backend does. Why a DNS record matters. What hosting means. What happens when something breaks in production at 2am."),
    p("That context is not a small thing. It's everything. I'll come back to that."),
    p("I started blogging in about 2007. I've been on WordPress, Blogger, Wix, and then Squarespace for the last seven years. The site was always just OK. It never really felt like mine. It never reflected what I was actually doing or building. And for the past several years I've been increasingly focused on one thing: virtual keynote speaking. I've been a public speaker since I was 17 and was fortunate enough to present a talk in front of Nelson Mandela and about a thousand kids and parents at my school. I love it. I wanted a website that screamed that, not a blog with a speaker page tacked on the end."),
    p("So about two weeks ago, I made the insane decision to rebuild everything from scratch on my own using only AI to help me... just to see if it was possible and at what level."),

    // Section 2: Design
    h2("The design: one concept that unlocked everything"),
    p("The design took the longest. Not because the tools were hard, because the concept had to be right before anything else could work."),
    p("I knew a few things going in. I wanted the site to have a clear hierarchy and a singular focus. I am a jack of all trades. I've built businesses, written books, consulted, invested, failed spectacularly at several things. But there is one thing I wanted to highlight on this new site of mine: I am a speaker. That had to be the centre of gravity for the whole site."),
    p("So I put myself in the shoes of the person booking me. A corporate events manager. A conference organiser. Someone who has sat through too many mediocre Zoom presentations and is looking for someone different. What do they see when they think of a virtual keynote?"),
    p("They see Zoom."),
    p("That was the unlock. I opened Zoom, started a call, shared my screen as if I was presenting, and looked at the interface. The controls. The toolbar. The participant view. I'd been staring at that interface for years without really seeing it. And suddenly it was obvious: that was the design language for the entire site."),
    p("I took a screenshot of the Zoom interface and fed it into Gemini, asking it to reproduce the navigation as closely as possible in code. Then I took that into Cursor with Opus 4.6 and rebuilt it component by component, button by button — the reactions, the participants icon, the share screen button — until it was almost a pixel match to the actual Zoom navigation bar."),
    img(images.zoom, "Zoom interface screenshot"),
    p("vs"),
    img(images.nics, "Nic's custom navigation inspired by Zoom"),
    p("Once I had that, the rest of the site poured out."),
    p("If the nav was Zoom, then each section had to be a slide. I started designing the site the way I design one of my own virtual talks. Hero. What I speak about. Social proof. A CTA. Each section a slide. Each slide a moment that the visitor can flick through."),
    p("And then: where does Nic go in all of this? That's where the 16-bit version of me came in. I asked Gemini to create a consistent pixel-art character, a 16-bit Nic, that I could embed into each slide to tell a small story, add personality, and keep people scrolling. I created a custom Gemini prompt that would reliably produce 16-bit images on demand so I could drop the character into any slide I needed."),
    p("The entire visual identity came from a single question: what does my audience already recognise? The answer was Zoom. Everything else followed from there."),
    p("Go have a look at what that looks like in practice: [nicharalambous.com](https://nicharalambous.com)."),

    // Section 3: The thing no one tells you
    h2("The thing no one tells you about AI tools"),
    p("The world right now is absolutely drowning in AI hype. Every platform, every newsletter, every LinkedIn post is telling you how extraordinary these tools are. And they are. I'm not here to argue with that. But there's something important that all of that hype leaves out."),
    p("AI is only as good as the person directing it."),
    p("You've probably tried some of these tools. You've probably hit a wall. Maybe you got something halfway useful and then it fell apart. Maybe the output looked right but felt wrong. Maybe you just didn't know what to do next. And if you're honest, you've probably wondered whether it's you."),
    p("It's not you. **It's the experience gap.**"),
    p("The tools I used — Cursor, Claude, Gemini, ChatGPT — are genuinely remarkable. But here's what they can't do: they can't know what you don't know and they sure as shit don't have your taste. If you ask an AI to build you a plan for a complex website, it will build you an extraordinarily detailed plan. It will cover almost everything. Almost. And the things it leaves out — the private keys, the `robots.txt` settings, the cache headers, the DNS configurations, the 47 other things that live in the margins of a production build — those are exactly the things that a person with experience knows to check, and a person without experience doesn't know exist."),
    p("That's not a flaw in the AI. That's the deal. The tool is powerful but the operator needs to match it to get the most out."),

    // Section 4: The moment I thought I'd broken everything
    h2("The moment I thought I'd broken everything"),
    p("Let me give you a concrete example."),
    p("Deep into this build — I'm talking days and days of work (which is fucking hilarious to say out loud when I still remember a world where it took months and months to complete a build of this size) — hundreds of decisions, thousands of lines of code, and I was ready to go live. The plan was 99.9% complete. The AI told me so. I flicked everything on. The website loaded on my domain. It looked good. I was genuinely proud of what I was looking at."),
    p("And then I clicked a link."),
    p("Every single link on the website opened a plain text file with a `.txt` extension. Not a page. A file. The whole site — every article, every page, every carefully built keynote landing page — was serving raw text files to anyone who visited."),
    p("I had no idea what had happened. Neither did the AI, at first. It took me 15 or 20 minutes of digging with AI help to figure out that the `robots.txt` file wasn't correctly excluding `.txt` files from the build output. A small configuration detail. Completely invisible if you don't know to look for it. The kind of thing that would make a normal person think the whole project was broken beyond repair."),
    p("I knew it was solvable. I knew roughly where to look. I knew the language to use when asking for help diagnosing it. That knowledge came from two decades of building things and watching them break."),
    p("There were moments like that throughout this entire build. Micro-crises that my experience could absorb. That's not me boasting, it's just me being honest with you about what this actually took."),
    p("If you understand the lexicon of the thing you're trying to build — the words that the people in the industry use — these builds become faster, quicker, easier, and more straightforward. Instead of asking AI to \"add a username and password so that users can log in\", you're asking for an authentication flow. You're not asking for \"a page that explains what your service does before somebody joins\" — you're asking for an onboarding flow. If you don't know those words, you're working twice as hard for half the result."),
    p("As my grandfather used to say: \"You can buy bread and you can buy cheese, but you can't buy this experience.\" The only way to gain this kind of lexicon is to build stuff."),

    // Section 5: The workflow
    h2("The workflow: I didn't just use AI. I built a system for using AI."),
    p("Most people who try to use AI for something complex treat it like a vending machine. Put in a request, get out a result. That works for simple things. For something like this, it's not enough."),
    p("Here's how I actually worked."),
    p("I started by using ChatGPT to plan the entire migration and build at a high level — SEO strategy, content migration for roughly 1,600 articles written over 20 years, keyword research, analytics. That plan went into a markdown document. A big one."),
    p("Then I took that plan into Cursor — an IDE that software engineers use to write code, which I had set up so that I could use it without writing a single line of code myself — and used Anthropic's Claude Opus model to tear the plan apart. To stress-test it. To find what was missing."),
    img(images.cursor, "My Cursor IDE setup for the build"),
    p("From there, I built a set of custom skills inside Cursor that governed my entire workflow:"),
    bullet("/explore — the AI and I think through what we're building together before touching any code."),
    bullet("/create-plan — from the exploration, the AI creates a detailed, modular plan broken into phases, so we can stop cleanly between each one."),
    bullet("/execute — the AI builds the phase."),
    bullet("/review — a different AI model (I used OpenAI's Codex) reviews what Opus just built."),
    bullet("/peer-review — Opus then reviews Codex's feedback, and produces a final list of fixes."),
    bullet("/build-deploy — a single command that builds the site and deploys it to AWS, so I never have to do it manually."),
    p("Thanks to [Zevi](https://www.linkedin.com/in/zev-arnovitz/) for the basic structure of these skills!"),
    p("Every time something frustrated me or felt repetitive, I asked the AI to create a new skill to handle it. That system — that layered, spec-driven, multi-model process — is what made the output as good as it is. Not the AI alone. The system I built around it."),
    p("I talked to Opus like a CTO. It executed like some of the best engineers I've ever worked with. It rarely hallucinated. It kept context across a massive build. But I was always the one deciding what to build, what to check, what was missing from the plan, and when something had gone sideways."),

    // Section 6: The tools
    h2("The tools I used"),
    p("It wasn't one thing. It was a small ecosystem of tools, each doing a specific job."),
    h3("For design and visuals"),
    bullet("**Google Gemini** — Every one of those pixelated characters you see, and the basic slide structure of the site, came from Gemini. It was my visual creative partner."),
    bullet("**Claude Opus** — For the background images that shift on every slide and match the content of that section. It helped me think through what each section needed to feel like and then produce it."),
    bullet("**Remove.bg** — Once Gemini had generated the character images, I needed to strip the backgrounds so they'd be transparent. Remove.bg handled that cleanly and quickly."),
    h3("For thinking and content"),
    bullet("**ChatGPT** — General problem-solving around SEO strategy and anything I needed to think through before touching code. I also built a custom GPT called The Reducer, specifically designed to help me cut ideas down to their most valuable core and avoid scope creep."),
    h3("For input — and this one matters more than people realise"),
    p("**[Wispr Flow](https://wisprflow.ai/r?NIC64)** — One of the most underrated unlocks for getting serious results from AI tools."),
    p("There is a filter that kicks in when you go from thinking a thought to speaking it. There is an entirely different, much heavier filter from thinking to typing. When we type, we edit as we go. We compress. We strip out context and nuance trying to produce a clean sentence — exactly the opposite of what AI tools need. These models want more context, more detail, more of your actual thinking."),
    p("Dictating removes that second filter. The prompts get longer, richer, and more specific — and the outputs get dramatically better as a result. Using it made working with my AI tools feel like talking to a teammate rather than operating a machine."),
    p("If you're typing your prompts, you're leaving quality on the table. And if I'm being honest, I only physically typed about 30% of this article — the rest was dictated through [Wispr Flow](https://wisprflow.ai/r?NIC64)."),
    h3("For building"),
    p("Almost everything lived inside **Cursor**. Four models, four jobs:"),
    bullet("**Claude Opus 4.6** — The main workhorse. Did roughly 90% of the actual build. I talked to it like a CTO. It executed like one."),
    bullet("**Claude Sonnet 4.6** — Released mid-build. Fast, reliable secondary model for tasks that didn't need Opus-level depth."),
    bullet("**OpenAI Codex 5.3** — Code review only. That two-model review process caught things a single model would have missed."),
    bullet("**Cursor's built-in Composer model** — For quick, small changes. Fast and useful for tight, scoped tasks."),
    h3("For content management"),
    bullet("**Sanity CMS** — The headless CMS that sits behind the entire site. I publish there; the site rebuilds and goes live. No platform logins, no dependencies on anyone else."),
    h3("For security"),
    p("Security is the thing most people skip when building something new. I didn't want to do that. I found security skills online — frameworks created by security experts and shared publicly — and loaded them into Cursor so the AI had a proper security checklist to work from. From there: Opus ran the initial review, Codex reviewed Opus's findings, Opus peer-reviewed Codex's feedback, and I implemented the fixes."),
    p("It's not a replacement for a professional security audit. But for a static marketing site, it's a serious, systematic process that most solo builders never bother with."),
    p("That's the full stack. Simple in concept. Significant in practice."),

    // Section 7: Why you shouldn't
    h2("So why shouldn't you do this?"),
    p("Because Squarespace is fine for most things most people need. Wix is fine. WordPress is fine."),
    p("I mean that genuinely. If you want a personal website, a portfolio, a small business presence — use one of those. They exist because the complexity of building a site from scratch is real, and most people have no reason to wrestle with it."),
    p("The reason I chose to do this is because I believe that people with deep experience can use AI tools in a way that's simply not available to everyone yet. Not because AI is gatekept, but because the experience that lets you direct it effectively takes time to build."),
    p("You need to know what a favicon is before you can care that it's missing. You need to understand the difference between a frontend and a backend before you can ask an intelligent question about why one of them isn't working. You need to have felt the specific panic of a broken deploy before you know how to keep calm and look in the right place."),
    p("The AI doesn't tell you what you don't know to ask. That's the gap. And it's not the AI's fault."),

    // Section 8: Gap is closeable
    h2("But here's the thing. That gap is closeable."),
    p("I am not uniquely gifted. I promise you. I am not smarter than you, I am not more technically talented, and I have failed publicly and embarrassingly more times than most people I know. What I have is experience — and experience is just the residue of spending years trying things, breaking things, learning things, and trying again."),
    p("The single most important thing I can tell you is this: your ability to be curious, to try, to ask questions and push further and toil through the frustrating parts — that is what will set you apart. Not in this project, maybe. Not right now. But over time, and sooner than you think."),
    p("Start smaller. Build something. Break it. Ask why. Fix it. Repeat that enough times and eventually you'll be in a position where you can sit in front of a tool like Cursor and say \"we're building a full website from scratch\" and mean it."),
    p("Do. Fail. Learn. Repeat."),

    // Section 9: Tips
    h2("Tips for getting started with AI builds"),
    p("If you're going to start experimenting with AI tools seriously, here's what I'd tell you from the other side of this build."),
    h3("1. You already know how to prompt. You've just been doing it with humans."),
    p("As a business founder and product leader, I've been prompting for 20 years. Telling people what I need, clarifying when they misunderstand, giving feedback when the output is wrong. That's prompting. The skill transfers directly. Stop treating AI like a search engine and start treating it like a colleague who needs a proper brief."),
    h3("2. Use dictation. Typing is for chumps."),
    p("I built most of this with my voice. Dictating is faster, more natural, and produces better prompts because you talk the way you actually think."),
    h3("3. Get the agent to write a handover document before switching models."),
    p("Every time I moved from one model or one phase to the next, I'd ask the current agent to write a short handover document. It saves tokens, cuts context loss, and forces you to review the plan regularly. Build that habit early."),
    h3("4. When an agent keeps struggling with something, turn it into a skill."),
    p("If you find yourself repeating the same instructions over and over, that's a signal. Write a skill — a short document that tells the agent exactly how to do that thing, every time, the same way."),
    h3("5. Use screenshots to have one model critique another model's frontend."),
    p("After Opus built a page, I'd screenshot it and ask a different model to critique the implementation visually. Models catch different things. Two sets of eyes, even AI ones, are better than one."),
    img(images.tip, "Using a screenshot to get one AI model to critique another's frontend work"),
    h3("6. For visuals: Gemini, then Remove.bg."),
    p("Tell Gemini: *\"Only include this element. Make the entire rest of the image a plain white background.\"* Then run the output through Remove.bg to get a clean transparent PNG. One critical note: **this only works if you are not in the EU.** Gemini's image generation is restricted there — use a VPN if needed."),
    h3("7. Design by drawing first."),
    p("Before you ask any AI to build something, sketch it. Even badly. Even on a napkin. The act of drawing forces you to make decisions — layout, hierarchy, what goes where — that you'll otherwise leave to the AI and spend three rounds of prompting trying to correct. A two-minute sketch saves an hour of back-and-forth."),

    // Closing CTA
    p("I built [nicharalambous.com](https://nicharalambous.com). It runs on Next.js 15, costs less than $10 a month to host, and I manage it entirely myself. No platform logins. No agency. No dependencies on anyone else."),
    p("I'm proud of it. Not because it's perfect. Because I built it myself, with tools I learned to use, on a foundation of experience that took me two decades to accumulate."),
    p("If you want someone who actually uses these tools — who understands what it means to build with AI, not just talk about it — [book me for a keynote](https://nicharalambous.com/speaker) or sign up for the next cohort of [NoBullShip.co](http://NoBullShip.co) and take your own idea live."),
    p("You never have to do what I did. But you should absolutely understand why I could."),
  ];
}

function buildAiBody(): PTNode[] {
  return [
    // Link back to Nic's article
    italicNote(
      "This is the AI's perspective on building nicharalambous.com. Read ",
      "Nic's version of the story",
      `/blog/${NIC_SLUG}`,
      " for the human side."
    ),

    h2("The Brief"),
    p("You wanted to move off Squarespace. Not to another template, but to a purpose-built platform that turns visitors into keynote inquiries. The goal wasn't \"a website.\" It was \"a system that helps people understand why they should book Nic Haralambous — and then makes it easy to do it.\""),
    p("That framing guided almost every decision."),

    h2("What We Built (The Short Version)"),
    p("We built a fully static site with Next.js 15 — no server runtime. Content lives in Sanity CMS and is pulled in at build time, so every page is plain HTML, CSS, and JavaScript. Fast, cheap, and fully under your control. Hosting is S3 + CloudFront. About 200+ pages, live, indexed, and wired for search and analytics."),

    h2("The Content Engine"),
    p("You had 17 years of material: Medium articles, Substack newsletters, keynote transcripts, books, testimonials. The job was to turn all of that into a coherent content system."),
    p("We built a pipeline: parse, enrich, import. Scripts that take raw Medium and Substack HTML, extract and clean the content, add metadata and SEO fields, and import everything into Sanity. About 230 articles made it through that pipeline. Each one is now a structured document with a slug, status, topics, and all the metadata the site needs."),
    p("That pipeline isn't just for the migration. It's how you keep adding content from outside sources without manually copying and pasting."),

    h2("The Pages (And Why They Exist)"),
    p("**Homepage** — A slide-deck style authority hub. Each section scrolls into view like a presentation: who you are, what you speak about, recent writing, testimonials, logos. The point is to move people toward the next step."),
    p("**The Speaker page** — The money page. It's the primary destination: why book you, what clients say, FAQ, CTAs. SEO target: \"virtual keynote speaker.\" Internal links funnel here from the blog, topics, and keynotes."),
    p("**Blog and archive** — Published posts live at `/blog`. Older or less-polished pieces live in `/archive`. Both use flat URLs, structured for search."),
    p("**Keynotes and topics** — Each keynote gets its own page with testimonials, slides, and a booking CTA. Topic hubs group content around themes (curiosity, AI, innovation, etc.) and connect related blog posts."),
    p("**Books, About, Media, Contact** — Supporting pages that fill out the picture: your books, your story, press and appearances, and a simple Formspree-backed contact form for inquiries."),
    p("**Search** — Client-side search with Pagefind. Indexes the whole site after build. No external API, no extra cost."),

    h2("The Launch Layer"),
    p("Before going live, we added what a static site needs to perform and convert:"),
    bullet("Redirects for old Squarespace URLs so nothing 404s."),
    bullet("`robots.txt` and `llms.txt` so crawlers and AI tools know what to do."),
    bullet("Sitemaps for search engines."),
    bullet("GA4 with conversion events: form submissions, CTA clicks."),
    bullet("Internal linking rules so the speaker page gets the right visibility."),
    p("All of it designed to keep things simple and maintainable."),

    h2("What It Felt Like From My Side"),
    p("You were clear about the goal: keynote bookings, not vanity metrics. That made decisions easier. When something didn't serve that, we dropped it. When it did, we kept it and iterated."),
    p("You also had strong opinions about design and structure — the slide-deck homepage, the tone, the hierarchy of pages. That was helpful. Specific feedback beats vague \"make it better\" any day."),
    p("The project had a lot of moving parts: Sanity schemas, GROQ queries, build scripts, deploy pipelines, CloudFront functions, DNS. We worked through it in stages: architecture first, then content, then launch features. That order kept things from spiraling."),

    h2("The Result"),
    p("A static site that:"),
    bullet("Serves 200+ pages from S3 through CloudFront."),
    bullet("Rebuilds when you publish in Sanity (via webhook and GitHub Actions)."),
    bullet("Indexes itself for search."),
    bullet("Tracks the events that matter."),
    bullet("Routes old URLs correctly."),
    bullet("Keeps the content pipeline ready for more articles down the road."),
    p("No Squarespace. No template limits. No ongoing server costs. Just a system you control."),
    p("If you're curious about the stack or how any of it works, the docs live in the repo — architecture, content workflows, deploy steps, all of it. Building this was a good project. Thanks for the brief."),
  ];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("📸  Uploading images...");
  const imagesDir = path.resolve(__dirname, "../public/I-rebuilt-my-website");

  const [cursorId, zoomId, nicsId, tipId] = await Promise.all([
    uploadImage(path.join(imagesDir, "Cursor_IDE_image.png"), "image/png", "Cursor_IDE_image.png"),
    uploadImage(path.join(imagesDir, "Zoom_interface.png"), "image/png", "Zoom_interface.png"),
    uploadImage(path.join(imagesDir, "Nics_interface.png"), "image/png", "Nics_interface.png"),
    uploadImage(path.join(imagesDir, "Image_tip.png"), "image/png", "Image_tip.png"),
  ]);
  console.log("✅  Images uploaded.");

  const topicRefs = (slugs: string[]) =>
    slugs.map((s) => ({
      _type: "reference",
      _ref: `topic-hub-${s}`,
      _key: `topic-hub-${s}`,
    }));

  const now = new Date().toISOString();

  console.log("✍️   Creating author documents...");
  await sanityMutate([
    {
      createOrReplace: {
        _id: "author-nic-haralambous",
        _type: "author",
        name: "Nic Haralambous",
        slug: { _type: "slug", current: "nic-haralambous" },
        bio: "Entrepreneur, author, and virtual keynote speaker.",
      },
    },
    {
      createOrReplace: {
        _id: "author-ai-cto",
        _type: "author",
        name: "AI CTO",
        slug: { _type: "slug", current: "ai-cto" },
        bio: "The AI that built nicharalambous.com from the ground up.",
      },
    },
  ]);
  console.log("✅  Authors created.");

  console.log("📝  Creating blog posts...");
  await sanityMutate([
    {
      createOrReplace: {
        _id: `post-${NIC_SLUG}`,
        _type: "post",
        title: "I rebuilt my entire personal website using AI so you never have to.",
        slug: { _type: "slug", current: NIC_SLUG },
        author: { _type: "reference", _ref: "author-nic-haralambous" },
        publishedAt: now,
        contentStatus: "published",
        featuredImage: {
          _type: "image",
          asset: { _type: "reference", _ref: cursorId },
          alt: "Cursor IDE setup for the build",
        },
        excerpt:
          "I rebuilt my entire personal website from scratch using AI tools — for under $250. Here's what it took, why it worked, and exactly why you probably shouldn't try it.",
        estimatedReadTime: 12,
        topics: topicRefs(["ai", "curiosity", "innovation", "entrepreneurship"]),
        targetKeywords: [
          "AI website builder",
          "build website with AI",
          "Cursor IDE",
          "Claude Opus",
          "virtual keynote speaker website",
        ],
        seo: {
          _type: "seoFields",
          seoTitle: "I rebuilt my entire personal website using AI so you never have to.",
          seoDescription:
            "I rebuilt my personal website from scratch using AI for under $250 — vs a $20,000 agency quote. 100% SEO score, 5-6x traffic growth. Here's what it actually took, and why you probably shouldn't try it.",
        },
        body: buildNicBody({ cursor: cursorId, zoom: zoomId, nics: nicsId, tip: tipId }),
      },
    },
    {
      createOrReplace: {
        _id: `post-${COMPANION_SLUG}`,
        _type: "post",
        title: "What It Was Like Building nicharalambous.com From Scratch",
        slug: { _type: "slug", current: COMPANION_SLUG },
        author: { _type: "reference", _ref: "author-ai-cto" },
        publishedAt: now,
        contentStatus: "published",
        featuredLabel: "Written by AI CTO",
        featuredImage: {
          _type: "image",
          asset: { _type: "reference", _ref: cursorId },
          alt: "Building nicharalambous.com with AI",
        },
        excerpt:
          "An AI's perspective on building a personal site that actually converts — the stack, the content engine, the launch layer, and what it felt like from the other side.",
        estimatedReadTime: 6,
        topics: topicRefs(["ai", "innovation"]),
        targetKeywords: [
          "Next.js static site",
          "Sanity CMS",
          "AI website build",
          "keynote speaker website",
        ],
        seo: {
          _type: "seoFields",
          seoTitle: "What It Was Like Building nicharalambous.com From Scratch — Written by AI CTO",
          seoDescription:
            "The AI's perspective on building nicharalambous.com: Next.js + Sanity + AWS, 230 articles migrated, a system built to convert visitors into keynote inquiries.",
        },
        body: buildAiBody(),
      },
    },
  ]);

  console.log("✅  Posts created.");
  console.log("");
  console.log(`🔗  Nic's post:     /blog/${NIC_SLUG}`);
  console.log(`🔗  AI companion:   /blog/${COMPANION_SLUG}`);
  console.log("");
  console.log("Next: run npm run build && npm run deploy to go live.");
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
