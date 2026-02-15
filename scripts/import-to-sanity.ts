/**
 * Sanity import script — Block 7b/7c.
 *
 * Reads enriched article JSON from scripts/output/enriched/ and creates
 * post documents in Sanity via the HTTP Mutations API. Resolves topic hub
 * and keynote references by querying Sanity for existing documents.
 *
 * Environment:
 *   SANITY_WRITE_TOKEN — required, Editor role token from sanity.io/manage
 *   NEXT_PUBLIC_SANITY_PROJECT_ID — from .env.local (default: lsivhm7f)
 *   NEXT_PUBLIC_SANITY_DATASET — defaults to "production"
 *
 * Usage:
 *   npx tsx scripts/import-to-sanity.ts                          # All enriched → production
 *   npx tsx scripts/import-to-sanity.ts --dataset staging        # All enriched → staging
 *   npx tsx scripts/import-to-sanity.ts --sample 5               # First 5 only
 *   npx tsx scripts/import-to-sanity.ts --only slug1,slug2       # Specific slugs
 *   npx tsx scripts/import-to-sanity.ts --dry-run                # Preview without writing
 */

import * as fs from "fs";
import * as path from "path";
import type { EnrichedArticle } from "./lib/types";

// Load .env.local manually for Sanity credentials
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
const API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN;
const ENRICHED_DIR = path.resolve(__dirname, "output/enriched");

/** Batch size for Sanity mutations (max 100 per request). */
const BATCH_SIZE = 50;

// ─── Sanity API helpers ──────────────────────────────────────────────

/**
 * Query Sanity for documents using GROQ.
 */
async function sanityQuery<T>(
  query: string,
  dataset: string
): Promise<T> {
  const params = new URLSearchParams({ query });
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?${params}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${SANITY_WRITE_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Sanity query failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return json.result as T;
}

/**
 * Submit mutations to Sanity.
 *
 * Uses createOrReplace to safely re-run imports without duplicates.
 * Each document gets a deterministic _id based on source and slug.
 */
async function sanityMutate(
  mutations: Record<string, unknown>[],
  dataset: string
): Promise<{ transactionId: string; documentIds: string[] }> {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${dataset}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_WRITE_TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sanity mutation failed: ${response.status} ${errorText}`);
  }

  const json = await response.json();
  return {
    transactionId: json.transactionId || "",
    documentIds: (json.results || []).map((r: { id: string }) => r.id),
  };
}

// ─── Topic hub seed data ─────────────────────────────────────────────

/**
 * Default topic hub documents to create if they don't exist in Sanity.
 * These match the 7 hubs defined in the SEO strategy.
 */
const TOPIC_HUB_SEEDS: {
  slug: string;
  title: string;
  summary: string;
}[] = [
  { slug: "curiosity", title: "Curiosity", summary: "Curiosity is the engine of growth — the habit of asking better questions leads to better answers, better products, and a more interesting life." },
  { slug: "innovation", title: "Innovation", summary: "Innovation isn't invention — it's the disciplined practice of solving real problems in new ways, then shipping before it's perfect." },
  { slug: "entrepreneurship", title: "Entrepreneurship", summary: "Entrepreneurship is choosing to build something from nothing, accepting the uncertainty, and learning more from what fails than from what succeeds." },
  { slug: "focus", title: "Focus", summary: "Focus is the most scarce resource in a world engineered to distract you — reclaiming it is an act of rebellion and the key to doing meaningful work." },
  { slug: "ai", title: "AI", summary: "AI is reshaping how we build, create, and think — the question isn't whether to use it, but how to stay human while you do." },
  { slug: "agency", title: "Agency", summary: "Agency is the belief that you can shape your own outcomes — that you happen to life, not the other way around." },
  { slug: "failure", title: "Failure", summary: "Failure is data, not destiny — every setback carries information that success never could, if you're willing to look at it honestly." },
];

// ─── Reference resolution ────────────────────────────────────────────

interface SanityRef {
  _type: "reference";
  _ref: string;
}

/**
 * Fetch topic hub documents from Sanity and build a slug → _id map.
 */
async function fetchTopicHubMap(
  dataset: string
): Promise<Map<string, string>> {
  const hubs = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "topicHub"]{ _id, "slug": slug.current }`,
    dataset
  );

  const map = new Map<string, string>();
  for (const hub of hubs) {
    if (hub.slug) map.set(hub.slug, hub._id);
  }

  console.log(
    `  Topic hubs found: ${map.size} (${[...map.keys()].join(", ")})`
  );
  return map;
}

/**
 * Fetch keynote documents from Sanity and build a slug → _id map.
 */
async function fetchKeynoteMap(
  dataset: string
): Promise<Map<string, string>> {
  const keynotes = await sanityQuery<{ _id: string; slug: string }[]>(
    `*[_type == "keynote"]{ _id, "slug": slug.current }`,
    dataset
  );

  const map = new Map<string, string>();
  for (const keynote of keynotes) {
    if (keynote.slug) map.set(keynote.slug, keynote._id);
  }

  console.log(
    `  Keynotes found: ${map.size} (${[...map.keys()].join(", ")})`
  );
  return map;
}

// ─── Document building ───────────────────────────────────────────────

/**
 * Generate a deterministic Sanity document ID from source and slug.
 *
 * Using a stable ID means we can re-run the import without creating
 * duplicates — createOrReplace will overwrite the existing document.
 */
function generateDocumentId(article: EnrichedArticle): string {
  return `imported-${article.source}-${article.slug}`;
}

/**
 * Build a Sanity post document from an enriched article.
 *
 * Maps all enrichment fields to the post schema, resolving topic hub
 * and keynote references via the provided lookup maps.
 */
function buildSanityDocument(
  article: EnrichedArticle,
  topicMap: Map<string, string>,
  keynoteMap: Map<string, string>
): Record<string, unknown> {
  const { enrichment } = article;

  // Resolve topic references
  const topicRefs: SanityRef[] = enrichment.topics
    .map((slug) => topicMap.get(slug))
    .filter((id): id is string => !!id)
    .map((id) => ({
      _type: "reference" as const,
      _ref: id,
      _key: id, // Required for array items in Sanity
    }));

  // Resolve keynote reference
  const keynoteId = keynoteMap.get(enrichment.relatedKeynote);
  const relatedKeynote: SanityRef | undefined = keynoteId
    ? { _type: "reference", _ref: keynoteId }
    : undefined;

  // Build FAQ array with _key for Sanity
  const faq = enrichment.faq.map((item, i) => ({
    _type: "object",
    _key: `faq-${i}`,
    question: item.question,
    answer: item.answer,
  }));

  // Build target keywords array
  const targetKeywords = enrichment.targetKeywords.map((kw, i) => kw);

  return {
    _id: generateDocumentId(article),
    _type: "post",
    title: article.title,
    slug: { _type: "slug", current: article.slug },
    publishedAt: article.publishedAt || undefined,
    excerpt: enrichment.excerpt,
    rawHtmlBody: article.cleanedHtml,
    estimatedReadTime: enrichment.estimatedReadTime,
    contentStatus: article.contentStatus,
    originalUrl: article.originalUrl || undefined,
    topics: topicRefs.length > 0 ? topicRefs : undefined,
    relatedKeynote: relatedKeynote || undefined,
    faq: faq.length > 0 ? faq : undefined,
    targetKeywords:
      targetKeywords.length > 0 ? targetKeywords : undefined,
    seo: {
      _type: "seoFields",
      seoTitle: enrichment.seoTitle,
      seoDescription: enrichment.seoDescription,
    },
  };
}

// ─── CLI parsing ─────────────────────────────────────────────────────

interface CliArgs {
  dataset: string;
  sample?: number;
  only?: string[];
  dryRun: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: CliArgs = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dataset" && args[i + 1]) {
      result.dataset = args[i + 1];
      i++;
    } else if (args[i] === "--sample" && args[i + 1]) {
      result.sample = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--only" && args[i + 1]) {
      result.only = args[i + 1].split(",").map((s) => s.trim());
      i++;
    } else if (args[i] === "--dry-run") {
      result.dryRun = true;
    }
  }

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("📦 Sanity Import — Block 7b/7c\n");

  const cliArgs = parseArgs();

  if (!SANITY_WRITE_TOKEN) {
    console.error(
      "❌ SANITY_WRITE_TOKEN not set. Add to .env.local or export as env var.\n" +
      "   Create a token at: https://www.sanity.io/manage → project lsivhm7f → API → Tokens"
    );
    process.exit(1);
  }

  console.log(`  Project:  ${PROJECT_ID}`);
  console.log(`  Dataset:  ${cliArgs.dataset}`);
  console.log(`  Dry run:  ${cliArgs.dryRun}`);
  console.log();

  // Load enriched articles
  if (!fs.existsSync(ENRICHED_DIR)) {
    console.error(
      "❌ No enriched articles found. Run enrichment first:\n" +
      "   npx tsx scripts/enrich-articles.ts"
    );
    process.exit(1);
  }

  let enrichedFiles = fs
    .readdirSync(ENRICHED_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  // Apply filters
  if (cliArgs.only) {
    const onlySet = new Set(cliArgs.only);
    enrichedFiles = enrichedFiles.filter((f) =>
      onlySet.has(f.replace(".json", ""))
    );
  } else if (cliArgs.sample) {
    enrichedFiles = enrichedFiles.slice(0, cliArgs.sample);
  }

  const articles: EnrichedArticle[] = enrichedFiles.map((f) => {
    const content = fs.readFileSync(path.join(ENRICHED_DIR, f), "utf-8");
    return JSON.parse(content) as EnrichedArticle;
  });

  console.log(`  Articles to import: ${articles.length}`);

  // Fetch reference maps from Sanity
  console.log(`\n  Fetching reference data from Sanity (${cliArgs.dataset})...`);
  const topicMap = await fetchTopicHubMap(cliArgs.dataset);
  const keynoteMap = await fetchKeynoteMap(cliArgs.dataset);

  if (topicMap.size === 0 && !cliArgs.dryRun) {
    console.log("  ⚠ No topic hubs found — creating 7 default topic hubs...");
    const hubMutations = TOPIC_HUB_SEEDS.map((seed) => ({
      createOrReplace: {
        _id: `topic-hub-${seed.slug}`,
        _type: "topicHub",
        title: seed.title,
        slug: { _type: "slug", current: seed.slug },
        oneSentenceSummary: seed.summary,
      },
    }));
    try {
      await sanityMutate(hubMutations, cliArgs.dataset);
      // Re-fetch the map
      const newMap = await fetchTopicHubMap(cliArgs.dataset);
      for (const [k, v] of newMap) topicMap.set(k, v);
      console.log(`  ✅ Created ${topicMap.size} topic hubs`);
    } catch (err) {
      console.error("  ❌ Failed to create topic hubs:", err);
    }
  }

  if (keynoteMap.size === 0) {
    console.warn(
      "  ⚠ No keynotes found in Sanity. Keynote references will be empty."
    );
  }

  // Build Sanity documents
  console.log("\n  Building documents...");
  const documents = articles.map((article) =>
    buildSanityDocument(article, topicMap, keynoteMap)
  );

  // Dry run: show first document as preview
  if (cliArgs.dryRun) {
    console.log("\n  🔍 DRY RUN — Preview of first document:");
    console.log(JSON.stringify(documents[0], null, 2));
    console.log(`\n  Would import ${documents.length} documents to '${cliArgs.dataset}'. Exiting.`);
    return;
  }

  // Import in batches
  console.log(`\n  Importing ${documents.length} documents in batches of ${BATCH_SIZE}...`);
  let imported = 0;
  let failed = 0;

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(documents.length / BATCH_SIZE);

    process.stdout.write(
      `  Batch ${batchNum}/${totalBatches} (${batch.length} docs)...`
    );

    try {
      const mutations = batch.map((doc) => ({ createOrReplace: doc }));
      const result = await sanityMutate(mutations, cliArgs.dataset);

      imported += batch.length;
      console.log(` ✅ tx: ${result.transactionId.substring(0, 12)}...`);
    } catch (err) {
      failed += batch.length;
      console.log(` ❌ ${err}`);
    }
  }

  console.log(`\n✅ Import complete:`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Failed:   ${failed}`);
  console.log(`   Dataset:  ${cliArgs.dataset}`);
  console.log(`   IDs:      imported-{source}-{slug}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
