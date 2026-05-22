/**
 * Escaping the Apathy Trap — /keynotes/escaping-the-apathy-trap
 *
 * Standalone one-pager landing page sent directly to prospective clients.
 * Dedicated route (takes priority over the [slug] dynamic template)
 * because the layout is bespoke: manifesto-style hero, editorial
 * copy blocks, blockquote callouts.
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

const KEYNOTE_SLUG = "escaping-the-apathy-trap";
const HERO_VIDEO_URL = "https://youtu.be/d39zRC9pWQ8";

/* ---------- Metadata ---------- */

export const metadata: Metadata = generatePageMetadata({
  title: "Escaping the Apathy Trap — Keynote",
  description:
    "A keynote about curiosity, complacency, and what happens when powerful technology meets passive culture. For organisations rebuilding curiosity, ownership, and movement.",
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

/* ---------- Page ---------- */

export default function EscapingTheApathyTrapPage() {
  return (
    <div className="page-bg bg-spotlight-pattern">
      <JsonLd
        data={serviceJsonLd({
          name: "Escaping the Apathy Trap: A Keynote on Curiosity, Culture, and Action",
          description:
            "A keynote about curiosity, complacency, and what happens when powerful technology meets passive culture. For organisations rebuilding curiosity, ownership, and movement.",
          url: "https://nicharalambous.com/keynotes/escaping-the-apathy-trap",
        })}
      />

      {/* ── 1. Hero ── */}
      <Section width="landing" className="pt-12 text-center md:pt-20">
        <h1 className="heading-display-stroke-sm mx-auto max-w-5xl text-3xl leading-[1.1] text-brand-900 sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="block">
            The future does not belong to the companies with the best tools.
          </span>
          <span className="mt-2 block text-accent-600">
            It belongs to the ones whose people still care enough to act.
          </span>
        </h1>

        <div className="mx-auto mt-6 h-1 w-20 bg-accent-600" />

        <div className="mx-auto mt-6 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600 md:text-xl">
          <p>
            AI is changing how we work, think, build, and compete.
          </p>
          <p>
            But while technology accelerates, many organisations are
            unintentionally creating cultures where people stop questioning,
            stop experimenting, and stop taking initiative.
          </p>
          <p>
            <em>Escaping the Apathy Trap</em> is a keynote about curiosity,
            complacency, and what happens when powerful technology meets passive
            culture.
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-base font-bold uppercase tracking-[0.2em] text-accent-600">
          A keynote for organisations trying to rebuild curiosity, ownership,
          and movement.
        </p>

        {getVideoEmbedUrl(HERO_VIDEO_URL) && (
          <div className="mx-auto mt-8 max-w-5xl">
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
            Bring This Talk To Your Team
          </CTAButton>
        </div>
      </Section>

      {/* ── 2. The Trap ── */}
      <Section width="landing">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            The Trap
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            <span className="block">
              Apathy doesn&rsquo;t arrive all at once.
            </span>
            <span className="mt-2 block text-accent-600">
              It settles in slowly.
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-6 text-lg leading-relaxed text-brand-600">
          <p>
            Most organisations do not intentionally create passive cultures.
          </p>
          <p>But over time, many workplaces quietly reward:</p>
        </div>

        <ul className="mx-auto mt-4 max-w-4xl space-y-3">
          {[
            "agreement over curiosity",
            "process over experimentation",
            "caution over initiative",
            "predictability over movement",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-lg text-brand-700"
            >
              <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-4xl space-y-6 text-lg leading-relaxed text-brand-600">
          <p>The result is not immediate failure.</p>
          <p>
            It&rsquo;s something more dangerous: smart people slowly learning
            that action is risky and compliance is rewarded.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            Meetings can create the illusion of momentum while nothing actually
            moves.
          </blockquote>
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            The trap is not that people stop working. It&rsquo;s that they stop
            caring enough to act.
          </blockquote>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          And in the age of artificial intelligence, passive cultures become far
          more dangerous.
        </p>
      </Section>

      {/* ── 3. Why It Matters Now ── */}
      <Section width="landing">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            Why It Matters Now
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            Passive cultures become dangerous when the world speeds up.
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>AI is amplifying human behaviour.</p>
          <p>
            Curious people become more capable. Experimental teams become more
            effective. Fast learners gain leverage.
          </p>
          <p>But passive cultures struggle.</p>
          <p>
            Because when people are trained to wait, avoid risk, and seek
            permission, even powerful tools cannot create meaningful movement.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            The future belongs to organisations that can learn faster than they
            fear change.
          </blockquote>
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            Technology accelerates. Complacency compounds.
          </blockquote>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>The answer is not working harder.</p>
          <p className="font-semibold text-brand-900">
            It&rsquo;s rebuilding cultures where action feels possible again.
          </p>
        </div>
      </Section>

      {/* ── 4. The Insight ── */}
      <Section width="landing">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            The Insight
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            Alignment is not action.
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>
            Most organisations do not suffer from a lack of information. They
            suffer from a gap between knowing and doing.
          </p>
          <p>
            People know they should experiment more. Move faster. Challenge
            ideas earlier. Take initiative. Think creatively.
          </p>
          <p>
            But many workplaces unintentionally reward the opposite.
          </p>
          <p>Over time:</p>
        </div>

        <ul className="mx-auto mt-4 max-w-4xl space-y-3">
          {[
            "process replaces momentum",
            "caution replaces curiosity",
            "meetings replace movement",
            "compliance replaces contribution",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-lg text-brand-700"
            >
              <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>The result is not laziness. It is behavioural drift.</p>
          <p className="font-semibold text-brand-900">
            People contribute differently in environments that reward
            initiative.
          </p>
        </div>
      </Section>

      {/* ── 5. The Shift ── */}
      <Section width="landing">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            The Shift
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl md:text-5xl">
            Healthy cultures reward action, not just alignment.
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 text-lg leading-relaxed text-brand-600">
          <p>The solution is not chaos. And it is not removing structure.</p>
          <p>
            The organisations that thrive are often the ones that create
            environments where people:
          </p>
        </div>

        <ul className="mx-auto mt-4 max-w-4xl space-y-3">
          {[
            "experiment more freely",
            "contribute more openly",
            "challenge ideas earlier",
            "take thoughtful initiative",
            "learn faster from mistakes",
            "move before certainty arrives",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-lg text-brand-700"
            >
              <span className="mt-1.5 block h-3 w-3 shrink-0 bg-accent-600" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-8 max-w-4xl text-lg font-semibold text-brand-900">
          Curiosity is not soft. It is operational leverage.
        </p>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            People act differently in environments that reward initiative.
          </blockquote>
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            The goal is not perfection. It&rsquo;s movement.
          </blockquote>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          This keynote gives audiences a new lens on curiosity, culture, and
          action in the age of AI.
        </p>
      </Section>

      {/* ── 6. What Audiences Walk Away With ── */}
      <Section width="landing">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
            What Audiences Walk Away With
          </p>
          <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl">
            People leave seeing the hidden cost of passive culture.
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          <p className="text-lg leading-relaxed text-brand-600">
            Audiences leave with a clearer understanding of:
          </p>
          <ul className="mt-4 space-y-3">
            {[
              "why people stop taking initiative",
              "how cultures unintentionally reward passivity",
              "what happens when process replaces movement",
              "why curiosity matters more in the age of AI",
              "how incentives shape behaviour",
              "what modern organisations may be teaching people without realising it",
            ].map((item) => (
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

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          The keynote is designed to create recognition first, then movement.
        </p>

        <div className="mx-auto mt-10 max-w-4xl space-y-4">
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            The behaviours organisations reward eventually become the culture
            they inherit.
          </blockquote>
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            Passive cultures are built one small compromise at a time.
          </blockquote>
          <blockquote className="border-l-4 border-accent-600 py-2 pl-6 text-lg font-medium italic text-brand-900">
            Most people want to contribute more than their environment allows.
          </blockquote>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-relaxed text-brand-600">
          This perspective is shaped by two decades of building companies,
          leading teams, and watching how people behave inside systems.
        </p>
      </Section>

      {/* ── 7. Speaker Credibility ── */}
      <Section width="landing" className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-600">
          Your Speaker
        </p>
        <h2 className="heading-display-stroke-sm mt-4 text-3xl text-brand-900 sm:text-4xl">
          Nic Haralambous
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-brand-600">
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

      {/* ── 8. Client Logos ── */}
      <Section width="wide">
        <IncredibleClients names={CLIENT_NAMES} headingSize="section" />
      </Section>

      {/* ── 9. Testimonials ── */}
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
                <Crosshair className="h-4 w-4 text-accent-600" aria-hidden="true" />
              </div>
              <div className="my-3 border-t border-brand-200" />
              <p className="flex-1 font-mono text-sm italic leading-relaxed text-brand-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-auto pt-6 border-t border-brand-200">
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

      {/* ── 10. Booking CTA ── */}
      <FinalCta
        heading="Escape the Apathy Trap"
        description="Bring this keynote to your organisation. Virtual delivery worldwide."
        primaryHref={getKeynoteBookingUrl(KEYNOTE_SLUG)}
        primaryLabel="Bring This Talk To Your Team"
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
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}
