/**
 * Substack HTML parser — Block 7a.
 *
 * Reads all HTML files from Legacy Content/Substack Articles/,
 * parses body content, applies Level 1 HTML cleanup, and attempts
 * to extract publish dates from companion CSV files.
 *
 * Filename pattern: {numericId}.{slug-title}.html
 * Companion CSVs:   {numericId}.delivers.csv (has delivery timestamps)
 *
 * Usage: npx tsx scripts/parse-substack.ts
 */

import * as fs from "fs";
import * as path from "path";
import {
  cleanSubstackHtml,
  countWords,
  hasImages,
} from "./lib/html-cleaner";
import type { ParsedArticle } from "./lib/types";

const ARTICLES_DIR = path.resolve(
  __dirname,
  "../Legacy Content/Substack Articles"
);
const OUTPUT_DIR = path.resolve(__dirname, "output/substack");

/**
 * Derive slug and numeric ID from a Substack filename.
 *
 * Example: "186958009.i-deleted-social-media-because-i.html"
 *   → { numericId: "186958009", slug: "i-deleted-social-media-because-i" }
 *
 * Edge case: "176032210.960.html" → numeric-only slug, treat as invalid.
 */
function parseSubstackFilename(filename: string): {
  numericId: string;
  slug: string;
} {
  const base = filename.replace(/\.html$/, "");
  const dotIndex = base.indexOf(".");
  if (dotIndex === -1) {
    return { numericId: base, slug: base };
  }
  const numericId = base.substring(0, dotIndex);
  const slug = base.substring(dotIndex + 1);
  return { numericId, slug };
}

/**
 * Derive title from a slug by converting hyphens to spaces and title-casing.
 */
function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Try to extract the earliest delivery timestamp from a companion CSV.
 *
 * Companion files follow the pattern: {numericId}.delivers.csv
 * CSV columns: post_id,timestamp,email,post_type,post_audience,active_subscription
 *
 * Returns the earliest timestamp as ISO string, or null if no CSV exists.
 */
function extractDateFromCsv(numericId: string): string | null {
  const csvPath = path.join(ARTICLES_DIR, `${numericId}.delivers.csv`);

  if (!fs.existsSync(csvPath)) {
    return null;
  }

  try {
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const lines = csvContent.split("\n").filter((l) => l.trim());

    if (lines.length < 2) return null; // Only header, no data

    // Parse first data row to get the timestamp (column index 1)
    const firstDataRow = lines[1].split(",");
    if (firstDataRow.length < 2) return null;

    const timestamp = firstDataRow[1].trim();

    // Validate it looks like an ISO date
    if (timestamp && !isNaN(Date.parse(timestamp))) {
      return new Date(timestamp).toISOString();
    }
  } catch (err) {
    console.warn(`  ⚠ Could not read CSV for ${numericId}: ${err}`);
  }

  return null;
}

/** Parse a single Substack HTML file into a ParsedArticle. */
function parseSubstackFile(
  filePath: string,
  filename: string
): ParsedArticle | null {
  const rawHtml = fs.readFileSync(filePath, "utf-8");

  // Skip empty or near-empty articles
  const textContent = rawHtml.replace(/<[^>]*>/g, "").trim();
  if (textContent.length < 20) {
    console.warn(`  ⚠ Skipping empty article: ${filename}`);
    return null;
  }

  const { numericId, slug } = parseSubstackFilename(filename);

  // Skip articles with purely numeric slugs (corrupt/test exports)
  if (/^\d+$/.test(slug)) {
    console.warn(`  ⚠ Skipping numeric-only slug: ${filename}`);
    return null;
  }

  // Clean the body HTML (Level 1)
  const cleanedHtml = cleanSubstackHtml(rawHtml);

  if (!cleanedHtml || cleanedHtml.trim().length < 20) {
    console.warn(`  ⚠ Skipping: cleaned HTML too short for ${filename}`);
    return null;
  }

  const title = titleFromSlug(slug);
  const publishedAt = extractDateFromCsv(numericId);
  const words = countWords(cleanedHtml);
  const images = hasImages(cleanedHtml);

  // Construct original Substack URL
  const originalUrl = `https://nicharry.substack.com/p/${slug}`;

  return {
    id: `substack-${slug}`,
    title,
    slug,
    publishedAt,
    source: "substack",
    originalUrl,
    cleanedHtml,
    wordCount: words,
    hasImages: images,
    contentStatus: "published",
    sourceFile: filename,
  };
}

/** Main entry point. */
function main(): void {
  console.log("📖 Parsing Substack articles...\n");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".html"))
    .sort();

  const results: ParsedArticle[] = [];
  let parsed = 0;
  let skipped = 0;
  let withDates = 0;
  let withoutDates = 0;

  for (const filename of files) {
    const filePath = path.join(ARTICLES_DIR, filename);
    const article = parseSubstackFile(filePath, filename);

    if (!article) {
      skipped++;
      continue;
    }

    results.push(article);
    parsed++;

    if (article.publishedAt) {
      withDates++;
    } else {
      withoutDates++;
    }

    // Write individual JSON file
    const outputPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  }

  console.log(`\n✅ Substack parsing complete:`);
  console.log(`   Parsed:       ${parsed}`);
  console.log(`   Skipped:      ${skipped}`);
  console.log(`   With dates:   ${withDates}`);
  console.log(`   Without dates: ${withoutDates}`);
  console.log(`   Total:        ${results.length} articles → ${OUTPUT_DIR}/`);

  // Write combined summary
  const summaryPath = path.join(OUTPUT_DIR, "_summary.json");
  const summary = results.map(({ cleanedHtml, ...rest }) => rest);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`   Summary:      ${summaryPath}`);
}

main();
