/**
 * TL;DR generator for imported YouTube posts.
 *
 * Reads a video's transcript and writes a short, meaningful TL;DR into the
 * post's `excerpt` (and `seo.seoDescription`). This is the companion to
 * `scripts/import-youtube-video.ts`, which now leaves the excerpt empty on new
 * imports so a real TL;DR can be generated here rather than copying the first
 * few sentences of the transcript.
 *
 * Two ways to run:
 *
 *   1. Fully automatic (requires OPENAI_API_KEY):
 *        npm run tldr                 # all imported posts with an empty excerpt
 *        npm run tldr -- --force      # regenerate every imported post
 *        npm run tldr -- --ids=abc,def
 *        npm run tldr -- --dry-run
 *
 *   2. Agent-in-the-loop (no API key needed — how it's run inside Cursor):
 *        npm run tldr                 # writes transcripts needing a TL;DR to
 *                                     # /tmp/tldr-queue.json and prints a prompt.
 *        # …the agent reads the queue, writes a TL;DR per post, saves a JSON
 *        #   map { "<docId>": "<tldr>" }, then applies it:
 *        npm run tldr:apply -- /tmp/tldr-answers.json
 *
 * Environment:
 *   SANITY_WRITE_TOKEN — required (Editor token)
 *   NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET
 *   OPENAI_API_KEY — optional; enables fully-automatic generation
 *   OPENAI_MODEL   — optional; defaults to gpt-4o-mini
 */

import "./load-env";
import fs from "fs";
import { YouTubeTranscriptApi } from "youtube-transcript-api-js";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_WRITE_TOKEN =
  process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const MAX_EXCERPT = 200;
const MAX_SEO = 160;
const QUEUE_PATH = "/tmp/tldr-queue.json";

// ─── args ─────────────────────────────────────────────────────────────

interface Args {
  force: boolean;
  dryRun: boolean;
  ids: string[];
  apply?: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { force: false, dryRun: false, ids: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--apply") args.apply = argv[++i];
    else if (a.startsWith("--ids=")) {
      args.ids.push(...a.slice("--ids=".length).split(",").map((s) => s.trim()).filter(Boolean));
    } else if (a.endsWith(".json") && !args.apply) {
      // A bare .json path is treated as the apply file (npm run tldr:apply -- file.json).
      args.apply = a;
    }
  }
  return args;
}

// ─── Sanity helpers ───────────────────────────────────────────────────

async function sanityQuery<T>(query: string): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result as T;
}

async function sanityMutate(mutations: Record<string, unknown>[]): Promise<void> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Sanity mutation failed: ${res.status} ${await res.text()}`);
}

// ─── transcript ───────────────────────────────────────────────────────

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
}

async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    const api = new YouTubeTranscriptApi();
    const transcript = await api.fetch(videoId, ["en"]);
    if (!transcript?.snippets?.length) return null;
    return transcript.snippets
      .map((s: { text: string }) => decodeHtmlEntities(s.text))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  } catch (err) {
    console.log(`    Transcript fetch failed for ${videoId}: ${err}`);
    return null;
  }
}

// ─── TL;DR shaping ────────────────────────────────────────────────────

function clip(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const clipped = t.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 40 ? lastSpace : max - 1).trim()}…`;
}

function seoDescriptionFrom(excerpt: string): string {
  return clip(excerpt, MAX_SEO);
}

async function generateWithLLM(title: string, transcript: string): Promise<string> {
  const prompt = `You are writing the TL;DR that sits at the top of a blog post derived from a YouTube video. Read the transcript and write ONE punchy TL;DR of at most ${MAX_EXCERPT} characters.

Rules:
- First person, in the voice of the speaker (Nic Haralambous): direct, plain, no hype.
- Capture the actual argument/payoff of the video, not just the opening line.
- No hashtags, no emojis, no "In this video", no quotation marks around the whole thing.
- Absolute max ${MAX_EXCERPT} characters. Prefer 170–200.

Title: ${title}

Transcript:
${transcript.slice(0, 12000)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI request failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const text: string = json.choices?.[0]?.message?.content?.trim() || "";
  return clip(text.replace(/^["']|["']$/g, ""), MAX_EXCERPT);
}

// ─── post selection ───────────────────────────────────────────────────

interface Post {
  _id: string;
  title: string;
  videoId: string;
  excerpt?: string;
}

async function selectPosts(args: Args): Promise<Post[]> {
  const rows = await sanityQuery<
    { _id: string; title: string; excerpt?: string }[]
  >(
    `*[_type == "post" && _id match "imported-youtube-*"]{ _id, title, excerpt }`
  );
  return rows
    .map((r) => ({
      _id: r._id,
      title: r.title,
      excerpt: r.excerpt,
      videoId: r._id.replace(/^imported-youtube-/, ""),
    }))
    .filter((p) => {
      if (args.ids.length > 0) {
        return args.ids.includes(p.videoId) || args.ids.includes(p._id);
      }
      if (args.force) return true;
      return !p.excerpt || p.excerpt.trim().length === 0;
    });
}

async function patchTldr(id: string, excerpt: string, dryRun: boolean): Promise<void> {
  const clipped = clip(excerpt, MAX_EXCERPT);
  if (dryRun) {
    console.log(`    [dry-run] ${id} → ${clipped} (${clipped.length} chars)`);
    return;
  }
  await sanityMutate([
    {
      patch: {
        id,
        set: { excerpt: clipped, "seo.seoDescription": seoDescriptionFrom(clipped) },
      },
    },
  ]);
  console.log(`    ✅ ${id} (${clipped.length} chars)`);
}

// ─── apply mode (agent-in-the-loop) ───────────────────────────────────

async function runApply(file: string, dryRun: boolean): Promise<void> {
  if (!fs.existsSync(file)) throw new Error(`Answers file not found: ${file}`);
  const answers = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, string>;
  const entries = Object.entries(answers);
  console.log(`Applying ${entries.length} TL;DRs from ${file}…`);
  for (const [id, tldr] of entries) {
    if (!tldr || tldr.trim().length === 0) {
      console.log(`    ⚠️  Skipping ${id}: empty TL;DR`);
      continue;
    }
    await patchTldr(id, tldr, dryRun);
  }
  console.log("Done.");
}

// ─── main ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!SANITY_WRITE_TOKEN) throw new Error("SANITY_WRITE_TOKEN is required");

  const args = parseArgs(process.argv.slice(2));

  if (args.apply) {
    await runApply(args.apply, args.dryRun);
    return;
  }

  const posts = await selectPosts(args);
  if (posts.length === 0) {
    console.log("✅ No posts need a TL;DR. (Use --force to regenerate, or --ids=<videoId>.)");
    return;
  }

  console.log(`Found ${posts.length} post(s) needing a TL;DR.\n`);

  // Fetch transcripts for the selected posts.
  const withTranscripts: (Post & { transcript: string })[] = [];
  for (const p of posts) {
    console.log(`  Fetching transcript: ${p.title}`);
    const transcript = await fetchTranscript(p.videoId);
    if (!transcript) {
      console.log(`    ⚠️  No transcript — skipping ${p._id}`);
      continue;
    }
    console.log(`    Transcript: ${transcript.split(/\s+/).length} words`);
    withTranscripts.push({ ...p, transcript });
  }

  if (withTranscripts.length === 0) {
    console.log("\nNo transcripts available for the selected posts.");
    return;
  }

  // Path A — fully automatic with an LLM.
  if (OPENAI_API_KEY) {
    console.log(`\nGenerating TL;DRs with ${OPENAI_MODEL}…`);
    for (const p of withTranscripts) {
      const tldr = await generateWithLLM(p.title, p.transcript);
      await patchTldr(p._id, tldr, args.dryRun);
    }
    console.log("\nDone.");
    return;
  }

  // Path B — no API key: write a queue for the in-editor agent to answer.
  const queue = withTranscripts.map((p) => ({
    id: p._id,
    title: p.title,
    videoId: p.videoId,
    words: p.transcript.split(/\s+/).length,
    transcript: p.transcript,
  }));
  fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));

  console.log(`\nNo OPENAI_API_KEY set — wrote ${queue.length} transcript(s) to ${QUEUE_PATH}.`);
  console.log(
    [
      "",
      "Next step (agent-in-the-loop):",
      `  1. Read ${QUEUE_PATH}.`,
      "  2. For each item, write a meaningful TL;DR (≤200 chars, first person, Nic's voice).",
      "  3. Save a JSON map { \"<id>\": \"<tldr>\" } to /tmp/tldr-answers.json.",
      "  4. Run: npm run tldr:apply -- /tmp/tldr-answers.json",
      "",
      "Or set OPENAI_API_KEY (and optionally OPENAI_MODEL) to generate automatically.",
    ].join("\n")
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
