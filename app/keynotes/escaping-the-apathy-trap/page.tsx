/**
 * Escaping the Apathy Trap — /keynotes/escaping-the-apathy-trap
 *
 * Standalone one-pager landing page sent directly to prospective clients.
 * Dedicated route (takes priority over the [slug] dynamic template)
 * because the layout is bespoke: manifesto-style hero, framework
 * visualization, editorial copy blocks.
 *
 * JSON-LD: Service
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { CTAButton } from "@/components/cta-button";
import { FinalCta } from "@/components/final-cta";
import { IncredibleClients } from "@/components/incredible-clients";
import { JsonLd } from "@/components/json-ld";
import { generatePageMetadata, serviceJsonLd } from "@/lib/metadata";
import { getKeynoteBookingUrl } from "@/lib/keynotes-data";
import { tilt } from "@/lib/tilt";

const KEYNOTE_SLUG = "escaping-the-apathy-trap";
const HERO_VIDEO_URL = "https://youtu.be/d39zRC9pWQ8";

/* ---------- Metadata ---------- */

export const metadata: Metadata = generatePageMetadata({
  title: "Escaping the Apathy Trap — Keynote",
  description:
    "AI is making it easier than ever for organisations to mistake output for engagement. A strategic leadership keynote by Nic Haralambous on diagnosing hidden disengagement and engineering curiosity.",
  path: "/keynotes/escaping-the-apathy-trap",
});

/* ---------- Data ---------- */

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

const APATHY_ARCH_IMAGE_BASE =
  "/keynotes/escaping-the-apathy-trap/apathy-arch";

const APATHY_ARCH_IMAGE_CLASS =
  "block h-auto w-full max-w-[11rem] object-contain object-bottom sm:max-w-[12rem] md:max-w-[13rem]";

const APATHY_ARCH_STEPS: {
  label: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
}[] = [
  {
    label: "Curiosity",
    description: "Teams explore, question, and experiment",
    image: `${APATHY_ARCH_IMAGE_BASE}/01-curiosity.png`,
    imageAlt:
      "16-bit character kneeling with a magnifying glass, examining a flower under glass",
  },
  {
    label: "Boredom",
    description: "Repetition replaces exploration",
    image: `${APATHY_ARCH_IMAGE_BASE}/02-boredom.png`,
    imageAlt:
      "16-bit character slumped in a chair watching TV static with a remote",
  },
  {
    label: "Apathy",
    description: "People stop caring about outcomes",
    image: `${APATHY_ARCH_IMAGE_BASE}/03-apathy.png`,
    imageAlt:
      "16-bit character slumped at a desk, head in hand, staring at a monitor",
  },
  {
    label: "Indifference",
    description: "Engagement becomes performance",
    image: `${APATHY_ARCH_IMAGE_BASE}/04-indifference.png`,
    imageAlt:
      "16-bit character reclined at a desk, shrugging, mug labelled meh",
  },
  {
    label: "Exit",
    description: "Talent leaves or worse, disengages.",
    image: `${APATHY_ARCH_IMAGE_BASE}/05-exit.png`,
    imageAlt:
      "16-bit character carrying a box of belongings toward an open door",
    imageClassName:
      "block h-auto w-full max-w-[8.8rem] object-contain object-bottom sm:max-w-[9.6rem] md:max-w-[10.4rem]",
  },
];

const APATHY_ARCH_HEIGHTS = [
  "md:h-40",
  "md:h-52",
  "md:h-64",
  "md:h-52",
  "md:h-40",
] as const;

const OUTCOMES = [
  "Practical ways to engineer curiosity into teams and workflows",
  "Clearer engagement signals that go beyond activity metrics",
  "Frameworks for reducing organisational drag and alignment theatre",
  "Methods for building experimentation rhythms that stick",
  "Ways to rethink incentives and trust structures for the AI era",
];

const SUPPORTING_CONCEPTS = [
  {
    title: "Organisational Entropy",
    description:
      "The organisation appears functional on the surface while invisible decay spreads underneath.",
  },
  {
    title: "Alignment Theatre",
    description:
      "Meetings, communication, and collaboration metrics increase — but focus, experimentation, and original thinking decline.",
  },
  {
    title: "The Wrong AI",
    description:
      "Organisations believe Artificial Intelligence is the main conversation. The real AI problem is Apathy and Indifference.",
  },
  {
    title: "The Unread Library Effect",
    description:
      "AI creates the appearance of capability and knowledge without necessarily building understanding or original thought.",
  },
];

/* ---------- Page ---------- */

export default function EscapingTheApathyTrapPage() {
  return (
    <div className="page-bg bg-spotlight-pattern">
      <JsonLd
        data={serviceJsonLd({
          name: "Escaping the Apathy Trap: How to Increase Engagement in a Fast-Changing World",
          description:
            "AI is making it easier than ever for organisations to mistake output for engagement. A keynote on diagnosing hidden disengagement and engineering curiosity.",
          url: "https://nicharalambous.com/keynotes/escaping-the-apathy-trap",
        })}
      />

      {/* ── 1. Hero ── */}
      <Section width="content" className="pt-12 text-center md:pt-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
          Strategic Leadership Keynote
        </p>

        <h1 className="heading-display-stroke-sm mx-auto mt-8 max-w-4xl text-3xl leading-[1.1] text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="block">Escape the Apathy Trap:</span>
          <span className="mt-2 block text-accent-600">
            Lead the Change Before the Change Leads You
          </span>
        </h1>

        <div className="mx-auto mt-6 h-1 w-20 bg-accent-600" />

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-brand-600 md:text-2xl">
          AI is making it easier than ever for organisations to mistake output
          for engagement.
        </p>

        {getVideoEmbedUrl(HERO_VIDEO_URL) && (
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="aspect-video overflow-hidden border-4 border-accent-600">
              <iframe
                src={getVideoEmbedUrl(HERO_VIDEO_URL)!}
                title="Escaping the Apathy Trap — keynote preview"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <CTAButton href={getKeynoteBookingUrl(KEYNOTE_SLUG)}>
            Book This Keynote
          </CTAButton>
        </div>
      </Section>

      {/* ── 2. The Problem — what's increasing vs declining (framed) ── */}
      <Section width="wide">
        {/* Same centred measure as headings + body above—two cols sit inside it */}
        <div className="mx-auto w-full max-w-3xl space-y-0 md:max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
              The Pattern
            </p>
            <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
              <span className="block">Activity is up.</span>
              <span className="mt-2 block text-accent-600">
                Employee engagement is down.
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-600">
              Research shows that 40% of workers globally fear losing their job
              to AI. Focus efficiency has fallen to a three-year low of 60%
              with disengagement risk up 23%. While rigorous experiments show
              that high-quality AI can cause skilled workers to &ldquo;fall
              asleep at the wheel,&rdquo; and outsource critical thinking.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-brand-600">
              So yes, activity is up&hellip; but at what cost?
            </p>
          </div>

          <div className="mt-14 flex w-full flex-col gap-12 text-left md:flex-row md:gap-x-10 lg:gap-x-14">
            <div className="min-w-0 flex-1 basis-0">
              <h3 className="text-lg font-bold leading-snug text-brand-900 sm:text-xl md:min-h-[4.75rem]">
                What looks good, but isn&rsquo;t
              </h3>
              <ul className="mt-6 space-y-4 md:mt-7">
                {[
                  "Output increases",
                  "AI usage increases",
                  "More alignment meetings",
                  "Increased process",
                  "AI slop everywhere",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-lg text-brand-700"
                  >
                    <span className="mt-1.5 block h-3 w-3 shrink-0 bg-brand-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 flex-1 basis-0">
              <h3 className="text-lg font-bold leading-snug text-accent-600 sm:text-xl md:min-h-[4.75rem]">
                What you can&rsquo;t see, but is bad
              </h3>
              <ul className="mt-6 space-y-4 md:mt-7">
                {[
                  "Curiosity is down",
                  "Experimentation stops happening",
                  "Critical thinking is outsourced to AI",
                  "Staff engagement plummets",
                  "The customer is forgotten",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-lg font-medium text-brand-900"
                  >
                    <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. The Thesis ── */}
      <Section width="content" className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
          The Core Thesis
        </p>
        <h2 className="heading-display-stroke-sm mx-auto mt-8 max-w-3xl text-3xl uppercase leading-[0.95] text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
          We&rsquo;re Focusing on{" "}
          <span className="text-accent-600">the Wrong AI</span>
        </h2>
        <h3 className="heading-display-stroke-sm mx-auto mt-10 max-w-3xl text-2xl text-brand-900 sm:text-3xl md:text-4xl">
          We&rsquo;re obsessed with Artificial Intelligence when Apathy and
          Indifference are killing our businesses.
        </h3>
        <div className="mx-auto mt-8 max-w-2xl space-y-6 text-lg leading-relaxed text-brand-600">
          <p>
            Teams can now generate emails, summaries, presentations, strategy
            documents, and meeting notes without increasing curiosity, ownership,
            experimentation, or initiative.
          </p>
          <p>
            The old indicators of engagement no longer work. Output is no longer
            proof of involvement. Activity is no longer proof of care.
          </p>
          <p className="font-semibold text-brand-900">
            People are performing engagement instead of practising it.
          </p>
        </div>
      </Section>

      {/* ── 4. The Apathy Arch ── */}
      <Section width="wide">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            Signature Framework
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            The Apathy Arch
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-brand-600">
            Apathy is not sudden; it is a progressive erosion that begins with
            the loss of curiosity. Then boredom fills their spare time. Staff are
            then struck by an apathy for their work and an indifference towards
            the company, the company&rsquo;s vision, mission, and the work
            itself. Eventually, your brightest talent will exit, or worse, will
            remain at your company but disengage from the work, your customers
            and their colleagues.
          </p>
        </div>

        {/* Arch visualization */}
        <div className="mt-12 flex flex-col items-stretch gap-4 md:flex-row md:items-end md:gap-0">
          {APATHY_ARCH_STEPS.map((step, i) => {
            return (
              <div
                key={step.label}
                className={`flex min-w-0 flex-1 flex-col items-center ${
                  step.image ? "justify-end gap-0" : ""
                }`}
              >
                {step.image && step.imageAlt && (
                  <div className="flex w-full justify-center leading-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className={step.imageClassName ?? APATHY_ARCH_IMAGE_CLASS}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                <div
                  className={`flex w-full flex-col justify-end border-2 text-center transition-colors ${APATHY_ARCH_HEIGHTS[i]} ${
                    step.image
                      ? "px-4 pb-4 pt-0 md:px-6 md:pb-6 md:pt-0"
                      : "p-4 md:p-6"
                  } border-brand-200 bg-white`}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-lg font-bold text-brand-900 md:text-xl">
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm text-brand-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting concepts */}
        <p className="mx-auto mt-16 max-w-3xl text-center text-lg font-semibold leading-relaxed text-brand-900 md:text-xl">
          When the Apathy Arch is left unchecked, the slow erosion of your
          organisation begins with:
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {SUPPORTING_CONCEPTS.map((concept) => (
            <div
              key={concept.title}
              className="border-l-4 border-accent-600 py-2 pl-6"
            >
              <h3 className="text-base font-bold text-brand-900">
                {concept.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-brand-600">
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. Audience Outcomes ── */}
      <Section width="content">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            What Your Team Gets
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl">
            Teams Leave With
          </h2>
        </div>

        <ul className="mx-auto mt-10 max-w-2xl space-y-5">
          {OUTCOMES.map((outcome, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-lg text-brand-700">{outcome}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 6. Speaker Credibility ── */}
      <Section width="content" className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
          Your Speaker
        </p>
        <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl">
          Nic Haralambous
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-600">
          Entrepreneur, product builder, and keynote speaker focused on the
          intersection of technology and human behaviour. Three business exits.
          Products scaled to millions of users. Two decades inside both startups
          and corporates.
        </p>

        <p className="mx-auto mt-4 max-w-xl text-base font-medium italic text-brand-500">
          &ldquo;Why do smart, capable people stop showing up?&rdquo;
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-brand-400">
          <span>3 Business Exits</span>
          <span>Millions of Users</span>
          <span>20+ Years</span>
          <span>Global Speaker</span>
        </div>
      </Section>

      {/* ── 7. Client Logos ── */}
      <Section width="wide">
        <IncredibleClients names={CLIENT_NAMES} headingSize="section" />
      </Section>

      {/* ── 8. Testimonials ── */}
      <Section width="wide">
        <div className="text-center">
          <h2 className="heading-display-stroke-sm text-center text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            What clients say
          </h2>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.company}
              className="flex flex-col card-brutalist p-6"
              style={{ transform: `rotate(${tilt(i, 42)}deg)` }}
            >
              <p className="flex-1 text-sm italic leading-relaxed text-brand-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-brand-100 pt-4">
                <p className="text-sm font-semibold text-brand-900">
                  {t.company}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* ── 9. Booking CTA ── */}
      <FinalCta
        heading="Escape the Apathy Trap"
        description="Bring this keynote to your organisation. Virtual delivery worldwide."
        primaryHref={getKeynoteBookingUrl(KEYNOTE_SLUG)}
        primaryLabel="Book This Keynote"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </div>
  );
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
