/**
 * The Output Paradox — /keynotes/output-paradox-reengage-teams
 *
 * Standalone one-pager landing page sent directly to prospective clients.
 * Dedicated route (takes priority over the [slug] dynamic template)
 * because the layout is bespoke: manifesto-style hero, editorial
 * copy blocks, stat callouts, and pull-quote treatment.
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
import { Crosshair } from "lucide-react";

const KEYNOTE_SLUG = "output-paradox-reengage-teams";

/* ---------- Metadata ---------- */

export const metadata: Metadata = generatePageMetadata({
  title: "The Output Paradox — Keynote",
  description:
    "Your teams are shipping more. They're also checking out. A keynote on how to reengage teams in the age of AI — when productivity is up, activity is up, and engagement is down.",
  path: "/keynotes/output-paradox-reengage-teams",
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

const STATS = [
  { value: "1,111", label: "companies studied" },
  { value: "443M", label: "hours of real workplace behaviour analysed" },
  { value: "3-year low", label: "in focus time, right as AI adoption climbed" },
];

const LOOKS_LIKE = [
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
      '"Stay in my lane" as the quiet internal motto',
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

const TAKEAWAYS = [
  "A clear read on what your organisation actually rewards, versus what it says it values",
  "A map of where your people sit on the Apathy Arch, and why that's a structure problem, not a performance one",
  "A working model for turning curiosity into action, without waiting for permission",
  "One change your team can make in the room, before the applause stops",
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

      {/* ── 1. Hero ── */}
      <Section width="landing" className="pt-12 text-center md:pt-20">
        <h1 className="heading-display-stroke-sm mx-auto max-w-5xl text-3xl leading-[1.1] text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
          The Output Paradox
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-xl font-medium text-accent-600 sm:text-2xl md:text-3xl">
          How to reengage teams in the age of AI
        </p>

        <div className="mx-auto mt-6 h-1 w-20 bg-accent-600" />

        <div className="mx-auto mt-6 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600 md:text-xl">
          <p>Your teams are shipping more. They&rsquo;re also checking out.</p>
          <p>
            Productivity is up. Activity is up. Engagement is down.
            That&rsquo;s the Output Paradox.
          </p>
          <p>
            Nearly 1 in 4 of your employees is disengaged right now. You
            can&rsquo;t see it clearly because AI is masking the signal. More
            documents. Bigger roadmaps. More meetings about work nobody reads.
            Everything looks busy. Something still feels off.
          </p>
        </div>

        <div className="mt-8">
          <CTAButton href={getKeynoteBookingUrl(KEYNOTE_SLUG)}>
            Book a Call
          </CTAButton>
        </div>
      </Section>

      {/* ── 2. It looks like this ── */}
      <Section width="landing">
        <div className="text-center">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            It looks like this
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-10">
          {LOOKS_LIKE.map((group) => (
            <div key={group.heading}>
              <h3 className="text-lg font-semibold text-brand-900 sm:text-xl">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-lg text-brand-700"
                  >
                    <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>
            People aren&rsquo;t going deep. They&rsquo;re phoning it in. AI
            talks to AI. Roadmaps keep moving. The wrong AI isn&rsquo;t
            Artificial Intelligence. It&rsquo;s Apathy and Indifference.
          </p>
          <p>
            If that sounds like your team, you already feel this. You just
            didn&rsquo;t have the words for it yet.
          </p>
          <p className="font-semibold text-brand-900">
            This isn&rsquo;t a vibe. It&rsquo;s already in the building.
          </p>
        </div>
      </Section>

      {/* ── 3. The data says the same thing ── */}
      <Section width="landing">
        <div className="text-center">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            The data says the same thing
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.value} className="text-center">
              <p className="heading-display-stroke-sm text-4xl text-brand-900 sm:text-5xl md:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-base leading-snug text-brand-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>
            After AI adoption, email, chat, and collaboration climb hard.
            Focus time drops. Disengagement risk rises with it. Output gets
            louder. Attention gets thinner.
          </p>
        </div>

        <blockquote className="mx-auto mt-12 max-w-4xl border-l-4 border-accent-600 py-2 pl-6 text-2xl font-medium italic leading-snug text-brand-900 sm:text-3xl md:text-4xl">
          &ldquo;Passivity is the brain&rsquo;s default. Your people
          aren&rsquo;t choosing apathy. They&rsquo;re reverting to it.&rdquo;
        </blockquote>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          The question is whether your organisation is fighting that default,
          or feeding it.
        </p>
      </Section>

      {/* ── 4. Busy is not bought in ── */}
      <Section width="landing">
        <div className="text-center">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            Busy is not bought in
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>
            Alignment theatre is rising: meetings, messages, and collaboration
            metrics go up while focus time collapses. People perform
            engagement. They don&rsquo;t practise it.
          </p>
          <p>
            The Apathy Trap is quieter and more dangerous than a bad quarter.
            Curiosity doesn&rsquo;t vanish overnight. It erodes: curiosity,
            then boredom, then apathy, then indifference. By the time your best
            people check out, you&rsquo;re already late. AI often speeds up the
            slide, because easy work replaces hard thinking.
          </p>
        </div>
      </Section>

      {/* ── 5. What your team leaves with ── */}
      <Section width="landing">
        <div className="text-center">
          <h2 className="heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            What your team leaves with
          </h2>
        </div>

        <ul className="mx-auto mt-8 max-w-4xl space-y-3">
          {TAKEAWAYS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-lg text-brand-700"
            >
              <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          You can&rsquo;t outsource curiosity to a tool. The fix is structural:
          incentives, trust, and room to think.
        </p>
      </Section>

      {/* ── 6. Book this talk ── */}
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

      {/* ── 9. Booking CTA ── */}
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
