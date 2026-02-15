/**
 * Medium HTML parser — Block 7a.
 *
 * Reads all HTML files from Legacy Content/Medium Articles/,
 * parses metadata + body, applies Level 1 HTML cleanup,
 * and writes structured JSON to scripts/output/medium/.
 *
 * Filename patterns:
 *   Published: YYYY-MM-DD_Title-Slug-hexid.html
 *   Drafts:    draft_Title-Slug-hexid.html
 *
 * Usage: npx tsx scripts/parse-medium.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import { cleanMediumHtml, countWords, hasImages } from "./lib/html-cleaner";
import type { ParsedArticle } from "./lib/types";

const ARTICLES_DIR = path.resolve(
  __dirname,
  "../Legacy Content/Medium Articles"
);
const OUTPUT_DIR = path.resolve(__dirname, "output/medium");

/** Slugify a title string for URL use. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "") // Remove smart quotes
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces/hyphens)
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Trim leading/trailing hyphens
}

/**
 * Extract metadata from a Medium HTML export file.
 *
 * Medium exports use Microformats:
 * - Title: <h1 class="p-name">
 * - Date: <time class="dt-published" datetime="...">
 * - Canonical URL: <a class="p-canonical" href="...">
 */
function extractMediumMetadata(
  $: cheerio.CheerioAPI,
  filename: string
): {
  title: string;
  publishedAt: string | null;
  originalUrl: string | null;
  isDraft: boolean;
} {
  // Title from <h1 class="p-name"> or <title>
  let title =
    $("h1.p-name").text().trim() || $("title").text().trim() || "Untitled";

  // Date from <time class="dt-published">
  const timeEl = $("time.dt-published");
  let publishedAt: string | null = null;
  if (timeEl.length) {
    publishedAt = timeEl.attr("datetime") || null;
  }

  // Fallback: extract date from filename (YYYY-MM-DD_...)
  if (!publishedAt) {
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})_/);
    if (dateMatch) {
      publishedAt = new Date(dateMatch[1]).toISOString();
    }
  }

  // Canonical URL from footer
  const canonicalLink = $("a.p-canonical");
  let originalUrl: string | null = null;
  if (canonicalLink.length) {
    originalUrl = canonicalLink.attr("href") || null;
  }

  // Determine if draft
  const isDraft = filename.startsWith("draft_");

  return { title, publishedAt, originalUrl, isDraft };
}

/**
 * Derive a slug from a Medium filename.
 *
 * Published: 2024-04-29_Advice-from-40-year-old-me-to-20-year-old-me-9fd530bcfe23.html
 *   → advice-from-40-year-old-me-to-20-year-old-me
 *
 * Draft: draft_THE-CURIOSITY-CATALYST-80c749fe18c5.html
 *   → the-curiosity-catalyst
 *
 * Strips the date prefix, hex ID suffix, and .html extension.
 */
function deriveSlugFromFilename(filename: string): string {
  let slug = filename.replace(/\.html$/, "");

  // Strip date prefix: YYYY-MM-DD_
  slug = slug.replace(/^\d{4}-\d{2}-\d{2}_/, "");

  // Strip draft_ prefix
  slug = slug.replace(/^draft_/, "");

  // Strip hex ID suffix (last segment after final hyphen, if it's hex)
  slug = slug.replace(/-[0-9a-f]{8,}$/, "");

  // Convert to lowercase, clean up
  return slugify(slug);
}

/** Parse a single Medium HTML file into a ParsedArticle. */
function parseMediumFile(
  filePath: string,
  filename: string
): ParsedArticle | null {
  const rawHtml = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(rawHtml);

  const { title, publishedAt, originalUrl, isDraft } = extractMediumMetadata(
    $,
    filename
  );

  // Clean the body HTML (Level 1)
  const cleanedHtml = cleanMediumHtml(rawHtml);

  // Skip if body is effectively empty
  if (!cleanedHtml || cleanedHtml.trim().length < 20) {
    console.warn(`  ⚠ Skipping empty article: ${filename}`);
    return null;
  }

  const slug = deriveSlugFromFilename(filename);
  const words = countWords(cleanedHtml);
  const images = hasImages(cleanedHtml);

  return {
    id: `medium-${slug}`,
    title,
    slug,
    publishedAt,
    source: "medium",
    originalUrl,
    cleanedHtml,
    wordCount: words,
    hasImages: images,
    contentStatus: isDraft ? "ai-draft" : "published",
    sourceFile: filename,
  };
}

/** Main entry point. */
function main(): void {
  console.log("📖 Parsing Medium articles...\n");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".html"))
    .sort();

  const results: ParsedArticle[] = [];
  const seenSlugs = new Map<string, number>(); // Track slug occurrences
  let published = 0;
  let drafts = 0;
  let skipped = 0;

  for (const filename of files) {
    const filePath = path.join(ARTICLES_DIR, filename);
    const article = parseMediumFile(filePath, filename);

    if (!article) {
      skipped++;
      continue;
    }

    // Resolve slug collisions within Medium articles
    const baseSlug = article.slug;
    const count = seenSlugs.get(baseSlug) || 0;
    seenSlugs.set(baseSlug, count + 1);

    if (count > 0) {
      // Append numeric suffix for duplicate slugs
      article.slug = `${baseSlug}-${count + 1}`;
      article.id = `medium-${article.slug}`;
      console.log(`  ℹ Slug collision: "${baseSlug}" → "${article.slug}" (${filename})`);
    }

    results.push(article);

    // Write individual JSON file
    const outputPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));

    if (article.contentStatus === "published") {
      published++;
    } else {
      drafts++;
    }

    // Progress indicator
    if ((published + drafts + skipped) % 20 === 0) {
      console.log(`  Processed ${published + drafts + skipped}/${files.length} files...`);
    }
  }

  console.log(`\n✅ Medium parsing complete:`);
  console.log(`   Published: ${published}`);
  console.log(`   Drafts:    ${drafts}`);
  console.log(`   Skipped:   ${skipped}`);
  console.log(`   Total:     ${results.length} articles → ${OUTPUT_DIR}/`);

  // Write combined summary
  const summaryPath = path.join(OUTPUT_DIR, "_summary.json");
  const summary = results.map(({ cleanedHtml, ...rest }) => rest);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`   Summary:   ${summaryPath}`);
}

main();
