/**
 * Shared metadata utilities for nicharalambous.com
 *
 * Generates consistent <title>, meta descriptions, Open Graph tags,
 * and JSON-LD structured data across all page templates.
 */
import type { Metadata } from "next";

const SITE_URL = "https://nicharalambous.com";
const SITE_NAME = "Nic Haralambous";
const DEFAULT_DESCRIPTION =
  "Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses.";

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate consistent page metadata for any page template.
 * Handles title formatting, canonical URLs, and Open Graph tags.
 */
export function generatePageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  ogImage,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

/* ---------- JSON-LD Structured Data Helpers ---------- */

/** Sitewide Person schema — appears on every page */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nic Haralambous",
    url: SITE_URL,
    jobTitle: "Entrepreneur, AI Product Builder, Virtual Keynote Speaker",
    description: DEFAULT_DESCRIPTION,
    image: `${SITE_URL}/images/nic-haralambous.jpg`,
    sameAs: [
      "https://www.linkedin.com/in/nicharalambous/",
      "https://twitter.com/nicharalambous",
      "https://nichasgottago.substack.com/",
    ],
  };
}

/** Sitewide WebSite schema — appears on every page */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/** FAQ schema for pages with FAQ sections */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Article schema for blog posts */
export function articleJsonLd({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    ...(updatedAt && { dateModified: updatedAt }),
    ...(image && { image }),
    author: personJsonLd(),
    publisher: {
      "@type": "Person",
      name: "Nic Haralambous",
      url: SITE_URL,
    },
  };
}

/** Service schema for speaker/keynote pages */
export function serviceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: personJsonLd(),
    serviceType: "Virtual Keynote Speaking",
    areaServed: "Worldwide",
  };
}
