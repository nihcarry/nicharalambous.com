/**
 * The Output Paradox — /keynotes/output-paradox-reengage-teams
 *
 * Standalone one-pager landing page sent directly to prospective clients.
 * Dedicated route (takes priority over the [slug] dynamic template)
 * because the layout is bespoke: full-bleed dark bands alternating with
 * light editorial sections, a paradox ledger, signal cards, and the
 * illustrated five-stage Apathy Arch.
 *
 * JSON-LD: Service
 */
import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/section";
import { CTAButton } from "@/components/cta-button";
import { FinalCta } from "@/components/final-cta";
import { IncredibleClients } from "@/components/incredible-clients";
import { JsonLd } from "@/components/json-ld";
import { generatePageMetadata, serviceJsonLd } from "@/lib/metadata";
import { getKeynoteBookingUrl } from "@/lib/keynotes-data";
import { Crosshair, TrendingDown, TrendingUp } from "lucide-react";

const KEYNOTE_SLUG = "output-paradox-reengage-teams";
const ARCH_IMAGE_BASE = `/keynotes/${KEYNOTE_SLUG}/apathy-arch`;
const PREVIEW_VIDEO_URL = "https://youtu.be/U0xubG3VP2w";

/* ---------- Metadata ---------- */

export const metadata: Metadata = generatePageMetadata({
  title: "The Output Paradox — Keynote",
  description:
    "Your teams are shipping more. They're also checking out. A keynote on how to reengage teams in the age of AI — when productivity is up, activity is up, and engagement is down.",
  path: "/keynotes/output-paradox-reengage-teams",
});

/* ---------- Data ---------- */

const LEDGER = [
  { label: "Productivity", direction: "Up" as const },
  { label: "Activity", direction: "Up" as const },
  { label: "Engagement", direction: "Down" as const },
];

const SIGNALS = [
  {
    heading: "In what gets rewarded",
    items: [
      "Speed rewarded over thinking",
      "Curiosity punished instead of rewarded",
    ],
  },
  {
    heading: "In how people show up",
    items: [
      "\u201CStay in my lane\u201D as the quiet internal motto",
      "Teams waiting instead of initiating",
      "Top talent quietly underperforming after being put in their place",
    ],
  },
  {
    heading: "In how leaders respond",
    items: [
      "Endless alignment meetings with no ownership of outcomes",
      "Leadership talking innovation while changing nothing",
      "Managers protecting comfort over momentum",
    ],
  },
];

const STATS = [
  { value: "1,111", label: "companies studied" },
  { value: "443M", label: "hours of real workplace behaviour analysed" },
  { value: "3-year low", label: "in focus time, right as AI adoption climbed" },
];

const ARCH_STAGES = [
  {
    name: "Curiosity",
    file: "01-curiosity.png",
    alt: "A person crouching with a magnifying glass, closely inspecting a flower under a glass dome",
    bar: "bg-accent-600/20",
  },
  {
    name: "Boredom",
    file: "02-boredom.png",
    alt: "A person slumped in an armchair holding a remote, staring at a static-filled television",
    bar: "bg-accent-600/40",
  },
  {
    name: "Apathy",
    file: "03-apathy.png",
    alt: "A person resting their head on one hand at a desk, disengaged from the monitor in front of them",
    bar: "bg-accent-600/60",
  },
  {
    name: "Indifference",
    file: "04-indifference.png",
    alt: "A person leaning back with feet on the desk, shrugging beside a mug that reads meh",
    bar: "bg-accent-600/80",
  },
  {
    name: "Exit",
    file: "05-exit.png",
    alt: "A person carrying a cardboard box of personal belongings out through an open office door",
    bar: "bg-accent-600",
  },
];

const SHIFTS = [
  {
    title: "Rewire what you reward.",
    body: "Stop rewarding speed and calling it culture.",
  },
  {
    title: "Fix placement, not performance.",
    body: "Most disengagement isn\u2019t a person problem. It\u2019s a seat problem.",
  },
  {
    title: "Make curiosity a practice, not a poster.",
    body: "Small bets, short cycles, permission to be wrong.",
  },
];

const TAKEAWAYS = [
  "A clear read on what your organisation actually rewards, versus what it says it values",
  "A map of where your people sit on the Apathy Arch, and why that\u2019s a structure problem, not a performance one",
  "A working model for turning curiosity into action, without waiting for permission",
  "One change your team can make in the room, before the applause stops",
];

const TESTIMONIALS = [
  {
    quote:
      "Thank you for bringing such important insights, energy, and engagement to a topic that truly matters to our team.",
    company: "Outsystems",
  },
  {
    quote:
      "The message shared by Nic was insightful and inspirational. Definitely helped me with finding new approaches to lead my team.",
    company: "First Technologies",
  },
  {
    quote:
      "What a brilliant speaker. Engaging, professional and incredibly knowledgeable about the innovation space.",
    company: "Motus",
  },
];

const CLIENT_NAMES = [
  "SXSW",
  "CNBC Africa",
  "Coronation",
  "Danone",
  "EO",
  "First Technology",
  "Motus",
  "Wipfli",
  "Standard Bank",
  "Vodacom",
  "FNB",
  "Yoco",
  "Old Mutual",
  "Nedbank",
];

/* ---------- Page ---------- */

export default function OutputParadoxPage() {
  return (
    <div className="page-bg bg-spotlight-pattern">
      <JsonLd
        data={serviceJsonLd({
          name: "The Output Paradox: How to Reengage Teams in the Age of AI",
          description:
            "Your teams are shipping more. They're also checking out. A keynote on how to reengage teams in the age of AI — when productivity is up, activity is up, and engagement is down.",
          url: "https://nicharalambous.com/keynotes/output-paradox-reengage-teams",
        })}
      />

      {/* ── 1. Hero — full-bleed dark, runs up behind the floating nav ── */}
      <Section
        width="full"
        className="relative overflow-hidden bg-brand-900 md:-mt-[var(--header-clearance)] md:pt-[calc(var(--header-clearance)+3rem)]"
      >
        {/* Stage cut-out — desktop only; bottom-anchored on the right as in mockup */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[min(46vw,30rem)] md:block lg:w-[min(42vw,34rem)]">
          <Image
            src="/slides/nic-hero-3.png"
            alt="Nic Haralambous mid-keynote, gesturing with a presentation clicker"
            width={682}
            height={1024}
            priority
            className="absolute bottom-0 right-0 h-[92%] w-auto max-w-none select-none object-contain object-bottom"
          />
        </div>

        <div className="container-landing relative z-10">
          <p className="font-mono text-xs tracking-widest text-accent-400">
            KEYNOTE_01 &nbsp;//&nbsp; 45-60 MIN &nbsp;//&nbsp; VIRTUAL OR
            IN-PERSON
          </p>

          <h1 className="mt-6 max-w-3xl font-extrabold uppercase leading-[0.85] tracking-tight text-[clamp(2.75rem,12vw,7.5rem)]">
            <span className="block text-white">The Output</span>
            <span className="heading-stroke-white block text-brand-900">
              Paradox
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-xl font-medium text-accent-400 sm:text-2xl md:text-3xl">
            How to reengage teams in the age of AI
          </p>

          <p className="mt-8 max-w-xl text-xl leading-relaxed text-brand-100 md:text-2xl">
            Your teams are shipping more.
            <br />
            But they&rsquo;re also checking out faster than&nbsp;ever.
          </p>

          {/* Paradox ledger — sits under the cut-out on the right, as in the mockup */}
          <div className="mt-10 grid max-w-3xl grid-cols-1 border-y border-brand-700 sm:grid-cols-3 sm:divide-x sm:divide-brand-700">
            {LEDGER.map((cell) => {
              const isDown = cell.direction === "Down";
              const Icon = isDown ? TrendingDown : TrendingUp;
              return (
                <div
                  key={cell.label}
                  className="flex items-center justify-between gap-4 border-b border-brand-700 px-1 py-5 last:border-b-0 sm:block sm:border-b-0 sm:px-6 sm:py-6 sm:first:pl-1"
                >
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-400">
                    {cell.label}
                  </p>
                  <p
                    className={`flex items-center gap-2 text-2xl font-extrabold uppercase tracking-tight sm:mt-3 sm:text-3xl ${
                      isDown ? "text-accent-400" : "text-white"
                    }`}
                  >
                    <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {cell.direction}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-lg font-semibold text-white md:text-xl">
            That&rsquo;s the Output Paradox.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <CTAButton href={getKeynoteBookingUrl(KEYNOTE_SLUG)}>
              Book a Call
            </CTAButton>
            <CTAButton href="/speaker" variant="secondary">
              About Nic as a Speaker
            </CTAButton>
          </div>
        </div>
      </Section>

      {/*
        Alignment rule for this page:
        - Headings + prose → container-landing (one shared left edge)
        - Card / illustration grids → container-wide (intentionally wider)
        Never nest containers; never put a left-aligned title in wide alone.
      */}

      {/* ── 2. Preview video ── */}
      {getVideoEmbedUrl(PREVIEW_VIDEO_URL) && (
        <Section width="landing">
          <div className="aspect-video overflow-hidden border-4 border-accent-600">
            <iframe
              src={getVideoEmbedUrl(PREVIEW_VIDEO_URL)!}
              title="The Output Paradox — keynote preview"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Section>
      )}

      {/* ── 3. 1 in 4 ── */}
      <Section width="landing">
        <div className="grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-12">
          <p
            className="heading-stroke font-extrabold uppercase leading-[0.85] tracking-tight text-accent-600 text-[clamp(3.5rem,14vw,7rem)]"
            aria-hidden="true"
          >
            1 in 4
          </p>
          <div>
            <p className="text-xl leading-relaxed text-brand-700 md:text-2xl">
              Nearly 1 in 4 of your employees is disengaged right now. You
              can&rsquo;t see it clearly because AI is masking the signal. More
              documents. Bigger roadmaps. More meetings about work nobody reads.
              Everything looks busy. Something still feels off.
            </p>
            <p className="mt-4 font-mono text-xs tracking-widest text-brand-400">
              <a
                href="https://www.activtrak.com/resources/state-of-the-workplace/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-600 hover:decoration-brand-500"
              >
                Source: ActivTrak State of the Workplace
              </a>
            </p>
          </div>
        </div>
      </Section>

      {/* ── 4. It looks like this ── */}
      <Section width="full">
        <div className="container-landing">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            The Output Paradox looks like this:
          </h2>
        </div>

        <div className="container-wide mt-10 grid gap-6 md:grid-cols-3">
          {SIGNALS.map((signal, i) => (
            <div
              key={signal.heading}
              className="flex flex-col border border-brand-900 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-accent-600">
                  SIGNAL_{String(i + 1).padStart(2, "0")}
                </span>
                <Crosshair
                  className="h-4 w-4 text-accent-600"
                  aria-hidden="true"
                />
              </div>
              <div className="my-3 border-t border-brand-200" />
              <h3 className="text-xl font-extrabold uppercase leading-tight tracking-tight text-brand-900">
                {signal.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {signal.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-brand-700"
                  >
                    <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. The wrong AI — full-bleed dark, cut-out pinned to section floor ── */}
      <Section width="full" className="relative overflow-hidden bg-brand-900">
        {/* Absolute to the section so he sits on the true bottom edge and
            fills the left column height — not the padded content box. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[min(48vw,32rem)] md:block lg:w-[min(44vw,36rem)]"
        >
          <Image
            src="/slides/nic-hero-5.png"
            alt=""
            width={682}
            height={1024}
            className="absolute bottom-0 left-0 h-full w-auto max-w-none select-none object-contain object-left-bottom"
          />
        </div>

        <div className="container-wide relative z-10">
          {/* ml tracks the figure width against the centered container so the
              gap stays tight (~2–3rem) instead of growing on wide screens. */}
          <div className="md:ml-[max(0px,calc(28rem-((100vw-72rem)/2)))]">
            <p className="max-w-3xl text-lg leading-relaxed text-brand-200 md:text-xl">
              People aren&rsquo;t going deep. They&rsquo;re phoning it in. AI
              talks to AI. Roadmaps keep moving.
            </p>

            <p className="mt-8 max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              Artificial Intelligence won&rsquo;t kill your business. It&rsquo;s
              the other AI you should be worried about:
              <br />
              <span className="whitespace-nowrap text-accent-400">
                Apathy and Indifference.
              </span>
            </p>

            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-brand-200">
              If that sounds like your team, you already feel this. You just
              didn&rsquo;t have the words for it yet.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 5. The data ── */}
      <Section width="landing">
        <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
          The data says the same thing
        </h2>

        <p className="mt-8 max-w-4xl text-2xl font-medium leading-snug text-brand-900 sm:text-3xl md:text-4xl">
          After AI adoption, email, chat, and collaboration climb hard. Focus
          time drops. Disengagement risk rises with it.{" "}
          <span className="text-accent-600">
            Output gets louder. Attention gets thinner.
          </span>
        </p>

        <div className="mt-14">
          <p className="font-mono text-xs tracking-widest text-accent-600">
            WHAT THAT&rsquo;S BASED ON
          </p>

          <div className="mt-5 grid border-y border-brand-300 sm:grid-cols-3 sm:divide-x sm:divide-brand-200">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="border-b border-brand-200 py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:py-6 sm:first:pl-0"
              >
                <p className="heading-display text-2xl text-brand-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-brand-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 6. Statement — full-bleed dark ── */}
      <Section width="full" className="bg-brand-900">
        <div className="container-landing">
          <p className="max-w-4xl text-3xl font-medium leading-[1.15] text-white sm:text-4xl md:text-5xl">
            Passivity is the brain&rsquo;s default. Your people aren&rsquo;t
            choosing apathy. They&rsquo;re reverting to it.
          </p>
          <p className="mt-6 font-mono text-xs tracking-widest text-brand-400">
            Source: &ldquo;The law of least mental effort&rdquo; (Patzelt, Kool,
            Millner &amp; Gershman, Harvard, Scientific Reports, 2019)
          </p>
          <p className="mt-10 max-w-3xl text-lg font-medium text-accent-400 md:text-xl">
            The question is whether your organisation is fighting that default,
            or feeding it.
          </p>
        </div>
      </Section>

      {/* ── 7. The Apathy Arch + Busy is not bought in ── */}
      <Section width="full">
        <div className="container-landing">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            The Apathy Arch
          </h2>
        </div>

        <ol className="container-wide mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {ARCH_STAGES.map((stage, i) => (
            <li key={stage.name} className="flex flex-col">
              <span className="font-mono text-xs tracking-widest text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={`mt-2 h-1 w-full ${stage.bar}`} />
              <div className="mt-5 flex h-28 items-end sm:h-36">
                <Image
                  src={`${ARCH_IMAGE_BASE}/${stage.file}`}
                  alt={stage.alt}
                  width={330}
                  height={300}
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
              <p className="mt-4 text-sm font-extrabold uppercase tracking-tight text-brand-900 sm:text-base">
                {stage.name}
              </p>
            </li>
          ))}
        </ol>

        <div className="container-landing mt-14">
          <h3 className="text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">
            Busy is not bought in
          </h3>

          <div className="mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-brand-600">
            <p>
              Alignment theatre is rising: meetings, messages, and collaboration
              metrics go up while focus time collapses. People perform
              engagement. They don&rsquo;t practise it.
            </p>
            <p>
              The Apathy Trap is quieter and more dangerous than a bad quarter.
              Curiosity doesn&rsquo;t vanish overnight. It erodes because it
              gets ignored: curiosity vanishes, then boredom arrives, then
              apathy takes hold, and indifference dominates.
            </p>
            <p>
              By the time your best people check out, you&rsquo;re already too
              late. AI often speeds up the slide, because easy work replaces
              hard thinking.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 8. Where the fix starts — full-bleed dark ── */}
      <Section width="full" className="bg-brand-900">
        <div className="container-landing">
          <h2 className="heading-display text-3xl text-white sm:text-4xl md:text-5xl">
            Where the fix starts
          </h2>

          <p className="mt-4 max-w-3xl text-xl font-medium text-accent-400 sm:text-2xl">
            Three shifts. Not eight action items.
          </p>
        </div>

        <div className="container-wide mt-10 grid gap-6 md:grid-cols-3">
          {SHIFTS.map((shift, i) => (
            <div
              key={shift.title}
              className="flex flex-col border border-brand-900 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-accent-600">
                  SHIFT_{String(i + 1).padStart(2, "0")}
                </span>
                <Crosshair
                  className="h-4 w-4 text-accent-600"
                  aria-hidden="true"
                />
              </div>
              <div className="my-3 border-t border-brand-200" />
              <h3 className="text-xl font-extrabold leading-tight tracking-tight text-brand-900">
                {shift.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-brand-700">
                {shift.body}
              </p>
            </div>
          ))}
        </div>

        <div className="container-landing mt-10">
          <p className="max-w-3xl text-lg font-semibold leading-relaxed text-white">
            None of this is inspiration. It&rsquo;s a way in.
          </p>
        </div>
      </Section>

      {/* ── 9. What your team leaves with ── */}
      <Section width="full">
        <div className="container-landing">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            What your team leaves with
          </h2>
        </div>

        <div className="container-wide mt-10 grid gap-6 sm:grid-cols-2">
          {TAKEAWAYS.map((item, i) => (
            <div
              key={item}
              className="flex gap-5 border border-brand-900 bg-white p-6"
            >
              <p className="heading-display shrink-0 text-4xl text-accent-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-base leading-relaxed text-brand-700 sm:text-lg">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="container-landing mt-10">
          <p className="max-w-3xl text-lg font-semibold leading-relaxed text-brand-900">
            You can&rsquo;t outsource curiosity to a tool. The fix is structural:
            incentives, trust, and room to think.
          </p>
        </div>
      </Section>

      {/* ── 10. Book this talk ── */}
      <Section width="landing" className="text-center">
        <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
          Book this talk
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-brand-600">
          If your team is doing more and feeling less, this is the conversation
          they need next.
        </p>
        <div className="mt-8">
          <CTAButton href={getKeynoteBookingUrl(KEYNOTE_SLUG)}>
            Book a Call
          </CTAButton>
        </div>
      </Section>

      {/* ── 11. Client logos ── */}
      <Section width="wide">
        <IncredibleClients names={CLIENT_NAMES} headingSize="section" />
      </Section>

      {/* ── 12. Testimonials ── */}
      <Section width="wide">
        <h2 className="heading-display-stroke-sm text-center text-3xl text-brand-900 sm:text-4xl md:text-5xl">
          What clients say
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.company}
              className="flex flex-col border border-brand-900 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-accent-600">
                  TESTIMONIAL_{String(i + 1).padStart(2, "0")}
                </span>
                <Crosshair
                  className="h-4 w-4 text-accent-600"
                  aria-hidden="true"
                />
              </div>
              <div className="my-3 border-t border-brand-200" />
              <p className="flex-1 font-mono text-sm italic leading-relaxed text-brand-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-auto border-t border-brand-200 pt-6">
                <div className="pt-4">
                  <p className="text-sm font-semibold text-brand-900">
                    {t.company}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* ── 13. Final CTA ── */}
      <FinalCta
        heading="The Output Paradox"
        description="If your team is doing more and feeling less, this is the conversation they need next."
        primaryHref={getKeynoteBookingUrl(KEYNOTE_SLUG)}
        primaryLabel="Book a Call"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
        contentWidth="landing"
      />
    </div>
  );
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
