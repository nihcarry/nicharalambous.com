/**
 * Flag draft-origin posts that are currently published on the blog.
 *
 * Medium: articles from files prefixed "draft_" were imported as ai-draft.
 * Substack: articles with no companion {id}.delivers.csv were never sent to
 * subscribers (likely drafts) but were still imported as "published".
 *
 * Usage:
 *   npx tsx scripts/flag-draft-posts-live.ts
 *   npx tsx scripts/flag-draft-posts-live.ts --report
 */

import * as fs from "fs";
import * as path from "path";
import type { EnrichedArticle } from "./lib/types";

// Load .env.local for Sanity credentials
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
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN;
const ENRICHED_DIR = path.resolve(__dirname, "output/enriched");
const SUBSTACK_LEGACY_DIR = path.resolve(__dirname, "../Legacy Content/Substack Articles");

async function sanityQuery<T>(query: string, dataset: string): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_TOKEN}` },
  });
  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${await response.text()}`);
  }
  const json = await response.json();
  return json.result as T;
}

interface PublishedPost {
  _id: string;
  slug: string;
  title: string;
}

/** Substack: slugs that have no delivers.csv (never sent to subscribers = likely draft). */
function getSubstackNeverDeliveredSlugs(): Map<string, string> {
  const slugToFile = new Map<string, string>();
  if (!fs.existsSync(SUBSTACK_LEGACY_DIR)) return slugToFile;
  const htmlFiles = fs.readdirSync(SUBSTACK_LEGACY_DIR).filter((f) => f.endsWith(".html"));
  for (const filename of htmlFiles) {
    const base = filename.replace(/\.html$/, "");
    const dotIdx = base.indexOf(".");
    if (dotIdx === -1) continue;
    const numericId = base.substring(0, dotIdx);
    const slug = base.substring(dotIdx + 1);
    if (/^\d+$/.test(slug)) continue; // skip numeric-only slug
    const csvPath = path.join(SUBSTACK_LEGACY_DIR, `${numericId}.delivers.csv`);
    if (!fs.existsSync(csvPath)) {
      slugToFile.set(slug, filename);
    }
  }
  return slugToFile;
}

async function main(): Promise<void> {
  const dataset = process.argv.includes("--dataset") && process.argv[process.argv.indexOf("--dataset") + 1]
    ? process.argv[process.argv.indexOf("--dataset") + 1]
    : process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  console.log("🔍 Flag draft-origin posts that are live on the blog\n");

  if (!SANITY_TOKEN) {
    console.error("❌ SANITY_WRITE_TOKEN or SANITY_READ_TOKEN required in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(ENRICHED_DIR)) {
    console.error("❌ No enriched articles at scripts/output/enriched/. Run parse + enrich first.");
    process.exit(1);
  }

  // 1) Medium: draft slugs (contentStatus ai-draft in enriched)
  const draftSlugToMeta = new Map<string, { title: string; sourceFile: string }>();
  const files = fs.readdirSync(ENRICHED_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  for (const f of files) {
    const content = fs.readFileSync(path.join(ENRICHED_DIR, f), "utf-8");
    const article = JSON.parse(content) as EnrichedArticle;
    if (article.source === "medium" && article.contentStatus === "ai-draft") {
      draftSlugToMeta.set(article.slug, { title: article.title, sourceFile: article.sourceFile });
    }
  }
  const draftSlugs = new Set(draftSlugToMeta.keys());

  // 2) Substack: slugs with no delivers.csv (never sent to subscribers)
  const substackNeverDelivered = getSubstackNeverDeliveredSlugs();
  const substackSlugToMeta = new Map<string, { title: string; sourceFile: string }>();
  for (const f of files) {
    const content = fs.readFileSync(path.join(ENRICHED_DIR, f), "utf-8");
    const article = JSON.parse(content) as EnrichedArticle;
    if (article.source === "substack" && substackNeverDelivered.has(article.slug)) {
      substackSlugToMeta.set(article.slug, { title: article.title, sourceFile: article.sourceFile });
    }
  }

  console.log(`  Medium drafts (ai-draft):     ${draftSlugs.size}`);
  console.log(`  Substack (no delivers.csv):   ${substackSlugToMeta.size} likely never published.\n`);

  const query = `*[_type == "post" && contentStatus == "published"]{ _id, "slug": slug.current, title }`;
  const published = await sanityQuery<PublishedPost[]>(query, dataset);

  const wronglyLiveMedium: { _id: string; slug: string; title: string; sourceFile: string }[] = [];
  const wronglyLiveSubstack: { _id: string; slug: string; title: string; sourceFile: string }[] = [];
  for (const post of published) {
    const slug = post.slug;
    if (!slug) continue;
    if (post._id.startsWith("imported-medium-") && draftSlugs.has(slug)) {
      wronglyLiveMedium.push({
        _id: post._id,
        slug,
        title: post.title,
        sourceFile: draftSlugToMeta.get(slug)!.sourceFile,
      });
    } else if (post._id.startsWith("imported-substack-") && substackSlugToMeta.has(slug)) {
      wronglyLiveSubstack.push({
        _id: post._id,
        slug,
        title: post.title,
        sourceFile: substackSlugToMeta.get(slug)!.sourceFile,
      });
    }
  }

  const totalWrong = wronglyLiveMedium.length + wronglyLiveSubstack.length;
  if (totalWrong === 0) {
    console.log("✅ No draft-origin posts are currently published on the blog.");
    console.log("   Medium drafts and Substack never-delivered are correctly not live.\n");
    return;
  }

  if (wronglyLiveSubstack.length > 0) {
    console.log(`⚠️  Substack (never delivered to subscribers) — ${wronglyLiveSubstack.length} live on /blog:\n`);
    for (const p of wronglyLiveSubstack) {
      console.log(`   • ${p.title}`);
      console.log(`     Slug: ${p.slug}  →  /blog/${p.slug}`);
      console.log(`     Sanity _id: ${p._id}`);
      console.log(`     Source: ${p.sourceFile} (no delivers.csv)\n`);
    }
  }
  if (wronglyLiveMedium.length > 0) {
    console.log(`⚠️  Medium draft-origin — ${wronglyLiveMedium.length} live on /blog:\n`);
    for (const p of wronglyLiveMedium) {
      console.log(`   • ${p.title}`);
      console.log(`     Slug: ${p.slug}  →  /blog/${p.slug}`);
      console.log(`     Sanity _id: ${p._id}\n`);
    }
  }
  console.log("   To fix: In Sanity Studio, set Content Status to \"Archived\" or \"AI Draft\" for these posts.");
  console.log("   They will then appear only at /archive/{slug}, not on /blog.\n");
}

function writeReport(
  mediumDraftList: { slug: string; title: string; sourceFile: string }[],
  substackNeverDeliveredList: { slug: string; title: string; sourceFile: string }[],
  wronglyLiveMedium: { _id: string; slug: string; title: string; sourceFile: string }[],
  wronglyLiveSubstack: { _id: string; slug: string; title: string; sourceFile: string }[]
): void {
  const reportPath = path.resolve(__dirname, "../draft-articles-report.md");
  const lines: string[] = [
    "# Draft articles audit",
    "",
    "Generated by `npx tsx scripts/flag-draft-posts-live.ts --report`.",
    "",
    "## Summary",
    "",
    wronglyLiveMedium.length === 0
      ? "- **Medium:** No draft-origin posts are published on the blog; all 52 `draft_*.html` are correctly ai-draft."
      : `- **Medium:** ${wronglyLiveMedium.length} draft-origin article(s) are live on /blog — set to AI Draft or Archived in Sanity.`,
    "",
    wronglyLiveSubstack.length === 0
      ? "- **Substack:** No \"never delivered\" posts are published; all live Substack posts have a `delivers.csv` (were sent to subscribers)."
      : `- **Substack:** ${wronglyLiveSubstack.length} post(s) that were **never delivered** to subscribers (no \`delivers.csv\`) are currently live on /blog — consider setting to AI Draft or Archived.`,
    "",
    "---",
    "",
    "## Medium draft-origin (52 articles)",
    "",
    "From `draft_*.html`; intended only at `/archive/{slug}`.",
    "",
    "| Slug | Title | Source file |",
    "|------|-------|-------------|",
    ...mediumDraftList.map((d) => `| ${d.slug} | ${d.title.replace(/\|/g, "\\|")} | \`${d.sourceFile}\` |`),
    "",
    "---",
    "",
    "## Substack never delivered (no delivers.csv)",
    "",
    "These Substack exports have no companion `{id}.delivers.csv`, so they were likely never sent to subscribers. They were still imported as \"published\" and may be live.",
    "",
    "| Slug | Title | Source file |",
    "|------|-------|-------------|",
    ...substackNeverDeliveredList.map((d) => `| ${d.slug} | ${d.title.replace(/\|/g, "\\|")} | \`${d.sourceFile}\` |`),
    "",
  ];
  if (wronglyLiveMedium.length > 0 || wronglyLiveSubstack.length > 0) {
    lines.push("## Wrongly published (draft / never delivered but live on /blog)", "");
    lines.push("| Source | Slug | Title | Sanity _id |");
    lines.push("|--------|------|-------|-------------|");
    for (const p of wronglyLiveSubstack) {
      lines.push(`| Substack | ${p.slug} | ${p.title.replace(/\|/g, "\\|")} | \`${p._id}\` |`);
    }
    for (const p of wronglyLiveMedium) {
      lines.push(`| Medium | ${p.slug} | ${p.title.replace(/\|/g, "\\|")} | \`${p._id}\` |`);
    }
    lines.push("");
  }
  fs.writeFileSync(reportPath, lines.join("\n"), "utf-8");
  console.log(`  Report written: ${reportPath}\n`);
}

async function runWithReport(): Promise<void> {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!SANITY_TOKEN || !fs.existsSync(ENRICHED_DIR)) {
    console.error("❌ Token and enriched output required. Run without --report first to confirm.");
    process.exit(1);
  }
  const draftSlugToMeta = new Map<string, { title: string; sourceFile: string }>();
  const substackNeverDelivered = getSubstackNeverDeliveredSlugs();
  const substackSlugToMeta = new Map<string, { title: string; sourceFile: string }>();
  const files = fs.readdirSync(ENRICHED_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  for (const f of files) {
    const content = fs.readFileSync(path.join(ENRICHED_DIR, f), "utf-8");
    const article = JSON.parse(content) as EnrichedArticle;
    if (article.source === "medium" && article.contentStatus === "ai-draft") {
      draftSlugToMeta.set(article.slug, { title: article.title, sourceFile: article.sourceFile });
    }
    if (article.source === "substack" && substackNeverDelivered.has(article.slug)) {
      substackSlugToMeta.set(article.slug, { title: article.title, sourceFile: article.sourceFile });
    }
  }
  const mediumDraftList = [...draftSlugToMeta.entries()].map(([slug, meta]) => ({ slug, ...meta }));
  const substackList = [...substackSlugToMeta.entries()].map(([slug, meta]) => ({ slug, ...meta }));
  const query = `*[_type == "post" && contentStatus == "published"]{ _id, "slug": slug.current, title }`;
  const published = await sanityQuery<PublishedPost[]>(query, dataset);
  const wronglyLiveMedium: { _id: string; slug: string; title: string; sourceFile: string }[] = [];
  const wronglyLiveSubstack: { _id: string; slug: string; title: string; sourceFile: string }[] = [];
  for (const post of published) {
    if (!post.slug) continue;
    if (post._id.startsWith("imported-medium-") && draftSlugToMeta.has(post.slug)) {
      wronglyLiveMedium.push({
        _id: post._id,
        slug: post.slug,
        title: post.title,
        sourceFile: draftSlugToMeta.get(post.slug)!.sourceFile,
      });
    } else if (post._id.startsWith("imported-substack-") && substackSlugToMeta.has(post.slug)) {
      wronglyLiveSubstack.push({
        _id: post._id,
        slug: post.slug,
        title: post.title,
        sourceFile: substackSlugToMeta.get(post.slug)!.sourceFile,
      });
    }
  }
  writeReport(mediumDraftList, substackList, wronglyLiveMedium, wronglyLiveSubstack);
}

const withReport = process.argv.includes("--report");
if (withReport) {
  runWithReport().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
