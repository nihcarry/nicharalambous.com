/**
 * JSON-LD structured data component.
 *
 * Injects schema.org JSON-LD into the page <head> for search engines
 * and AI models. Used on every page for Person + WebSite schemas,
 * and per-template for Article, FAQPage, Service, etc.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
