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

/* ---------- Homepage ---------- */

/** Featured keynotes for the homepage (top 3 by display order) */
export const homepageFeaturedKeynotesQuery = `*[_type == "keynote"] | order(order asc)[0...3]{
  _id,
  title,
  "slug": slug.current,
  tagline,
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

/** Recent published blog posts for the homepage */
export const homepageRecentPostsQuery = `*[_type == "post" && contentStatus == "published"] | order(publishedAt desc)[0...3]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  estimatedReadTime,
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

/** Featured testimonials for the homepage */
export const homepageTestimonialsQuery = `*[_type == "testimonial" && featured == true][0...3]{
  _id,
  quote,
  authorName,
  authorTitle,
  company
}`;

/* ---------- About Page ---------- */

/** All businesses ordered chronologically for the about page timeline */
export const businessesQuery = `*[_type == "business"] | order(startYear desc){
  _id,
  name,
  role,
  description,
  startYear,
  endYear,
  outcome,
  url,
  logo,
  order
}`;

/** Site settings singleton for bio and social links */
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteTitle,
  siteDescription,
  oneLinerBio,
  ogImage,
  socialLinks,
  footerText
}`;

/* ---------- Books ---------- */

/** All books for the listing page */
export const booksListQuery = `*[_type == "book"] | order(publishedYear desc){
  _id,
  title,
  "slug": slug.current,
  subtitle,
  coverImage,
  publishedYear,
  "relatedTopics": relatedTopics[]->{
    _id,
    title,
    "slug": slug.current
  },
  seo
}`;

/** Single book by slug for /books/[slug] */
export const bookBySlugQuery = `*[_type == "book" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  subtitle,
  coverImage,
  description,
  publishedYear,
  isbn,
  buyLinks,
  "relatedTopics": relatedTopics[]->{
    _id,
    title,
    "slug": slug.current
  },
  seo
}`;

/** All book slugs for generateStaticParams */
export const bookSlugListQuery = `*[_type == "book" && defined(slug.current)]{
  "slug": slug.current
}`;

/* ---------- Media Appearances ---------- */

/** All media appearances for the /media page, newest first */
export const mediaAppearancesQuery = `*[_type == "mediaAppearance"] | order(date desc){
  _id,
  title,
  type,
  publication,
  date,
  url,
  embedUrl,
  description,
  logo
}`;

/* ---------- Topic Hubs ---------- */

/** All topic hubs for the listing page */
export const topicHubsListQuery = `*[_type == "topicHub"]{
  _id,
  title,
  "slug": slug.current,
  oneSentenceSummary,
  "relatedKeynotes": relatedKeynotes[]->{
    _id,
    title,
    "slug": slug.current
  },
  seo
}`;

/** Single topic hub by slug for /topics/[slug] */
export const topicHubBySlugQuery = `*[_type == "topicHub" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  oneSentenceSummary,
  definition,
  whyItMatters,
  "relatedKeynotes": relatedKeynotes[]->{
    _id,
    title,
    "slug": slug.current,
    tagline
  },
  "featuredPosts": featuredPosts[]->{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    estimatedReadTime
  },
  seo
}`;

/** All topic hub slugs for generateStaticParams */
export const topicHubSlugListQuery = `*[_type == "topicHub" && defined(slug.current)]{
  "slug": slug.current
}`;

/** Published posts in a topic hub for the topic page (beyond featured) */
export const postsByTopicQuery = `*[_type == "post" && contentStatus == "published" && $topicId in topics[]._ref] | order(publishedAt desc)[0...10]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  estimatedReadTime
}`;

/* ---------- Blog Listing ---------- */

/** Curated Most Read posts from the mostReadSection singleton (top 5, in order) */
export const mostReadPostsQuery = `*[_type == "mostReadSection"][0]{
  "posts": posts[]->[contentStatus == "published"][0...5]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    estimatedReadTime,
    featuredLabel,
    videoEmbed,
    "featuredImage": featuredImage{
      asset->{url},
      alt
    },
    "topics": topics[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
}`;

/** Featured / Most Read posts for the hero section on /blog (legacy: per-post flag) */
export const featuredPostsQuery = `*[_type == "post" && contentStatus == "published" && featured == true] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  estimatedReadTime,
  featuredLabel,
  videoEmbed,
  "featuredImage": featuredImage{
    asset->{url},
    alt
  },
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

/** All published blog posts for the /blog listing, newest first */
export const blogPostsListQuery = `*[_type == "post" && contentStatus == "published"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  estimatedReadTime,
  "featuredImage": featuredImage{
    asset->{url},
    alt
  },
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  },
  seo
}`;

/** Total count of published posts — used for pagination metadata */
export const blogPostsCountQuery = `count(*[_type == "post" && contentStatus == "published"])`;

/** All topic hubs referenced by published posts — for filter chips */
export const blogTopicFiltersQuery = `*[_type == "topicHub" && count(*[_type == "post" && contentStatus == "published" && ^._id in topics[]._ref]) > 0]{
  _id,
  title,
  "slug": slug.current
}`;

/* ---------- Blog Post (single) ---------- */

/** Full blog post by slug — used for /blog/[slug] */
export const blogPostBySlugQuery = `*[_type == "post" && slug.current == $slug && contentStatus == "published"][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  updatedAt,
  estimatedReadTime,
  body,
  rawHtmlBody,
  videoEmbed,
  featured,
  featuredLabel,
  "featuredImage": featuredImage{
    asset->{url},
    alt
  },
  faq[]{
    question,
    answer
  },
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  },
  "relatedKeynote": relatedKeynote->{
    _id,
    title,
    "slug": slug.current,
    tagline
  },
  seo
}`;

/** All published post slugs — used for generateStaticParams on /blog/[slug] */
export const blogPostSlugListQuery = `*[_type == "post" && contentStatus == "published" && defined(slug.current)]{
  "slug": slug.current
}`;

/** Related posts in the same topic hub, excluding the current post */
export const relatedPostsQuery = `*[_type == "post" && contentStatus == "published" && _id != $currentId && count((topics[]._ref)[@ in $topicIds]) > 0] | order(publishedAt desc)[0...3]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  estimatedReadTime
}`;

/* ---------- Archive Post ---------- */

/** Archived post by slug — used for /archive/[slug] */
export const archivePostBySlugQuery = `*[_type == "post" && slug.current == $slug && contentStatus == "archived"][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  rawHtmlBody,
  originalUrl,
  "topics": topics[]->{
    _id,
    title,
    "slug": slug.current
  }
}`;

/** All archived post slugs — used for generateStaticParams on /archive/[slug] */
export const archivePostSlugListQuery = `*[_type == "post" && contentStatus == "archived" && defined(slug.current)]{
  "slug": slug.current
}`;

/* ---------- RSS Feed ---------- */

/** Published posts for RSS feed generation — newest 50 */
export const rssFeedPostsQuery = `*[_type == "post" && contentStatus == "published"] | order(publishedAt desc)[0...50]{
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "topics": topics[]->{
    title
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

/* ---------- Homepage Interfaces ---------- */

/** Shape returned by homepageFeaturedKeynotesQuery */
export interface HomepageKeynote {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  topics: TopicReference[];
}

/** Shape returned by homepageRecentPostsQuery */
export interface HomepagePost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  estimatedReadTime: number | null;
  topics: TopicReference[];
}

/** Shape returned by homepageTestimonialsQuery */
export interface HomepageTestimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
}

/* ---------- About Page Interfaces ---------- */

/** Shape returned by businessesQuery */
export interface BusinessData {
  _id: string;
  name: string;
  role: string | null;
  description: string | null;
  startYear: number | null;
  endYear: number | null;
  outcome: string | null;
  url: string | null;
  logo: SanityImage | null;
  order: number | null;
}

/** Shape returned by siteSettingsQuery */
export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  oneLinerBio: string;
  ogImage: SanityImage | null;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    substack?: string;
    youtube?: string;
  } | null;
  footerText: string | null;
}

/* ---------- Book Interfaces ---------- */

/** Shape returned by booksListQuery */
export interface BookListItem {
  _id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  coverImage: SanityImage | null;
  publishedYear: number | null;
  relatedTopics: TopicReference[];
  seo: SeoData | null;
}

/** Shape returned by bookBySlugQuery */
export interface BookData {
  _id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  coverImage: SanityImage | null;
  description: PortableTextBlock[] | null;
  publishedYear: number | null;
  isbn: string | null;
  buyLinks: { label: string; url: string }[] | null;
  relatedTopics: TopicReference[];
  seo: SeoData | null;
}

/* ---------- Media Appearance Interfaces ---------- */

/** Shape returned by mediaAppearancesQuery */
export interface MediaAppearanceData {
  _id: string;
  title: string;
  type: "podcast" | "video" | "press" | "broadcast";
  publication: string | null;
  date: string | null;
  url: string | null;
  embedUrl: string | null;
  description: string | null;
  logo: SanityImage | null;
}

/* ---------- Topic Hub Interfaces ---------- */

/** Shape returned by topicHubsListQuery */
export interface TopicHubListItem {
  _id: string;
  title: string;
  slug: string;
  oneSentenceSummary: string;
  relatedKeynotes: { _id: string; title: string; slug: string }[];
  seo: SeoData | null;
}

/** Shape returned by topicHubBySlugQuery */
export interface TopicHubData {
  _id: string;
  title: string;
  slug: string;
  oneSentenceSummary: string;
  definition: PortableTextBlock[] | null;
  whyItMatters: PortableTextBlock[] | null;
  relatedKeynotes: { _id: string; title: string; slug: string; tagline: string }[];
  featuredPosts: TopicHubPost[];
  seo: SeoData | null;
}

/** Post data as returned within a topic hub query */
export interface TopicHubPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  estimatedReadTime: number | null;
}

/* ---------- Blog Listing Interfaces ---------- */

/** Shape returned by blogPostsListQuery */
export interface BlogPostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  estimatedReadTime: number | null;
  featuredImage: { asset: { url: string }; alt: string } | null;
  topics: TopicReference[];
  seo: SeoData | null;
}

/** Shape returned by mostReadPostsQuery (singleton) */
export interface MostReadSectionData {
  posts: FeaturedPostItem[];
}

/** Shape returned by featuredPostsQuery */
export interface FeaturedPostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  estimatedReadTime: number | null;
  featuredLabel: string | null;
  videoEmbed: string | null;
  featuredImage: { asset: { url: string }; alt: string } | null;
  topics: TopicReference[];
}

/** Shape returned by blogPostBySlugQuery */
export interface BlogPostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  updatedAt: string | null;
  estimatedReadTime: number | null;
  body: PortableTextBlock[] | null;
  rawHtmlBody: string | null;
  videoEmbed: string | null;
  featured: boolean | null;
  featuredLabel: string | null;
  featuredImage: { asset: { url: string }; alt: string } | null;
  faq: { question: string; answer: string }[] | null;
  topics: TopicReference[];
  relatedKeynote: {
    _id: string;
    title: string;
    slug: string;
    tagline: string;
  } | null;
  seo: SeoData | null;
}

/** Shape returned by archivePostBySlugQuery */
export interface ArchivePostData {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  rawHtmlBody: string | null;
  originalUrl: string | null;
  topics: TopicReference[];
}

/** Shape returned by relatedPostsQuery */
export interface RelatedPostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  estimatedReadTime: number | null;
}

/** Shape returned by rssFeedPostsQuery */
export interface RssFeedPost {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string;
  topics: { title: string }[];
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
