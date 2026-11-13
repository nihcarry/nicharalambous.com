/**
 * Shared metadata utilities for nicharalambous.com
 *
 * Generates consistent <title>, meta descriptions, Open Graph tags,
 * and JSON-LD structured data across all page templates.
 */
import type { Metadata } from "next";
import { lunchLearnCheckoutUrl } from "@/lib/site";

const SITE_URL = "https://www.nicharalambous.com";
/**
 * Canonical home URL. The site root keeps a trailing slash. Every other
 * canonical path does not, matching `trailingSlash: false` in next.config.
 *
 * Next's metadata resolver turns a root URL into the origin and drops the
 * slash, so the home page emits this href in a link tag instead of via
 * `alternates.canonical`.
 */
export const HOME_URL = `${SITE_URL}/`;
const SITE_NAME = "Nic Haralambous - Keynote Speaker";
export const DEFAULT_DESCRIPTION =
  "Nic Haralambous is a global keynote speaker, entrepreneur and AI product builder with 4 exits, 3 books, and 20+ years building technology businesses.";

/** Absolute canonical URL for a site path. */
export function canonicalUrl(path = "/"): string {
  if (!path || path === "/") return HOME_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized.replace(/\/+$/, "")}`;
}

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
  const url = canonicalUrl(path);

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
    url: HOME_URL,
    jobTitle: "Keynote speaker",
    description: DEFAULT_DESCRIPTION,
    image: `${SITE_URL}/images/nic-haralambous.jpg`,
    sameAs: [
      "https://www.linkedin.com/in/nicharalambous/",
      "https://www.youtube.com/@nicharrynobull",
      "https://x.com/nicharry",
    ],
  };
}

/** Sitewide WebSite schema — appears on every page */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: HOME_URL,
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
    "@type": "BlogPosting",
    mainEntityOfPage: url,
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
      url: HOME_URL,
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
    serviceType: "Keynote speaking, in person or virtual",
    areaServed: "Worldwide",
  };
}

/** Book schema for /books/[slug] pages */
export function bookJsonLd({
  title,
  description,
  url,
  isbn,
  image,
  publishedYear,
}: {
  title: string;
  description: string;
  url: string;
  isbn?: string;
  image?: string;
  publishedYear?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    description,
    url,
    author: personJsonLd(),
    ...(isbn && { isbn }),
    ...(image && { image }),
    ...(publishedYear && { datePublished: String(publishedYear) }),
  };
}

/** CollectionPage schema for listing pages (books, media, topics) */
export function collectionPageJsonLd({
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
    "@type": "CollectionPage",
    name,
    description,
    url,
    author: personJsonLd(),
  };
}

/** ContactPage schema for /contact */
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Nic Haralambous",
    description:
      "Book Nic Haralambous for your next keynote, in person or virtually. Enquire about speaking engagements, conferences, and corporate events.",
    url: `${SITE_URL}/contact`,
    mainEntity: personJsonLd(),
  };
}

/** Organization on the homepage, alongside the sitewide WebSite node. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nic Haralambous",
    url: HOME_URL,
    logo: `${SITE_URL}/favicon-48x48.png`,
    sameAs: personJsonLd().sameAs,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? HOME_URL : `${SITE_URL}${item.path}`,
    })),
  };
}

/** Output Paradox offers. No Event or VideoObject until a real clip exists. */
export function outputParadoxServiceJsonLd() {
  const url = `${SITE_URL}/keynotes/output-paradox-reengage-teams`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "The Output Paradox",
    serviceType: "Keynote speaking, in person or virtual",
    description:
      "A keynote on why AI makes teams busier and less engaged, and what leaders can do about it. Delivered in person or on Zoom, Teams or Meet.",
    url,
    provider: {
      "@type": "Person",
      name: "Nic Haralambous",
      url: HOME_URL,
      jobTitle: "Keynote speaker",
    },
    areaServed: "Worldwide",
    offers: [
      {
        "@type": "Offer",
        name: "20-minute virtual lunch and learn",
        price: "999",
        priceCurrency: "EUR",
        description: "€999 excluding VAT. 20 minutes, live on Zoom, Teams or Meet.",
        url: `${url}#book`,
        ...(lunchLearnCheckoutUrl()
          ? { availability: "https://schema.org/InStock" }
          : {}),
      },
      {
        "@type": "Offer",
        name: "Virtual keynote",
        price: "1500",
        priceCurrency: "EUR",
        description: "From €1,500 excluding VAT. 45 minutes.",
        url: `${url}#formats`,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "In-person keynote",
        price: "4500",
        priceCurrency: "EUR",
        description: "From €4,500 excluding travel and VAT. 45 minutes.",
        url: `${url}#formats`,
        availability: "https://schema.org/InStock",
      },
    ],
  };
}

/** AboutPage schema for /about */
export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Nic Haralambous",
    description:
      "Entrepreneur, AI product builder, and keynote speaker, in person or virtually, with 4 startup exits, 3 books, and 20+ years building technology businesses.",
    url: `${SITE_URL}/about`,
    mainEntity: personJsonLd(),
  };
}
