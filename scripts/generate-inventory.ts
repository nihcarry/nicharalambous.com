/**
 * Inventory generator — Block 7a.
 *
 * Reads parsed article JSON from scripts/output/medium/ and
 * scripts/output/substack/, combines them into a single inventory,
 * detects duplicate slugs (resolves with -{yyyy} suffix on older post),
 * and outputs a combined CSV.
 *
 * Usage: npx tsx scripts/generate-inventory.ts
 * Prerequisite: Run parse-medium.ts and parse-substack.ts first.
 */

import * as fs from "fs";
import * as path from "path";
import type { ParsedArticle } from "./lib/types";

const MEDIUM_DIR = path.resolve(__dirname, "output/medium");
const SUBSTACK_DIR = path.resolve(__dirname, "output/substack");
const OUTPUT_CSV = path.resolve(__dirname, "output/inventory.csv");
const OUTPUT_DUPLICATES = path.resolve(__dirname, "output/duplicate-slugs.json");

/**
 * Load all parsed article JSONs from a directory.
 * Skips _summary.json files.
 */
function loadArticles(dir: string): ParsedArticle[] {
  if (!fs.existsSync(dir)) {
    console.warn(`  ⚠ Directory not found: ${dir}`);
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => {
      const content = fs.readFileSync(path.join(dir, f), "utf-8");
      return JSON.parse(content) as ParsedArticle;
    });
}

/**
 * Detect and resolve duplicate slugs across all articles.
 *
 * Resolution strategy: the more recent post keeps the slug,
 * the older post gets -{yyyy} appended (year from publishedAt).
 * If dates can't be compared, Substack wins (more recent platform).
 */
function resolveDuplicateSlugs(
  articles: ParsedArticle[]
): { articles: ParsedArticle[]; duplicates: { slug: string; articles: string[] }[] } {
  // Group by slug
  const slugGroups = new Map<string, ParsedArticle[]>();
  for (const article of articles) {
    const group = slugGroups.get(article.slug) || [];
    group.push(article);
    slugGroups.set(article.slug, group);
  }

  const duplicates: { slug: string; articles: string[] }[] = [];
  const resolved: ParsedArticle[] = [];

  for (const [slug, group] of slugGroups.entries()) {
    if (group.length === 1) {
      resolved.push(group[0]);
      continue;
    }

    // Duplicate found — log and resolve
    duplicates.push({
      slug,
      articles: group.map((a) => `${a.source}: ${a.sourceFile}`),
    });

    // Sort by date (newest first), null dates go last
    group.sort((a, b) => {
      if (!a.publishedAt && !b.publishedAt) return 0;
      if (!a.publishedAt) return 1;
      if (!b.publishedAt) return -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Newest keeps the slug, others get -{yyyy} suffix
    resolved.push(group[0]); // Keep slug as-is

    for (let i = 1; i < group.length; i++) {
      const article = group[i];
      const year = article.publishedAt
        ? new Date(article.publishedAt).getFullYear()
        : "unknown";
      const newSlug = `${slug}-${year}`;
      article.slug = newSlug;
      article.id = `${article.source}-${newSlug}`;
      resolved.push(article);
    }
  }

  return { articles: resolved, duplicates };
}

/**
 * Escape a CSV field value.
 * Wraps in quotes if it contains commas, quotes, or newlines.
 */
function csvEscape(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Main entry point. */
function main(): void {
  console.log("📊 Generating combined inventory...\n");

  // Load articles from both sources
  const mediumArticles = loadArticles(MEDIUM_DIR);
  const substackArticles = loadArticles(SUBSTACK_DIR);

  console.log(`  Medium articles:   ${mediumArticles.length}`);
  console.log(`  Substack articles: ${substackArticles.length}`);

  const allArticles = [...mediumArticles, ...substackArticles];
  console.log(`  Total:             ${allArticles.length}\n`);

  // Resolve duplicate slugs
  const { articles, duplicates } = resolveDuplicateSlugs(allArticles);

  if (duplicates.length > 0) {
    console.log(`⚠ Found ${duplicates.length} duplicate slug(s):`);
    for (const dup of duplicates) {
      console.log(`  "${dup.slug}" → ${dup.articles.join(" | ")}`);
    }
    // Write duplicate details
    fs.writeFileSync(OUTPUT_DUPLICATES, JSON.stringify(duplicates, null, 2));
    console.log(`  Details saved to: ${OUTPUT_DUPLICATES}\n`);
  } else {
    console.log("✅ No duplicate slugs found.\n");
  }

  // Sort by date (newest first), null dates at the end
  articles.sort((a, b) => {
    if (!a.publishedAt && !b.publishedAt) return 0;
    if (!a.publishedAt) return 1;
    if (!b.publishedAt) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Generate CSV
  const header = "id,title,slug,publishedAt,source,sourceUrl,newUrl,hasImages,wordCount,contentStatus";
  const rows = articles.map((a) => {
    const newUrl =
      a.contentStatus === "published"
        ? `/blog/${a.slug}`
        : `/blog/${a.slug}`; // ai-drafts get /blog/ too, just won't be visible until published
    const sourceUrl = a.originalUrl || "";

    return [
      csvEscape(a.id),
      csvEscape(a.title),
      csvEscape(a.slug),
      a.publishedAt || "",
      a.source,
      csvEscape(sourceUrl),
      newUrl,
      a.hasImages ? "yes" : "no",
      a.wordCount.toString(),
      a.contentStatus,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  fs.writeFileSync(OUTPUT_CSV, csv);

  // Summary stats
  const published = articles.filter((a) => a.contentStatus === "published").length;
  const aiDrafts = articles.filter((a) => a.contentStatus === "ai-draft").length;
  const withImages = articles.filter((a) => a.hasImages).length;
  const withDates = articles.filter((a) => a.publishedAt).length;
  const totalWords = articles.reduce((sum, a) => sum + a.wordCount, 0);

  console.log(`✅ Inventory generated: ${OUTPUT_CSV}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total articles:   ${articles.length}`);
  console.log(`   Published:        ${published}`);
  console.log(`   AI Drafts:        ${aiDrafts}`);
  console.log(`   With images:      ${withImages}`);
  console.log(`   With dates:       ${withDates}`);
  console.log(`   Without dates:    ${articles.length - withDates}`);
  console.log(`   Total word count: ${totalWords.toLocaleString()}`);
  console.log(`   Avg word count:   ${Math.round(totalWords / articles.length)}`);
  console.log(`   Duplicates resolved: ${duplicates.length}`);
}

main();
