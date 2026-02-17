/**
 * Schema index — registers all document types and reusable objects.
 *
 * Document types:
 * - Singletons: siteSettings, author, speaker
 * - Repeatable: keynote, topicHub, post, book, mediaAppearance,
 *               testimonial, business, redirect
 *
 * Reusable objects:
 * - seoFields: SEO overrides for any content type
 * - portableTextBody: rich text with custom blocks
 */

// Objects
import { seoFields } from "./objects/seo-fields";
import { portableTextBody } from "./objects/portable-text-body";

// Singletons
import { siteSettings } from "./singletons/site-settings";
import { author } from "./singletons/author";
import { speaker } from "./singletons/speaker";
import { mostReadSection } from "./singletons/most-read-section";

// Documents
import { keynote } from "./documents/keynote";
import { topicHub } from "./documents/topic-hub";
import { post } from "./documents/post";
import { book } from "./documents/book";
import { mediaAppearance } from "./documents/media-appearance";
import { testimonial } from "./documents/testimonial";
import { business } from "./documents/business";
import { redirect } from "./documents/redirect";

export const schemaTypes = [
  // Objects (must be registered before documents that reference them)
  seoFields,
  portableTextBody,

  // Singletons
  siteSettings,
  author,
  speaker,
  mostReadSection,

  // Documents
  keynote,
  topicHub,
  post,
  book,
  mediaAppearance,
  testimonial,
  business,
  redirect,
];
