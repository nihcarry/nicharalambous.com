/**
 * Homepage — nicharalambous.com
 *
 * Keynote-style slide deck layout. Each section is a full-viewport slide
 * that snaps into view on desktop, creating a presentation feel.
 * Mobile reverts to standard vertical scroll.
 *
 * The authority hub page. Primary goal: drive visitors to /speaker and /contact.
 *
 * Slides:
 * 1. Hero with core positioning
 * 2. Featured keynote topics (CMS-driven)
 * 3. Recent blog posts (CMS-driven, conditional)
 * 4. Explore Topics
 * 5. What Clients Say (testimonials)
 * 6. Incredible Clients (logos)
 * 7. Final CTA → /speaker
 * 8. Footer
 *
 * Content is fetched from Sanity at build time. Falls back to hardcoded
 * defaults if Sanity data is not yet published.
 */
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import {
  homepageFeaturedKeynotesQuery,
  homepageRecentPostsQuery,
  speakerPageQuery,
  type HomepageKeynote,
  type HomepagePost,
  type SpeakerPageData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideParallaxImage, SlideContent } from "@/components/slide-animations";
import { FooterContent } from "@/components/footer-content";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { WhatClientsSay } from "@/components/what-clients-say";
import { IncredibleClients } from "@/components/incredible-clients";

/**
 * Deterministic pseudo-random tilt between -maxDeg and +maxDeg.
 * Uses a simple hash so each (slide, card) pair gets a unique but
 * stable rotation that doesn't repeat in an obvious pattern.
 */
function tilt(index: number, seed: number, maxDeg = 1.8): number {
  const hash = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return +((hash - Math.floor(hash)) * maxDeg * 2 - maxDeg).toFixed(2);
}

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

async function getAsSeenAt(): Promise<string[] | null> {
  try {
    const data = await client.fetch<SpeakerPageData | null>(speakerPageQuery);
    return data?.asSeenAt && data.asSeenAt.length > 0 ? data.asSeenAt : null;
  } catch {
    return null;
  }
}

/* ---------- Page ---------- */

export default async function HomePage() {
  const [keynotes, posts, cmsAsSeenAt] = await Promise.all([
    getFeaturedKeynotes(),
    getRecentPosts(),
    getAsSeenAt(),
  ]);

  const displayKeynotes = keynotes || FALLBACK_KEYNOTES;
  const displayAsSeenAt = cmsAsSeenAt || FALLBACK_AS_SEEN_AT;

  return (
    <SlideDeck>
      <NextSlideIndicator />
      {/* Slide 1: Hero — big headline over portrait */}
      <Slide
        variant="hero"
        id="hero"
        background="bg-rocket-pattern"
        className=""
        image={
          <SlideParallaxImage>
            {/* Portrait — positioned right, behind content (z-0) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/slides/nic-hero-cropped.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 hidden h-[92vh] w-auto max-w-none select-none object-contain object-bottom drop-shadow-2xl md:block lg:right-[4%]"
            />
          </SlideParallaxImage>
        }
      >
        {/* Hero copy not wrapped in SlideContent so it’s always visible */}
        <div className="pt-[var(--top-branding-height-mobile)] md:pt-[var(--header-height-desktop)]">
          <h1
            className="heading-stroke font-bebas text-5xl uppercase leading-[0.95] text-brand-900 sm:text-7xl md:text-7xl lg:text-8xl 2xl:text-9xl"
          >
            <span className="text-accent-600">Keynote speaker,</span>
            <br />
            entrepreneur,
            <br />
            AI product
            <br />
            builder.
          </h1>

          {/* Body + CTAs — below the headline, left-aligned, away from the image */}
          <div className="mt-6 flex flex-col items-start md:mt-8 md:max-w-[45%]">
            <p className="max-w-xl text-base leading-relaxed text-brand-600 md:text-lg">
              With 4 startup exits, 2 best-selling business books, and over 20
              years building technology businesses, Nic Haralambous helps teams
              ship breakthrough products, use curiosity to build with AI, and
              turn innovation into profit.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row md:mt-8">
              <CTAButton href="/speaker" className="!rounded-none font-bebas text-xl uppercase">
                Book a Virtual Keynote
              </CTAButton>
              <CTAButton href="/keynotes" variant="secondary" className="!rounded-none font-bebas text-xl uppercase">
                Explore Keynotes
              </CTAButton>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 2: Featured keynote topics — CMS-driven */}
      <Slide
        variant="grid-3"
        background="bg-mic-pattern"
        id="keynotes"
        image={
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/slides/nic-16bit.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 z-[1] h-[58.5vh] w-auto select-none object-contain object-bottom"
          />
        }
      >
        <SlideContent>
          <h2 className="heading-stroke font-bebas text-center text-4xl uppercase text-accent-600 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            What Nic Speaks About
          </h2>
          <div className="mt-6 grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
            {displayKeynotes.map((keynote, i) => (
              <Link
                key={keynote.slug}
                href={`/keynotes/${keynote.slug}`}
                className="group border-[20px] border-accent-600 bg-white p-6 transition-colors hover:bg-accent-50"
                style={{ transform: `rotate(${tilt(i, 1)}deg)` }}
              >
                <h3 className="font-bebas text-2xl uppercase text-accent-600 group-hover:text-accent-500 md:text-3xl">
                  {keynote.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700">
                  {keynote.tagline}
                </p>
                {keynote.topics && keynote.topics.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {keynote.topics.map((topic) => (
                      <span
                        key={topic._id}
                        className="border border-accent-600/50 px-3 py-1 text-xs font-medium text-accent-600"
                      >
                        {topic.title}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <CTAButton href="/keynotes" className="!rounded-none font-bebas text-xl uppercase">
              View All Keynotes
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {/* Slide 3: Recent blog posts — CMS-driven, conditional */}
      {posts && posts.length > 0 && (
        <Slide
          variant="grid-3"
          id="thinking"
          background="bg-pen-pattern"
          image={
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/slides/Nic_soap_16bit.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 z-50 h-[calc(100vh-503px)] w-auto select-none object-contain object-bottom"
            />
          }
        >
          <SlideContent>
            <h2 className="heading-stroke font-bebas text-center text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
              Latest Thinking
            </h2>
            <div className="mt-6 grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col border-[20px] border-accent-600 bg-white p-6 transition-colors hover:bg-accent-50"
                  style={{ transform: `rotate(${tilt(i, 2)}deg)` }}
                >
                  <h3 className="font-bebas text-2xl uppercase text-accent-600 group-hover:text-accent-500 md:text-3xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-700">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-brand-500">
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
            <div className="mt-6 text-center">
              <CTAButton href="/blog" variant="secondary" className="!rounded-none font-bebas text-xl uppercase">
                Read the Blog
              </CTAButton>
            </div>
          </SlideContent>
        </Slide>
      )}

      {/* Slide 4: Topics preview — heading occupies top-left 2 cells of the 3-col grid */}
      <Slide
        variant="grid-6"
        background="bg-lightbulb-pattern"
        id="topics"
      >
        <SlideContent>
          <div className="grid gap-6 px-2 sm:grid-cols-2 lg:grid-cols-3">
            {/* Heading in place of first two cards */}
            <div className="flex items-center sm:col-span-2">
              <h2 className="heading-stroke font-bebas text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Explore Topics
              </h2>
            </div>
            {/* Top-right card */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/slides/Nic_archeo_16bit.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full right-4 z-50 h-24 w-auto select-none object-contain object-bottom"
              />
              <Link
                href={TOPIC_PREVIEWS[0].href}
                className="group block border-[20px] border-accent-600 bg-white p-6 transition-colors hover:bg-accent-50"
                style={{ transform: `rotate(${tilt(0, 3)}deg)` }}
              >
                <h3 className="font-bebas text-2xl uppercase text-accent-600 group-hover:text-accent-500 md:text-3xl">
                  {TOPIC_PREVIEWS[0].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700">
                  {TOPIC_PREVIEWS[0].description}
                </p>
              </Link>
            </div>
            {/* Bottom row — 3 cards */}
            {TOPIC_PREVIEWS.slice(1).map((topic, i) => (
              i === 0 ? (
                <div key={topic.href} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/slides/Nic_Hunting_Pickaxe.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-full left-4 z-50 hidden h-36 w-auto select-none object-contain object-bottom md:block"
                  />
                  <Link
                    href={topic.href}
                    className="group block border-[20px] border-accent-600 bg-white p-6 transition-colors hover:bg-accent-50"
                    style={{ transform: `rotate(${tilt(i + 1, 3)}deg)` }}
                  >
                    <h3 className="font-bebas text-2xl uppercase text-accent-600 group-hover:text-accent-500 md:text-3xl">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-700">
                      {topic.description}
                    </p>
                  </Link>
                </div>
              ) : (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className="group border-[20px] border-accent-600 bg-white p-6 transition-colors hover:bg-accent-50"
                  style={{ transform: `rotate(${tilt(i + 1, 3)}deg)` }}
                >
                  <h3 className="font-bebas text-2xl uppercase text-accent-600 group-hover:text-accent-500 md:text-3xl">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-700">
                    {topic.description}
                  </p>
                </Link>
              )
            ))}
          </div>
          <div className="mt-6 text-right">
            <CTAButton href="/topics" variant="secondary" className="!rounded-none font-bebas text-xl uppercase">
              All Topics
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {/* Slide 5: Social proof — Testimonial.to embed */}
      <Slide
        variant="full"
        id="testimonials"
        background="bg-speech-pattern"
      >
        <SlideContent className="relative">
          <WhatClientsSay headingAlign="left" />
        </SlideContent>
      </Slide>

      {/* Slide 6: Incredible Clients logos */}
      <Slide variant="logos" background="bg-broadcast-pattern" id="logos">
        <SlideContent>
          <IncredibleClients names={displayAsSeenAt} />
        </SlideContent>
      </Slide>

      {/* Slide 7: Final CTA */}
      <Slide
        variant="cta"
        background="bg-calendar-pattern"
        className="text-center"
        id="cta"
      >
        <SlideContent>
          <h2 className="heading-stroke font-bebas text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Want Nic at Your Next Event?
          </h2>
          <p className="mt-4 text-lg text-brand-700">
            Virtual keynotes for conferences, corporate events, team offsites, and
            webinars. Worldwide delivery.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <CTAButton
              href="/contact"
              className="!rounded-none font-bebas text-xl uppercase"
            >
              Book Nic for Your Event
            </CTAButton>
            <CTAButton
              href="/speaker"
              variant="secondary"
              className="!rounded-none font-bebas text-xl uppercase"
            >
              About Nic as a Speaker
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {/* Slide 8: Footer */}
      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
      <NextSlideIndicator />
    </SlideDeck>
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

const FALLBACK_AS_SEEN_AT = [
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
    title: "Building Breakthrough Products",
    description: "High agency, selective curiosity, and the innovation flywheel.",
    href: "/topics/innovation",
  },
  {
    title: "Focus & Agency",
    description: "Reclaiming attention in a world that profits from your distraction.",
    href: "/topics/focus",
  },
  {
    title: "AI & Product Building",
    description: "How to use AI as a tool without losing your mind — or your team's creative edge.",
    href: "/topics/ai",
  },
];
