/**
 * Shared types for Block 7a parser scripts.
 *
 * Defines the structured JSON shape output by Medium and Substack parsers.
 * These types align with the Sanity `post` schema fields used during import.
 */

/** Parsed article output from Medium or Substack HTML parsers. */
export interface ParsedArticle {
  /** Unique ID: source-slug (e.g. "medium-advice-from-40-year-old-me") */
  id: string;

  /** Article title extracted from HTML */
  title: string;

  /** URL-safe slug derived from filename/title */
  slug: string;

  /** ISO 8601 publish date (null if not determinable) */
  publishedAt: string | null;

  /** Source platform */
  source: "medium" | "substack";

  /** Original URL on the source platform */
  originalUrl: string | null;

  /** Cleaned semantic HTML body (Level 1 output) */
  cleanedHtml: string;

  /** Word count calculated from text content */
  wordCount: number;

  /** Whether the article contains images */
  hasImages: boolean;

  /** Content status for Sanity import */
  contentStatus: "published" | "ai-draft";

  /** Original filename for traceability */
  sourceFile: string;
}

/** Row shape for the combined inventory CSV. */
export interface InventoryRow {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  source: "medium" | "substack";
  sourceUrl: string;
  newUrl: string;
  hasImages: string;
  wordCount: number;
  contentStatus: string;
}

/** AI-generated metadata for a parsed article (Level 2 output). */
export interface EnrichmentData {
  /** 2-3 sentence TL;DR summary (max 200 chars) */
  excerpt: string;

  /** 5 Q&A pairs derived from article content */
  faq: { question: string; answer: string }[];

  /** SEO title override (max 70 chars) */
  seoTitle: string;

  /** Meta description (max 160 chars) */
  seoDescription: string;

  /** 1-3 topic hub slugs from: curiosity, innovation, entrepreneurship, focus, ai, agency, failure */
  topics: string[];

  /** Best-fit keynote slug from: reclaiming-focus, breakthrough-product-teams, curiosity-catalyst */
  relatedKeynote: string;

  /** 3-5 long-tail keywords */
  targetKeywords: string[];

  /** Calculated from word count (not AI-generated) */
  estimatedReadTime: number;
}

/** Parsed article with AI enrichment data attached. */
export interface EnrichedArticle extends ParsedArticle {
  enrichment: EnrichmentData;
}
