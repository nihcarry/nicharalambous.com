/**
 * Article enrichment script — Block 7b.
 *
 * Reads parsed article JSON from scripts/output/medium/ and
 * scripts/output/substack/, generates SEO metadata using text analysis,
 * and writes enriched JSON to scripts/output/enriched/.
 *
 * No external API required — all enrichment is done locally:
 * - excerpt: first 1-2 sentences, truncated to 200 chars
 * - seoTitle: cleaned title, max 70 chars
 * - seoDescription: first sentence + context, max 160 chars
 * - topics: keyword frequency matching against 7 topic hubs
 * - relatedKeynote: derived from primary topic
 * - targetKeywords: extracted from title + headings
 * - estimatedReadTime: word count / 225 wpm
 * - faq: extracted from headings + surrounding paragraphs
 *
 * Usage:
 *   npx tsx scripts/enrich-articles.ts              # All articles
 *   npx tsx scripts/enrich-articles.ts --sample 5   # First 5 only
 *   npx tsx scripts/enrich-articles.ts --only slug1,slug2
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import type {
  ParsedArticle,
  EnrichmentData,
  EnrichedArticle,
} from "./lib/types";

const MEDIUM_DIR = path.resolve(__dirname, "output/medium");
const SUBSTACK_DIR = path.resolve(__dirname, "output/substack");
const OUTPUT_DIR = path.resolve(__dirname, "output/enriched");

/** Average reading speed (words per minute). */
const WORDS_PER_MINUTE = 225;

// ─── Topic detection ─────────────────────────────────────────────────

/**
 * Keyword sets for each topic hub.
 * Weighted: primary keywords score 3, secondary score 1.
 */
const TOPIC_KEYWORDS: Record<string, { primary: string[]; secondary: string[] }> = {
  curiosity: {
    primary: ["curiosity", "curious", "question", "wonder", "explore", "discovery", "learn"],
    secondary: ["experiment", "interest", "investigate", "ask", "unknown", "surprise", "new idea", "open mind"],
  },
  innovation: {
    primary: ["innovation", "innovate", "disrupt", "breakthrough", "invent", "creative", "build"],
    secondary: ["technology", "product", "iterate", "prototype", "design", "ship", "launch", "create", "maker"],
  },
  entrepreneurship: {
    primary: ["entrepreneur", "startup", "business", "founder", "company", "venture"],
    secondary: ["hustle", "customer", "revenue", "profit", "market", "growth", "scale", "pivot", "investor", "funding", "bootstrapp"],
  },
  focus: {
    primary: ["focus", "distraction", "attention", "screen time", "digital", "mindful", "present"],
    secondary: ["phone", "social media", "scroll", "productivity", "deep work", "concentration", "boredom", "habit", "discipline", "addiction"],
  },
  ai: {
    primary: ["artificial intelligence", " ai ", "machine learning", "chatgpt", "llm", "generative"],
    secondary: ["algorithm", "automat", "neural", "model", "prompt", "robot", "copilot", "claude", "openai", "gpt"],
  },
  agency: {
    primary: ["agency", "autonomy", "choice", "control", "decision", "ownership", "empower"],
    secondary: ["action", "proactive", "initiative", "self-determin", "independen", "accountab", "responsib", "intention"],
  },
  failure: {
    primary: ["failure", "fail", "mistake", "wrong", "error", "setback", "loss"],
    secondary: ["resilience", "bounce back", "lesson", "recover", "overcome", "persist", "grit", "tough", "struggle", "adversity"],
  },
};

/**
 * Topic-to-keynote mapping.
 * Each topic maps to the keynote whose themes most closely align.
 */
const TOPIC_TO_KEYNOTE: Record<string, string> = {
  curiosity: "curiosity-catalyst",
  innovation: "breakthrough-product-teams",
  entrepreneurship: "breakthrough-product-teams",
  focus: "reclaiming-focus",
  ai: "reclaiming-focus",
  agency: "reclaiming-focus",
  failure: "curiosity-catalyst",
};

/**
 * Score an article's text against all topic keyword sets.
 * Returns sorted topics with scores, highest first.
 */
function detectTopics(text: string): { slug: string; score: number }[] {
  const lowerText = ` ${text.toLowerCase()} `;

  const scores = Object.entries(TOPIC_KEYWORDS).map(([slug, keywords]) => {
    let score = 0;

    for (const kw of keywords.primary) {
      const regex = new RegExp(kw, "gi");
      const matches = lowerText.match(regex);
      score += (matches?.length || 0) * 3;
    }

    for (const kw of keywords.secondary) {
      const regex = new RegExp(kw, "gi");
      const matches = lowerText.match(regex);
      score += (matches?.length || 0) * 1;
    }

    return { slug, score };
  });

  return scores.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

// ─── Text extraction helpers ─────────────────────────────────────────

/**
 * Extract plain text from HTML, preserving sentence structure.
 * Adds spacing between block elements to prevent text concatenation.
 */
function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  // Remove images, iframes
  $("img, iframe, figure, figcaption").remove();

  // Add spacing after block elements to prevent text running together
  $("p, h1, h2, h3, h4, h5, h6, li, blockquote, br").each(function () {
    $(this).append(" ");
    $(this).before(" ");
  });

  return $.root().text().replace(/\s+/g, " ").trim();
}

/**
 * Extract the first paragraph's text from HTML (skips headings).
 * Better for excerpts than raw text extraction.
 */
function firstParagraphText(html: string): string {
  const $ = cheerio.load(html);
  let text = "";
  $("p").each(function () {
    const pText = $(this).text().trim();
    if (pText.length > 30 && !text) {
      text = pText;
      return false; // break
    }
  });
  return text || htmlToText(html);
}

/**
 * Extract first N sentences from text.
 * Handles URLs (won't split on periods in domain names) and
 * strips leading heading text that bleeds into the first paragraph.
 */
function firstSentences(text: string, count: number): string {
  // Protect URLs from sentence splitting: replace periods in URLs temporarily
  const urlProtected = text.replace(
    /https?:\/\/[^\s]+/g,
    (url) => url.replace(/\./g, "⦁")
  );

  // Also protect common abbreviations
  const abbrProtected = urlProtected
    .replace(/Mr\./g, "Mr⦁")
    .replace(/Mrs\./g, "Mrs⦁")
    .replace(/Dr\./g, "Dr⦁")
    .replace(/vs\./g, "vs⦁")
    .replace(/e\.g\./g, "e⦁g⦁")
    .replace(/i\.e\./g, "i⦁e⦁");

  // Split on sentence-ending punctuation followed by space or end
  const sentences = abbrProtected.match(/[^.!?]+[.!?]+/g) || [abbrProtected];

  // Restore protected periods and join
  return sentences
    .slice(0, count)
    .join(" ")
    .replace(/⦁/g, ".")
    .trim();
}

/**
 * Extract headings and their following paragraphs from HTML.
 * Used for FAQ generation.
 */
function extractHeadingsWithContext(
  html: string
): { heading: string; context: string }[] {
  const $ = cheerio.load(html);
  const results: { heading: string; context: string }[] = [];

  $("h2, h3, h4").each(function () {
    const heading = $(this).text().trim();
    if (!heading || heading.length < 5) return;

    // Get the next paragraph(s) after this heading
    let context = "";
    let next = $(this).next();
    let collected = 0;
    while (next.length && collected < 2) {
      const tag = (next[0] as unknown as { tagName?: string }).tagName?.toLowerCase();
      if (tag === "p") {
        context += next.text().trim() + " ";
        collected++;
      } else if (["h2", "h3", "h4"].includes(tag || "")) {
        break; // Stop at next heading
      }
      next = next.next();
    }

    if (context.trim()) {
      results.push({ heading, context: context.trim() });
    }
  });

  return results;
}

/**
 * Convert a heading/statement into a question.
 */
function toQuestion(heading: string): string {
  const clean = heading.replace(/[.!?]+$/, "").trim();

  // Already a question
  if (clean.endsWith("?")) return clean;

  // Common patterns
  const lower = clean.toLowerCase();

  if (lower.startsWith("how ") || lower.startsWith("why ") || lower.startsWith("what ") || lower.startsWith("when ") || lower.startsWith("where ")) {
    return clean + "?";
  }

  if (lower.startsWith("the ") || lower.startsWith("a ") || lower.startsWith("my ") || lower.startsWith("your ")) {
    return `What is ${clean.charAt(0).toLowerCase() + clean.slice(1)}?`;
  }

  // Prefix with "What about" for short headings, "What is" for longer
  if (clean.split(" ").length <= 4) {
    return `What does "${clean}" mean in this context?`;
  }

  return `What is ${clean.charAt(0).toLowerCase() + clean.slice(1)}?`;
}

/** Common stopwords to filter from keywords. */
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "each",
  "every", "both", "few", "more", "most", "other", "some", "such", "no",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "t", "s", "re", "ve", "ll", "m", "d", "it", "its", "i", "me",
  "my", "we", "our", "you", "your", "he", "him", "his", "she", "her",
  "they", "them", "their", "this", "that", "these", "those", "am",
  "and", "but", "or", "if", "while", "because", "about", "up", "what",
  "which", "who", "whom", "get", "got", "also", "like", "going", "go",
  "make", "way", "thing", "things", "know", "think", "want", "even",
  "one", "two", "new", "first", "last", "long", "great", "little",
  "right", "still", "find", "give", "tell", "let", "much", "many",
]);

/**
 * Extract meaningful keywords from title, headings, and content.
 * Filters stopwords, prefers multi-word phrases from headings.
 */
function extractKeywords(title: string, html: string): string[] {
  const $ = cheerio.load(html);
  const keywords: string[] = [];

  // Clean title into meaningful phrases (2-4 content words)
  const titleWords = title
    .toLowerCase()
    .replace(/[^\w\s'-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  if (titleWords.length >= 2) {
    keywords.push(titleWords.slice(0, 4).join(" "));
  }

  // Extract meaningful phrases from headings
  $("h2, h3, h4").each(function () {
    const text = $(this).text().trim().toLowerCase();
    const words = text
      .replace(/[^\w\s'-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    if (words.length >= 2 && words.length <= 5) {
      keywords.push(words.join(" "));
    }
  });

  // Extract frequent meaningful bigrams from body text
  const plainText = $.root().text().toLowerCase().replace(/[^\w\s]/g, " ");
  const allWords = plainText.split(/\s+/).filter((w) => w.length > 3 && !STOPWORDS.has(w));
  const bigramCounts = new Map<string, number>();
  for (let i = 0; i < allWords.length - 1; i++) {
    const bigram = `${allWords[i]} ${allWords[i + 1]}`;
    bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
  }

  // Add top bigrams that appear 2+ times
  const topBigrams = [...bigramCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([bigram]) => bigram);
  keywords.push(...topBigrams);

  // Deduplicate and limit to 5
  const unique = [...new Set(keywords)].filter((kw) => kw.length > 5);
  return unique.slice(0, 5);
}

// ─── Enrichment generator ────────────────────────────────────────────

/**
 * Generate enrichment data for a single article.
 * All processing is local — no API calls.
 */
function enrichArticle(article: ParsedArticle): EnrichmentData {
  const plainText = htmlToText(article.cleanedHtml);

  // ── Estimated read time ──
  const estimatedReadTime = Math.max(
    1,
    Math.round(article.wordCount / WORDS_PER_MINUTE)
  );

  // ── Excerpt (first 1-2 sentences from first paragraph, max 200 chars) ──
  const leadText = firstParagraphText(article.cleanedHtml);
  let excerpt = firstSentences(leadText, 2);
  if (excerpt.length > 200) {
    excerpt = firstSentences(leadText, 1);
  }
  if (excerpt.length > 200) {
    excerpt = excerpt.substring(0, 197) + "...";
  }

  // ── Topics (keyword frequency matching) ──
  const topicScores = detectTopics(plainText + " " + article.title);
  const topics = topicScores.slice(0, 3).map((t) => t.slug);
  // Ensure at least 1 topic
  if (topics.length === 0) topics.push("curiosity");

  // ── Related keynote (derived from primary topic) ──
  const relatedKeynote = TOPIC_TO_KEYNOTE[topics[0]] || "curiosity-catalyst";

  // ── SEO title (clean title, max 70 chars) ──
  let seoTitle = article.title;
  if (seoTitle.length > 70) {
    seoTitle = seoTitle.substring(0, 67) + "...";
  }

  // ── SEO description (first sentence from first paragraph, max 160 chars) ──
  let seoDescription = firstSentences(leadText, 1);
  if (seoDescription.length > 160) {
    seoDescription = seoDescription.substring(0, 157) + "...";
  }

  // ── Target keywords ──
  const targetKeywords = extractKeywords(article.title, article.cleanedHtml);

  // ── FAQ (from headings + context) ──
  const headingsWithContext = extractHeadingsWithContext(article.cleanedHtml);
  let faq: { question: string; answer: string }[] = [];

  if (headingsWithContext.length >= 3) {
    // Use headings as FAQ basis
    faq = headingsWithContext.slice(0, 5).map((h) => ({
      question: toQuestion(h.heading),
      answer: firstSentences(h.context, 2),
    }));
  } else {
    // Fallback: generate from title and content
    const titleQ = `What is the main idea of "${article.title}"?`;
    const titleA = firstSentences(plainText, 2);
    faq.push({ question: titleQ, answer: titleA });

    // Add topic-based questions
    if (topics.includes("failure")) {
      faq.push({
        question: "How does failure lead to growth?",
        answer: firstSentences(plainText.substring(plainText.length / 3), 2) || titleA,
      });
    }
    if (topics.includes("entrepreneurship")) {
      faq.push({
        question: "What entrepreneurship lessons does this article share?",
        answer: firstSentences(plainText.substring(plainText.length / 4), 2) || titleA,
      });
    }
    if (topics.includes("focus")) {
      faq.push({
        question: "How can we improve focus and reduce distractions?",
        answer: firstSentences(plainText.substring(plainText.length / 3), 2) || titleA,
      });
    }
    if (topics.includes("curiosity")) {
      faq.push({
        question: "Why is curiosity important for personal growth?",
        answer: firstSentences(plainText.substring(plainText.length / 4), 2) || titleA,
      });
    }
    if (topics.includes("innovation")) {
      faq.push({
        question: "What innovation insights does this article offer?",
        answer: firstSentences(plainText.substring(plainText.length / 3), 2) || titleA,
      });
    }
    if (topics.includes("agency")) {
      faq.push({
        question: "How can we take more ownership of our decisions?",
        answer: firstSentences(plainText.substring(plainText.length / 4), 2) || titleA,
      });
    }
    if (topics.includes("ai")) {
      faq.push({
        question: "How is AI changing the way we work and create?",
        answer: firstSentences(plainText.substring(plainText.length / 3), 2) || titleA,
      });
    }

    // Pad to 5 if needed
    while (faq.length < 5) {
      const segment = plainText.substring(
        (plainText.length * (faq.length + 1)) / 7
      );
      const sentence = firstSentences(segment, 2);
      if (sentence && sentence.length > 20) {
        faq.push({
          question: `What else should readers know about ${article.title.toLowerCase()}?`,
          answer: sentence,
        });
      } else {
        break;
      }
    }
  }

  // Ensure max 5 FAQs
  faq = faq.slice(0, 5);

  return {
    excerpt,
    faq,
    seoTitle,
    seoDescription,
    topics,
    relatedKeynote,
    targetKeywords,
    estimatedReadTime,
  };
}

// ─── File I/O ────────────────────────────────────────────────────────

function loadArticles(dir: string): ParsedArticle[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as ParsedArticle);
}

function parseArgs(): { sample?: number; only?: string[] } {
  const args = process.argv.slice(2);
  const result: { sample?: number; only?: string[] } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--sample" && args[i + 1]) {
      result.sample = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--only" && args[i + 1]) {
      result.only = args[i + 1].split(",").map((s) => s.trim());
      i++;
    }
  }
  return result;
}

// ─── Main ────────────────────────────────────────────────────────────

function main(): void {
  console.log("🤖 Article Enrichment — Block 7b (local processing)\n");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load articles
  const mediumArticles = loadArticles(MEDIUM_DIR);
  const substackArticles = loadArticles(SUBSTACK_DIR);
  let allArticles = [...mediumArticles, ...substackArticles];

  console.log(`  Loaded: ${mediumArticles.length} Medium + ${substackArticles.length} Substack = ${allArticles.length} articles`);

  // Apply CLI filters
  const { sample, only } = parseArgs();
  if (only) {
    allArticles = allArticles.filter((a) => only.includes(a.slug));
    console.log(`  Filtered to ${allArticles.length} articles`);
  } else if (sample) {
    allArticles = allArticles.slice(0, sample);
    console.log(`  Sampled ${allArticles.length} articles`);
  }

  console.log(`  Processing: ${allArticles.length} articles\n`);

  // Enrich each article
  let success = 0;
  const topicCounts: Record<string, number> = {};
  const keynoteCounts: Record<string, number> = {};

  for (let i = 0; i < allArticles.length; i++) {
    const article = allArticles[i];
    const progress = `[${i + 1}/${allArticles.length}]`;

    try {
      const enrichment = enrichArticle(article);
      const enrichedArticle: EnrichedArticle = { ...article, enrichment };

      const outputPath = path.join(OUTPUT_DIR, `${article.slug}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(enrichedArticle, null, 2));

      success++;

      // Track distribution
      for (const t of enrichment.topics) {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      }
      keynoteCounts[enrichment.relatedKeynote] =
        (keynoteCounts[enrichment.relatedKeynote] || 0) + 1;

      if ((i + 1) % 50 === 0) {
        console.log(`  ${progress} ${article.slug} → ${enrichment.topics.join(", ")}`);
      }
    } catch (err) {
      console.error(`  ${progress} ❌ ${article.slug}: ${err}`);
    }
  }

  console.log(`\n✅ Enrichment complete: ${success}/${allArticles.length} articles`);
  console.log(`   Output: ${OUTPUT_DIR}/`);

  // Topic distribution
  console.log("\n📊 Topic distribution:");
  for (const [topic, count] of Object.entries(topicCounts).sort((a, b) => b[1] - a[1])) {
    const bar = "█".repeat(Math.round(count / 2));
    console.log(`   ${topic.padEnd(20)} ${count.toString().padStart(3)} ${bar}`);
  }

  // Keynote distribution
  console.log("\n🎤 Keynote mapping:");
  for (const [keynote, count] of Object.entries(keynoteCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${keynote.padEnd(30)} ${count}`);
  }

  // Write summary
  const summaryPath = path.join(OUTPUT_DIR, "_summary.json");
  const enrichedFiles = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const summary = enrichedFiles.map((f) => {
    const e = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, f), "utf-8")) as EnrichedArticle;
    return {
      slug: e.slug, title: e.title, source: e.source,
      topics: e.enrichment.topics, relatedKeynote: e.enrichment.relatedKeynote,
      excerpt: e.enrichment.excerpt, readTime: e.enrichment.estimatedReadTime,
      faqCount: e.enrichment.faq.length, keywordCount: e.enrichment.targetKeywords.length,
    };
  });
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n   Summary: ${summaryPath}`);
}

main();
