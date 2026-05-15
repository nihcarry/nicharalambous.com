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
import { tilt } from "@/lib/tilt";

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

const APATHY_ARCH_STEPS = [
  { label: "Curiosity", description: "Teams explore, question, and experiment" },
  { label: "Boredom", description: "Repetition replaces exploration" },
  { label: "Apathy", description: "People stop caring about outcomes" },
  { label: "Indifference", description: "Engagement becomes performance" },
  { label: "Exit", description: "Talent leaves — or worse, stays and disengages" },
];

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
          Escaping the Apathy Trap:{" "}
          <span className="text-accent-600">
            How to Increase Engagement in a Fast-Changing World
          </span>
        </h1>

        <div className="mx-auto mt-6 h-1 w-20 bg-accent-600" />

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-brand-600 md:text-2xl">
          AI is making it easier than ever for organisations to mistake output
          for engagement.
        </p>

        <div className="mt-8">
          <CTAButton href="/contact">Book This Keynote</CTAButton>
        </div>
      </Section>

      {/* ── 2. The Problem — what's increasing vs declining (framed) ── */}
      <Section width="wide">
        <div className="mx-auto max-w-3xl text-center md:max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            The Pattern
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            Activity is up. Engagement is quietly down.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-brand-600">
            This isn&rsquo;t two different companies &mdash; it&rsquo;s most
            knowledge-work teams right now. Generative AI makes it easier to
            ship visible work, fill calendars, and show &ldquo;velocity&rdquo;
            on the left. The behaviours on the right are harder to spot on a
            dashboard, so they can erode while leadership still reads the org as
            healthy. The talk starts here: recognising the split before apathy
            hardens into indifference.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="heading-display text-sm font-bold uppercase tracking-[0.15em] text-brand-400">
              What&rsquo;s Increasing
            </h3>
            <p className="mt-2 text-sm text-brand-500">
              What shows up in updates, tools, and leadership packs.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Visible activity",
                "AI tool adoption",
                "Meetings and communication",
                "Output and deliverables",
                "Process and reporting",
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

          <div>
            <h3 className="heading-display text-sm font-bold uppercase tracking-[0.15em] text-accent-600">
              What&rsquo;s Declining
            </h3>
            <p className="mt-2 text-sm text-brand-500">
              What actually determines whether people keep showing up.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Curiosity",
                "Experimentation",
                "Agency and ownership",
                "Engagement",
                "Original thinking",
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
          <p className="mx-auto mt-4 max-w-xl text-base text-brand-500">
            Apathy is not sudden. It is progressive erosion.
          </p>
        </div>

        {/* Arch visualization */}
        <div className="mt-12 flex flex-col items-stretch gap-4 md:flex-row md:items-end md:gap-0">
          {APATHY_ARCH_STEPS.map((step, i) => {
            const heights = [
              "md:h-40",
              "md:h-52",
              "md:h-64",
              "md:h-52",
              "md:h-40",
            ];
            const isCenter = i === 2;
            return (
              <div
                key={step.label}
                className={`flex flex-1 flex-col justify-end border-2 p-4 text-center transition-colors md:p-6 ${heights[i]} ${
                  isCenter
                    ? "border-accent-600 bg-accent-50"
                    : "border-brand-200 bg-white"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isCenter ? "text-accent-600" : "text-brand-400"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p
                  className={`mt-2 text-lg font-bold ${
                    isCenter ? "text-accent-600" : "text-brand-900"
                  } md:text-xl`}
                >
                  {step.label}
                </p>
                <p className="mt-1 text-sm text-brand-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Supporting concepts */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
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
        primaryHref="/contact"
        primaryLabel="Book This Keynote"
        secondaryHref="/speaker"
        secondaryLabel="About Nic as a Speaker"
      />
    </div>
  );
}
