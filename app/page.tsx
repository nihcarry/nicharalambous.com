/**
 * Homepage — nicharalambous.com
 *
 * The authority hub page. Primary goal: drive visitors to /speaker and /contact.
 *
 * Sections:
 * 1. Hero with core positioning
 * 2. Featured keynote topics (CMS-driven)
 * 3. Recent blog posts (CMS-driven)
 * 4. Social proof (testimonials + "As seen at")
 * 5. Final CTA → /speaker
 *
 * Content is fetched from Sanity at build time. Falls back to hardcoded
 * defaults if Sanity data is not yet published.
 */
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  homepageFeaturedKeynotesQuery,
  homepageRecentPostsQuery,
  homepageTestimonialsQuery,
  type HomepageKeynote,
  type HomepagePost,
  type HomepageTestimonial,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

/* ---------- Data fetching ---------- */

async function getFeaturedKeynotes(): Promise<HomepageKeynote[] | null> {
  try {
    const data = await client.fetch<HomepageKeynote[]>(homepageFeaturedKeynotesQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

async function getRecentPosts(): Promise<HomepagePost[] | null> {
  try {
    const data = await client.fetch<HomepagePost[]>(homepageRecentPostsQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

async function getTestimonials(): Promise<HomepageTestimonial[] | null> {
  try {
    const data = await client.fetch<HomepageTestimonial[]>(homepageTestimonialsQuery);
    return data && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

/* ---------- Page ---------- */

export default async function HomePage() {
  const [keynotes, posts, testimonials] = await Promise.all([
    getFeaturedKeynotes(),
    getRecentPosts(),
    getTestimonials(),
  ]);

  const displayKeynotes = keynotes || FALLBACK_KEYNOTES;
  const displayTestimonials = testimonials || FALLBACK_TESTIMONIALS;

  return (
    <>
      {/* Hero section */}
      <Section width="content" className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl md:text-6xl">
          Entrepreneur, AI product builder, and{" "}
          <span className="text-accent-600">virtual keynote speaker</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-600">
          With 4 startup exits, 3 books, and 20+ years building technology
          businesses, Nic Haralambous helps modern teams unlock curiosity,
          build with AI, and turn innovation into profit.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CTAButton href="/speaker">Book a Virtual Keynote</CTAButton>
          <CTAButton href="/keynotes" variant="secondary">
            Explore Keynotes
          </CTAButton>
        </div>
      </Section>

      {/* Featured keynote topics — CMS-driven */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          What Nic Speaks About
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayKeynotes.map((keynote) => (
            <Link
              key={keynote.slug}
              href={`/keynotes/${keynote.slug}`}
              className="group rounded-xl border border-brand-200 bg-surface p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                {keynote.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                {keynote.tagline}
              </p>
              {keynote.topics && keynote.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {keynote.topics.map((topic) => (
                    <span
                      key={topic._id}
                      className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {topic.title}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CTAButton href="/keynotes" variant="secondary">
            View All Keynotes
          </CTAButton>
        </div>
      </Section>

      {/* Recent blog posts — CMS-driven, hidden if no posts yet */}
      {posts && posts.length > 0 && (
        <Section width="wide">
          <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
            Latest Thinking
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl border border-brand-200 p-6 transition-all hover:border-accent-400 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-600">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-brand-400">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  )}
                  {post.estimatedReadTime && (
                    <span>{post.estimatedReadTime} min read</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <CTAButton href="/blog" variant="secondary">
              Read the Blog
            </CTAButton>
          </div>
        </Section>
      )}

      {/* Topics preview — always visible, links to topic hubs */}
      <Section width="wide" className={posts ? "bg-brand-50" : ""}>
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          Explore Topics
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPIC_PREVIEWS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="group rounded-xl border border-brand-200 bg-surface p-6 transition-all hover:border-accent-400 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-brand-900 group-hover:text-accent-600">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-600">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CTAButton href="/topics" variant="secondary">
            All Topics
          </CTAButton>
        </div>
      </Section>

      {/* Social proof — testimonials */}
      <Section width="wide">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          What Clients Say
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.map((testimonial, i) => (
            <blockquote
              key={testimonial._id || `fallback-${i}`}
              className="flex flex-col rounded-xl border border-brand-200 bg-surface p-6"
            >
              <p className="flex-1 text-sm italic leading-relaxed text-brand-700">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-brand-100 pt-4">
                <p className="text-sm font-semibold text-brand-900">
                  {testimonial.authorName}
                </p>
                <p className="text-xs text-brand-500">
                  {testimonial.authorTitle}
                  {testimonial.company && `, ${testimonial.company}`}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* "As seen at" logos */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          As Seen At
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-brand-400">
          {AS_SEEN_AT.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold tracking-wide"
            >
              {name}
            </span>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          Want Nic at Your Next Event?
        </h2>
        <p className="mt-4 text-lg text-accent-100">
          Virtual keynotes for conferences, corporate events, team offsites, and
          webinars. Worldwide delivery.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton
            href="/contact"
            className="bg-white !text-accent-600 hover:bg-accent-100"
          >
            Book Nic for Your Event
          </CTAButton>
          <CTAButton
            href="/speaker"
            className="border-white !text-white hover:bg-white/10"
            variant="secondary"
          >
            About Nic as a Speaker
          </CTAButton>
        </div>
      </Section>
    </>
  );
}

/* ---------- Fallback data ---------- */

const FALLBACK_KEYNOTES: HomepageKeynote[] = [
  {
    _id: "fk-1",
    title: "Reclaiming Focus in a World That Profits From Your Distraction",
    slug: "reclaiming-focus",
    tagline: "The DIAL framework for attention management and deep work",
    topics: [
      { _id: "t1", title: "Focus", slug: "focus" },
      { _id: "t2", title: "Agency", slug: "agency" },
    ],
  },
  {
    _id: "fk-2",
    title: "How to Build Breakthrough Product Teams",
    slug: "breakthrough-product-teams",
    tagline: "The Innovation Flywheel: curiosity, experimentation, and high agency",
    topics: [
      { _id: "t3", title: "Innovation", slug: "innovation" },
      { _id: "t4", title: "AI", slug: "ai" },
    ],
  },
  {
    _id: "fk-3",
    title: "The Curiosity Catalyst",
    slug: "curiosity-catalyst",
    tagline: "Why curiosity is the god particle of innovation",
    topics: [
      { _id: "t5", title: "Curiosity", slug: "curiosity" },
      { _id: "t6", title: "Innovation", slug: "innovation" },
    ],
  },
];

const FALLBACK_TESTIMONIALS: HomepageTestimonial[] = [
  {
    _id: "ft-1",
    quote: "Nic's keynote on curiosity was the highlight of our conference. Our team is still referencing his frameworks months later.",
    authorName: "Placeholder Name",
    authorTitle: "Head of Innovation",
    company: "Company Name",
  },
  {
    _id: "ft-2",
    quote: "The virtual delivery was flawless. Nic kept 500+ remote attendees fully engaged for the entire session.",
    authorName: "Placeholder Name",
    authorTitle: "Events Director",
    company: "Company Name",
  },
  {
    _id: "ft-3",
    quote: "Real stories from real experience. No fluff, no generic advice — just frameworks we could use immediately.",
    authorName: "Placeholder Name",
    authorTitle: "CEO",
    company: "Company Name",
  },
];

const AS_SEEN_AT = [
  "SXSW",
  "Standard Bank",
  "Vodacom",
  "BBC",
  "Fast Company",
  "CNBC Africa",
];

const TOPIC_PREVIEWS = [
  {
    title: "Curiosity & Innovation",
    description: "Why curiosity is the god particle of innovation — and how to build teams that never stop experimenting.",
    href: "/topics/curiosity",
  },
  {
    title: "AI & Product Building",
    description: "How to use AI as a tool without losing your mind — or your team's creative edge.",
    href: "/topics/ai",
  },
  {
    title: "Entrepreneurship & Resilience",
    description: "4 startup exits, countless failures. Real stories of building, breaking, and rebuilding.",
    href: "/topics/entrepreneurship",
  },
  {
    title: "Focus & Agency",
    description: "Reclaiming attention in a world that profits from your distraction.",
    href: "/topics/focus",
  },
  {
    title: "Failure as Data",
    description: "Why blameless postmortems and post-traumatic growth build stronger teams.",
    href: "/topics/failure",
  },
  {
    title: "Building Breakthrough Teams",
    description: "High agency, selective curiosity, and the innovation flywheel.",
    href: "/topics/innovation",
  },
];
