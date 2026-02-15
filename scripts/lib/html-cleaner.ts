/**
 * HTML cleaner for Level 1 content optimization.
 *
 * Strips platform-specific wrapper markup from Medium and Substack HTML
 * while preserving semantic HTML elements. No copy changes — only
 * structural cleanup.
 *
 * Preserved elements: p, h2, h3, h4, blockquote, ul, ol, li, a, img,
 *   em, strong, figure, figcaption, iframe, br, hr, pre, code
 * Preserved attributes: href, src, alt, title, width, height
 * Stripped: all classes, IDs, data-* attributes, inline styles, SVGs,
 *   buttons, forms, and platform-specific wrapper divs.
 */

import * as cheerio from "cheerio";

/** Semantic elements to preserve in cleaned output. */
const PRESERVED_ELEMENTS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "em",
  "strong",
  "figure",
  "figcaption",
  "iframe",
  "br",
  "hr",
  "pre",
  "code",
]);

/** Attributes to preserve on elements. */
const PRESERVED_ATTRS = new Set([
  "href",
  "src",
  "alt",
  "title",
  "width",
  "height",
]);

/**
 * Clean Medium article body HTML.
 *
 * Extracts content from the <section data-field="body"> element,
 * unwraps nested section/div wrappers, strips platform classes,
 * and removes the title heading (already captured as metadata).
 */
export function cleanMediumHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml);

  // Extract the body section content
  const bodySection = $('section[data-field="body"]');
  if (!bodySection.length) {
    // Fallback: try to get content from the article
    const article = $("article");
    if (!article.length) return "";
    return cleanElementTree($, article);
  }

  // Remove the title heading (first h2 or h3 with graf--title class)
  bodySection.find(".graf--title").first().remove();

  // Remove subtitle heading
  bodySection.find(".graf--subtitle").first().remove();

  // Remove section dividers
  bodySection.find(".section-divider").remove();

  return cleanElementTree($, bodySection);
}

/**
 * Clean Substack article body HTML.
 *
 * Substack exports are HTML fragments (no document wrapper).
 * Strips newsletter chrome: subscription widgets, social buttons,
 * image expand buttons, and Pencraft UI components.
 */
export function cleanSubstackHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml, { xml: false });

  // Remove subscription widgets
  $(".subscription-widget-wrap-editor").remove();
  $('[data-component-name="SubscribeWidgetToDOM"]').remove();

  // Remove image expand buttons and restack buttons
  $(".image-link-expand").remove();

  // Remove <source> tags from <picture> elements — keep <img> with src
  $("picture source").remove();

  // Unwrap <picture> tags, keeping just the <img> inside
  $("picture").each(function () {
    const img = $(this).find("img");
    if (img.length) {
      $(this).replaceWith(img);
    }
  });

  // Unwrap captioned-image-container → keep <figure> with <img>
  $(".captioned-image-container").each(function () {
    const figure = $(this).find("figure");
    if (figure.length) {
      $(this).replaceWith(figure);
    } else {
      $(this).replaceWith($(this).children());
    }
  });

  // Unwrap image links that are just wrappers (Substack's image2 pattern)
  $("a.image-link").each(function () {
    const img = $(this).find("img");
    if (img.length) {
      // Replace the entire <a> with just the <img> wrapped in <figure>
      $(this).replaceWith(img);
    }
  });

  // Unwrap image2-inset divs
  $(".image2-inset").each(function () {
    $(this).replaceWith($(this).children());
  });

  // Remove Substack footer separators and "Stay curious" sign-offs
  // (these are after <hr> tags typically)

  return cleanElementTree($, $.root());
}

/**
 * Recursively clean an element tree, stripping non-semantic markup.
 *
 * Walks the DOM tree and:
 * - Preserves semantic elements, stripping non-preserved attributes
 * - Unwraps non-semantic wrapper divs/sections (keeping their children)
 * - Removes SVGs, buttons, forms, scripts, styles
 * - Collapses whitespace in text nodes
 */
function cleanElementTree(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<cheerio.AnyNode>
): string {
  // Elements to remove entirely (including children)
  root.find("svg, button, form, script, style, noscript, input").remove();

  // Process all elements: strip attributes, unwrap non-semantic wrappers
  root.find("*").each(function () {
    const el = $(this);
    const tagName = (this as cheerio.Element).tagName?.toLowerCase();

    if (!tagName) return;

    if (PRESERVED_ELEMENTS.has(tagName)) {
      // Strip non-preserved attributes
      const attrs = (this as cheerio.Element).attribs || {};
      for (const attr of Object.keys(attrs)) {
        if (!PRESERVED_ATTRS.has(attr)) {
          el.removeAttr(attr);
        }
      }
    }
  });

  // Get the inner HTML
  let html = root.html() || "";

  // Now do a second pass to unwrap non-semantic elements using a fresh parse
  const $clean = cheerio.load(html, { xml: false });

  // Unwrap divs and sections (keep their content, lose the wrapper)
  let changed = true;
  while (changed) {
    changed = false;
    $clean("div, section, span, header, footer, aside, nav").each(function () {
      const el = $clean(this);
      const tagName = (this as cheerio.Element).tagName?.toLowerCase();

      // Don't unwrap if it's a preserved element
      if (PRESERVED_ELEMENTS.has(tagName)) return;

      el.replaceWith(el.html() || "");
      changed = true;
    });
  }

  html = $clean.root().html() || "";

  // Clean up whitespace: collapse multiple blank lines
  html = html
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .trim();

  // Strip <html><head></head><body>...</body></html> wrapper from cheerio
  html = html
    .replace(/^<html><head><\/head><body>/, "")
    .replace(/<\/body><\/html>$/, "")
    .trim();

  return html;
}

/**
 * Count words in HTML content by stripping tags and counting tokens.
 */
export function countWords(html: string): number {
  const $ = cheerio.load(html);
  const text = $.root().text();
  // Split on whitespace, filter empty strings
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Check whether HTML content contains any <img> or <iframe> elements.
 */
export function hasImages(html: string): boolean {
  const $ = cheerio.load(html);
  return $("img").length > 0 || $("iframe").length > 0;
}
