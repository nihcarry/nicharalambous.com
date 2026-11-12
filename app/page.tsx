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
 * 8. Newsletter signup
 * 9. Footer
 *
 * Content is fetched from Sanity at build time. Falls back to hardcoded
 * defaults if Sanity data is not yet published.
 */
import { client } from "@/lib/sanity/client";
import {
  homepageRecentPostsQuery,
  speakerPageQuery,
  type HomepagePost,
  type SpeakerPageData,
} from "@/lib/sanity/queries";
import { CTAButton } from "@/components/cta-button";
import { Slide } from "@/components/slide";
import { SlideDeck } from "@/components/slide-deck";
import { SlideContent } from "@/components/slide-animations";
import { FooterContent } from "@/components/footer-content";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { NextSlideIndicator } from "@/components/next-slide-indicator";
import { WhatClientsSay } from "@/components/what-clients-say";
import { IncredibleClients } from "@/components/incredible-clients";
import { getKeynoteBookingUrl } from "@/lib/keynotes-data";
import { HOME_URL } from "@/lib/metadata";
import { ArrowRight, Crosshair } from "lucide-react";
import { DecorativePicture } from "@/components/decorative-picture";
import { LoadWhenNear } from "@/components/load-when-near";

/** Flagship keynote the hero slide sells. */
const OUTPUT_PARADOX_SLUG = "output-paradox-reengage-teams";

/** Portraits sit in a six-column row, so each one is a sixth of the viewport. */
const HERO_PORTRAIT_SIZES = "16.67vw";
const DESKTOP_MEDIA = "(min-width: 768px)";

function heroPortraitSrcSet(n: number, ext: "avif" | "webp" | "png"): string {
  if (ext === "png") return `/slides/nic-hero-${n}.png 682w`;
  return `/slides/hero/nic-hero-${n}-480.${ext} 480w, /slides/hero/nic-hero-${n}-682.${ext} 682w`;
}

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
  const [posts, cmsAsSeenAt] = await Promise.all([
    getRecentPosts(),
    getAsSeenAt(),
  ]);

  const displayAsSeenAt = cmsAsSeenAt || FALLBACK_AS_SEEN_AT;

  return (
    <>
      {/* Next's metadata resolver drops a trailing slash on the site root.
          These two tags are the home canonical and og:url. */}
      <link rel="canonical" href={HOME_URL} />
      <meta property="og:url" content={HOME_URL} />
    <SlideDeck>
      <NextSlideIndicator />
      {/* Slide 1: Hero — big headline over portrait */}
      <Slide
        variant="hero"
        id="hero"
        background="bg-beard-pattern"
        className="md:!pt-[10.5rem] md:!justify-start"
        image={
          <>
            {/* The faint beard tile is the mobile LCP image. Preload it so it
                is not stuck behind decorative art. */}
            <link
              rel="preload"
              as="image"
              href="/slides/beard-pattern-tile.png"
              fetchPriority="high"
            />
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <link
                key={n}
                rel="preload"
                as="image"
                type="image/avif"
                media={DESKTOP_MEDIA}
                href={`/slides/hero/nic-hero-${n}-480.avif`}
                imageSrcSet={heroPortraitSrcSet(n, "avif")}
                imageSizes={HERO_PORTRAIT_SIZES}
              />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden grid-cols-6 items-end md:grid"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <DecorativePicture
                  key={n}
                  className="block w-full min-w-0"
                  width={682}
                  height={1024}
                  imgClassName="h-auto max-h-[42vh] w-full select-none object-contain object-bottom"
                  sources={[
                    {
                      type: "image/avif",
                      media: DESKTOP_MEDIA,
                      srcSet: heroPortraitSrcSet(n, "avif"),
                      sizes: HERO_PORTRAIT_SIZES,
                    },
                    {
                      type: "image/webp",
                      media: DESKTOP_MEDIA,
                      srcSet: heroPortraitSrcSet(n, "webp"),
                      sizes: HERO_PORTRAIT_SIZES,
                    },
                    {
                      type: "image/png",
                      media: DESKTOP_MEDIA,
                      srcSet: heroPortraitSrcSet(n, "png"),
                      sizes: HERO_PORTRAIT_SIZES,
                    },
                  ]}
                />
              ))}
            </div>
          </>
        }
      >
        {/* Hero copy not wrapped in SlideContent so it’s always visible */}
        <div className="text-center">
          <h1
            data-no-orphan-opt-out="true"
            className="mx-auto mb-4 max-w-3xl text-balance text-lg font-semibold leading-snug text-brand-900 md:mb-6 md:text-2xl"
          >
            Nic Haralambous, keynote speaker on team performance in the age of AI
          </h1>
          <h2
            className="heading-stroke font-extrabold tracking-tight text-[clamp(2rem,6vw,5.5rem)] uppercase leading-[0.95] text-accent-600"
          >
            THE OUTPUT PARADOX
          </h2>
          {/* Body + CTAs — centered below the headline */}
          <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center md:mt-6">
            <div className="flex flex-col gap-6 text-center [text-shadow:0_1px_2px_rgba(247,247,245,0.9)]">
              {/* Hook — the thesis, largest and boldest.
                  Non-breaking spaces keep trailing words from wrapping alone. */}
              <p className="text-balance text-xl font-bold leading-tight text-brand-900 md:text-3xl">
                Your teams are shipping more, but they&apos;re
                checking&nbsp;out.
                <br />
                Productivity is up. Activity is&nbsp;up.
                <br />
                But&nbsp;
                <span className="text-accent-600">
                  engagement is&nbsp;down.
                </span>
              </p>
              {/* Symptoms — the problem, medium weight */}
              <p className="text-balance text-base leading-relaxed text-brand-700 md:text-xl">
                It&apos;s not Artificial Intelligence you need to
                worry&nbsp;about.
                <br />
                It&apos;s&nbsp;
                <span className="font-semibold text-brand-900">
                  Apathy and&nbsp;Indifference.
                </span>
              </p>
              {/* Offer — set apart with a mono kicker */}
              <div>
                <span className="font-mono text-sm font-semibold tracking-widest text-accent-600">
                  THE KEYNOTE
                </span>
                <p className="mt-2 text-base font-medium leading-relaxed text-brand-900 md:text-lg">
                  The Output Paradox &mdash; How to reengage teams in the age of
                  AI.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row md:mt-6">
              <CTAButton
                href={getKeynoteBookingUrl(OUTPUT_PARADOX_SLUG)}
                className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
              >
                Book This Talk
              </CTAButton>
              <CTAButton
                href={`/keynotes/${OUTPUT_PARADOX_SLUG}`}
                variant="secondary"
                className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
              >
                See The Keynote
              </CTAButton>
            </div>
          </div>
        </div>
      </Slide>

      {/* Slide 2: What Nic speaks about — three topic pillars */}
      <Slide
        variant="grid-3"
        background="bg-mic-pattern"
        id="keynotes"
        image={
          <DecorativePicture
            className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-[58.5vh] w-auto md:block"
            width={521}
            height={1410}
            loading="lazy"
            imgClassName="h-full w-auto select-none object-contain object-bottom"
            sources={[
              {
                media: DESKTOP_MEDIA,
                srcSet: "/slides/Nic_16_bit_slide_2_Landing.png",
              },
            ]}
          />
        }
      >
        <SlideContent>
          <h2 className="heading-stroke font-extrabold tracking-tight pt-[22px] pb-[22px] text-center text-[clamp(1.75rem,8vw,2.25rem)] uppercase leading-[0.95] text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            What Nic Speaks About
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "TOPIC_01",
                title: "Activating Human Agency",
                body: "I help people and teams move from passive compliance to ownership and initiative, even inside large organisations.",
                output: "OWNERSHIP",
                href: `/keynotes/${OUTPUT_PARADOX_SLUG}`,
              },
              {
                label: "TOPIC_02",
                title: "Staying Connected Without Becoming Consumed",
                body: "I help teams protect focus, energy, and mental health while working digitally, without disconnecting from what matters.",
                output: "FOCUS",
                href: "/keynotes/connected-not-consumed",
              },
              {
                label: "TOPIC_03",
                title: "Curiosity, Action and Failure",
                body: "I help organisations build entrepreneurial teams that learn fast, act with agency, and turn failure into progress, especially in the AI era.",
                output: "PROGRESS",
                href: "/keynotes/innovation-starts-at-home",
              },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="flex flex-col border border-brand-900 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-accent-600">
                    {pillar.label}
                  </span>
                  <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                </div>
                <div className="my-3 border-t border-brand-200" />
                <a href={pillar.href} className="group">
                  <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 md:text-3xl">
                    {pillar.title}
                  </h3>
                </a>
                <p className="mt-3 font-mono text-sm leading-relaxed text-brand-600">
                  {pillar.body}
                </p>
                <div className="mt-auto pt-6">
                  <div className="border-t border-brand-200 pt-4">
                    <a href={pillar.href} className="group flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-accent-600">
                        OUTPUT: {pillar.output}
                      </span>
                      <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <CTAButton
              href="/keynotes"
              variant="secondary"
              icon={<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              className="!rounded-none !border-accent-600 !text-accent-600 font-mono font-semibold tracking-[0.05em] text-base uppercase hover:!bg-accent-50"
            >
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
            <DecorativePicture
              className="pointer-events-none absolute right-3 bottom-8 z-[1] hidden h-[180px] w-auto md:block lg:h-[220px] xl:h-[260px] 2xl:h-[300px]"
              width={832}
              height={1248}
              loading="lazy"
              imgClassName="h-full w-auto select-none object-contain object-bottom"
              sources={[
                {
                  media: DESKTOP_MEDIA,
                  srcSet: "/slides/Nic_soap_16bit.png",
                },
              ]}
            />
          }
        >
          <SlideContent>
            <h2 className="heading-stroke font-extrabold tracking-tight pt-2 pb-3 text-center text-[clamp(1.9rem,4.5vw,3.6rem)] uppercase leading-[0.95] text-brand-900">
              Latest Thinking
            </h2>
            <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <a
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col border border-brand-900 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-accent-600">
                      POST_{String(i + 1).padStart(2, "0")}
                    </span>
                    <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                  </div>
                  <div className="my-3 border-t border-brand-200" />
                  <h3 className="text-xl font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 [overflow-wrap:anywhere] md:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="border-t border-brand-200 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tracking-widest text-brand-500">
                          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          {post.estimatedReadTime && ` · ${post.estimatedReadTime} min`}
                        </span>
                        <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-4 text-center">
              <CTAButton href="/blog" variant="secondary" className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Heading in place of first two cards */}
            <div className="flex items-center sm:col-span-2">
              <h2 className="heading-stroke font-extrabold tracking-tight text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-[85px]">
                Explore Topics
              </h2>
            </div>
            {/* Top-right card */}
            <LoadWhenNear
              className="relative"
              hold={
                <a
                  href={TOPIC_PREVIEWS[0].href}
                  className="group flex flex-col border border-brand-900 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-accent-600">TOPIC_01</span>
                    <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                  </div>
                  <div className="my-3 border-t border-brand-200" />
                  <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 md:text-3xl">
                    {TOPIC_PREVIEWS[0].title}
                  </h3>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-brand-600">
                    {TOPIC_PREVIEWS[0].description}
                  </p>
                  <div className="mt-auto pt-6 flex justify-end">
                    <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </a>
              }
            >
              <DecorativePicture
                className="pointer-events-none absolute bottom-full right-4 z-50"
                width={278}
                height={318}
                loading="lazy"
                imgClassName="h-24 w-auto select-none object-contain object-bottom"
                sources={[{ srcSet: "/slides/Nic_archeo_16bit.png" }]}
              />
            </LoadWhenNear>
            {/* Bottom row — 3 cards */}
            {TOPIC_PREVIEWS.slice(1).map((topic, i) => (
              i === 0 ? (
                <div key={topic.href} className="relative">
                  <DecorativePicture
                    className="pointer-events-none absolute bottom-full left-4 z-50 hidden h-36 md:block"
                    width={408}
                    height={612}
                    loading="lazy"
                    imgClassName="h-full w-auto select-none object-contain object-bottom"
                    sources={[
                      {
                        media: DESKTOP_MEDIA,
                        srcSet: "/slides/Nic_Hunting_Pickaxe.png",
                      },
                    ]}
                  />
                  <a
                    href={topic.href}
                    className="group flex flex-col border border-brand-900 bg-white p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-widest text-accent-600">TOPIC_{String(i + 2).padStart(2, "0")}</span>
                      <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                    </div>
                    <div className="my-3 border-t border-brand-200" />
                    <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 md:text-3xl">
                      {topic.title}
                    </h3>
                    <p className="mt-3 font-mono text-sm leading-relaxed text-brand-600">
                      {topic.description}
                    </p>
                    <div className="mt-auto pt-6 flex justify-end">
                      <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </a>
                </div>
              ) : (
                <a
                  key={topic.href}
                  href={topic.href}
                  className="group flex flex-col border border-brand-900 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-accent-600">TOPIC_{String(i + 2).padStart(2, "0")}</span>
                    <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
                  </div>
                  <div className="my-3 border-t border-brand-200" />
                  <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-brand-900 transition-colors group-hover:text-accent-600 md:text-3xl">
                    {topic.title}
                  </h3>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-brand-600">
                    {topic.description}
                  </p>
                  <div className="mt-auto pt-6 flex justify-end">
                    <ArrowRight className="h-4 w-4 text-accent-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </a>
              )
            ))}
          </div>
          <div className="mt-6 text-right">
            <CTAButton href="/topics" variant="secondary" className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase">
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
          <h2 className="heading-stroke font-extrabold tracking-tight text-4xl uppercase text-brand-900 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
            Want Nic at Your Next Event?
          </h2>
          <p className="mt-4 text-lg text-brand-700">
            Keynotes for conferences, corporate events, team offsites, and
            webinars, in person or virtually. Worldwide.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <CTAButton
              href="/contact"
              className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
            >
              Book Nic for Your Event
            </CTAButton>
            <CTAButton
              href="/speaker"
              variant="secondary"
              className="!rounded-none font-bold tracking-[0.02em] text-xl uppercase"
            >
              About Nic as a Speaker
            </CTAButton>
          </div>
        </SlideContent>
      </Slide>

      {/* Slide 8: Newsletter. After the booking ask so the speaking
          funnel stays first, and before the footer so it is its own slide. */}
      <Slide
        variant="cta"
        background="bg-envelope-pattern"
        className="text-center"
        id="newsletter"
      >
        <SlideContent>
          <NewsletterSignup variant="section" />
        </SlideContent>
      </Slide>

      {/* Slide 9: Footer */}
      <Slide variant="footer" background="bg-foot-pattern" id="footer">
        <FooterContent />
      </Slide>
      <NextSlideIndicator />
    </SlideDeck>
    </>
  );
}

/* ---------- Fallback data ---------- */

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
    description: "Why curiosity is the god particle of innovation, and how to build teams that never stop experimenting.",
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
    description: "How to use AI as a tool without losing your mind, or your team's creative edge.",
    href: "/topics/ai",
  },
];
