/**
 * GROQ queries for fetching content from Sanity CMS.
 *
 * All queries are executed at build time only — the site is fully static.
 * Each query fetches exactly the fields needed by its corresponding page template.
 */

/* ---------- Speaker Page (singleton) ---------- */

export const speakerPageQuery = `*[_type == "speaker"][0]{
  headline,
  subheadline,
  whyBookNic,
  howVirtualWorks,
  "asSeenAt": asSeenAt,
  videoEmbed,
  ctaText,
  faq[]{
    question,
    answer
  },
  "testimonials": testimonials[]->{
    _id,
    quote,
    authorName,
    authorTitle,
    company,
    authorImage,
    videoUrl
  },
  "clientLogos": clientLogos[]{
    asset->{url},
    alt
  },
  seo
}`;

/* ---------- Keynotes ---------- */

/** All keynotes for the listing page, ordered by display order */
export const keynotesListQuery = `*[_type == "keynote"] | order(order asc){
  _id,
  title,
  "slug": slug.current,
  tagline,
  deliveryFormat,
  duration,
  audiences,
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  },
  order,
  seo
}`;

/** Single keynote by slug — used for /keynotes/[slug] */
export const keynoteBySlugQuery = `*[_type == "keynote" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  tagline,
  description,
  deliveryFormat,
  duration,
  audiences,
  outcomes,
  videoEmbed,
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  },
  "testimonials": testimonials[]->{
    _id,
    quote,
    authorName,
    authorTitle,
    company,
    authorImage,
    videoUrl
  },
  seo
}`;

/** All keynote slugs — used for generateStaticParams */
export const keynoteSlugListQuery = `*[_type == "keynote" && defined(slug.current)]{
  "slug": slug.current
}`;

/* ---------- Testimonials ---------- */

/** Featured testimonials for the speaker page */
export const featuredTestimonialsQuery = `*[_type == "testimonial" && featured == true]{
  _id,
  quote,
  authorName,
  authorTitle,
  company,
  authorImage,
  videoUrl,
  "relatedKeynote": relatedKeynote->{
    title,
    "slug": slug.current
  }
}`;

/* ---------- TypeScript Interfaces ---------- */

/** Shape returned by speakerPageQuery */
export interface SpeakerPageData {
  headline: string;
  subheadline: string;
  whyBookNic: PortableTextBlock[] | null;
  howVirtualWorks: PortableTextBlock[] | null;
  asSeenAt: string[] | null;
  videoEmbed: string | null;
  ctaText: string | null;
  faq: { question: string; answer: string }[] | null;
  testimonials: TestimonialData[] | null;
  clientLogos: { asset: { url: string }; alt: string }[] | null;
  seo: SeoData | null;
}

/** Shape returned by keynotesListQuery */
export interface KeynoteListItem {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  deliveryFormat: string;
  duration: string;
  audiences: string[];
  topics: TopicReference[];
  order: number;
  seo: SeoData | null;
}

/** Shape returned by keynoteBySlugQuery */
export interface KeynoteData {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: PortableTextBlock[] | null;
  deliveryFormat: string;
  duration: string;
  audiences: string[];
  outcomes: string[];
  videoEmbed: string | null;
  topics: TopicReference[];
  testimonials: TestimonialData[] | null;
  seo: SeoData | null;
}

export interface TestimonialData {
  _id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  authorImage: SanityImage | null;
  videoUrl: string | null;
  relatedKeynote?: { title: string; slug: string } | null;
}

export interface TopicReference {
  _id: string;
  title: string;
  slug: string;
}

export interface SeoData {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
  canonical?: string;
  noIndex?: boolean;
}

// Portable Text blocks are loosely typed — Sanity returns nested objects
// whose shape depends on the schema configuration.
export type PortableTextBlock = Record<string, unknown>;

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}
