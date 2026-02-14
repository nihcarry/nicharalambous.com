/**
 * Individual Keynote Page — /keynotes/{slug}
 *
 * Dynamic page for each keynote. Per SEO strategy:
 * - H1: "{Keynote Title} — Virtual Keynote"
 * - Title tag: "{Keynote Title} | Virtual Keynote by Nic Haralambous"
 * - Sections: tagline, description, outcomes, audiences, testimonials, CTA
 * - Every keynote page links to /speaker and related topic hub
 *
 * JSON-LD: Service + VideoObject (if video embed)
 *
 * Static params generated at build time — one page per keynote.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { serviceJsonLd } from "@/lib/metadata";

/** Keynote data — will be replaced with Sanity GROQ queries */
const keynotes: Record<
  string,
  {
    title: string;
    tagline: string;
    description: string[];
    outcomes: string[];
    audiences: string[];
    duration: string;
    topicHub: { title: string; slug: string };
    relatedTopicHubs: { title: string; slug: string }[];
  }
> = {
  "reclaiming-focus": {
    title: "Reclaiming Focus in a World That Profits From Your Distraction",
    tagline:
      "The DIAL framework for attention management, defeating digital addiction, and reclaiming deep work.",
    description: [
      "We live in an attention economy where every app, notification, and platform is engineered to steal your focus. The average person checks their phone 96 times per day. Your team's most valuable resource isn't time — it's attention.",
      "In this keynote, Nic introduces the DIAL framework (Decide, Intend, Act, Loop) — a practical system for reclaiming focus and building deep work habits. Drawing from his experience building 4 companies and the latest research on digital addiction, he shows how high-agency individuals and teams take control of their attention.",
      "This isn't about going offline. It's about being intentional. Your team will leave with a concrete framework they can apply Monday morning to do their most important work.",
    ],
    outcomes: [
      "The DIAL framework for daily attention management",
      "How to identify and eliminate the 'sacrifice fallacy' in your work",
      "Practical strategies for 90-minute deep work blocks",
      "Why boredom is a catalyst for creativity, not a bug",
      "How to build team norms that protect focus time",
    ],
    audiences: [
      "Corporate teams struggling with productivity",
      "Leadership groups building remote/hybrid work culture",
      "Conferences focused on wellbeing and performance",
      "Teams experiencing burnout or attention fragmentation",
    ],
    duration: "45-60 minutes",
    topicHub: { title: "Focus", slug: "focus" },
    relatedTopicHubs: [
      { title: "Agency", slug: "agency" },
    ],
  },
  "breakthrough-product-teams": {
    title: "How to Build Breakthrough Product Teams",
    tagline:
      "The Innovation Flywheel: curiosity, experimentation, and high agency.",
    description: [
      "Most teams aren't stuck because they lack talent. They're stuck because they've optimised for compliance over curiosity. The Innovation Flywheel — curiosity → experimentation → learning → agency — is how the best product teams consistently ship work that matters.",
      "Nic draws from his experience building 4 companies and working with teams at every scale. He introduces the concept of T-shaped people, selective agency, and why 'action produces information' — a principle that separates breakthrough teams from stagnant ones.",
      "This keynote includes real stories from Nic's entrepreneurial journey, including how AI is reshaping how teams build products, why the Socratic method beats brainstorming, and what a $1.7M-per-person team (Gamma) can teach us about lean innovation.",
    ],
    outcomes: [
      "The Innovation Flywheel framework for team culture",
      "How to hire and develop T-shaped people",
      "Why selective agency beats blind autonomy",
      "Practical ways to integrate AI into your product workflow",
      "How to build a culture where action produces information",
    ],
    audiences: [
      "Product and engineering teams",
      "Innovation departments and R&D groups",
      "Leadership teams building a culture of experimentation",
      "Conferences focused on tech, product, or AI",
    ],
    duration: "45-60 minutes",
    topicHub: { title: "Innovation", slug: "innovation" },
    relatedTopicHubs: [
      { title: "AI", slug: "ai" },
      { title: "Curiosity", slug: "curiosity" },
    ],
  },
  "curiosity-catalyst": {
    title: "The Curiosity Catalyst",
    tagline:
      "Why curiosity is the god particle of innovation — and how to diagnose and cure stagnation.",
    description: [
      "Every organisation says they want innovation. Almost none of them invest in what actually drives it: curiosity. Nic's Stagnation Hypothesis is simple — when teams stop being curious, they start dying. Slowly at first, then all at once.",
      "In this keynote, Nic unpacks the three types of curiosity (epistemic, diversive, and empathetic), explains why most 'innovation programs' are actually wackovation (chaotic activity disguised as progress), and shows how companies like Onfido hired specifically for curiosity to build breakthrough teams.",
      "This is Nic's signature keynote — the one that makes teams uncomfortable in the best possible way. If your organisation is stuck on the OK Plateau, this is the catalyst that gets you moving again.",
    ],
    outcomes: [
      "The Stagnation Hypothesis: how to diagnose whether your org is stuck",
      "Three types of curiosity and how to cultivate each",
      "The difference between innovation and wackovation",
      "How to build curiosity into hiring, culture, and daily practice",
      "Why 'curiosity is the god particle of innovation'",
    ],
    audiences: [
      "C-suite and leadership offsites",
      "Conferences and large-format events",
      "Innovation and transformation teams",
      "Any team that feels stuck or stagnant",
    ],
    duration: "45-60 minutes",
    topicHub: { title: "Curiosity", slug: "curiosity" },
    relatedTopicHubs: [
      { title: "Innovation", slug: "innovation" },
    ],
  },
};

/** Generate static pages for all keynotes at build time */
export function generateStaticParams() {
  return Object.keys(keynotes).map((slug) => ({ slug }));
}

/** Generate metadata per keynote */
export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Note: generateMetadata in Next.js 15 receives params as a Promise
  return params.then(({ slug }) => {
    const keynote = keynotes[slug];
    if (!keynote) return { title: "Keynote Not Found" };

    return {
      title: `${keynote.title} | Virtual Keynote by Nic Haralambous`,
      description: keynote.tagline,
      alternates: {
        canonical: `https://nicharalambous.com/keynotes/${slug}`,
      },
      openGraph: {
        title: `${keynote.title} | Virtual Keynote by Nic Haralambous`,
        description: keynote.tagline,
        url: `https://nicharalambous.com/keynotes/${slug}`,
      },
    };
  });
}

export default async function KeynotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const keynote = keynotes[slug];

  if (!keynote) {
    notFound();
  }

  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={serviceJsonLd({
          name: `${keynote.title} — Virtual Keynote`,
          description: keynote.tagline,
          url: `https://nicharalambous.com/keynotes/${slug}`,
        })}
      />

      {/* Hero */}
      <Section width="content">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          Virtual Keynote
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl md:text-5xl">
          {keynote.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-brand-600">
          {keynote.tagline}
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-brand-500">
          <span>Format: Virtual</span>
          <span>Duration: {keynote.duration}</span>
        </div>
      </Section>

      {/* Description */}
      <Section width="content" className="bg-brand-50">
        {keynote.description.map((paragraph, i) => (
          <p
            key={i}
            className="mt-4 first:mt-0 text-base leading-relaxed text-brand-700"
          >
            {paragraph}
          </p>
        ))}
      </Section>

      {/* What Attendees Leave With */}
      <Section width="content">
        <h2 className="text-2xl font-bold text-brand-900">
          What Your Team Will Leave With
        </h2>
        <ul className="mt-6 space-y-3">
          {keynote.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-600">
                {i + 1}
              </span>
              <span className="text-brand-700">{outcome}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Who Is This For */}
      <Section width="content" className="bg-brand-50">
        <h2 className="text-2xl font-bold text-brand-900">
          Who Is This Keynote For?
        </h2>
        <ul className="mt-6 space-y-2">
          {keynote.audiences.map((audience, i) => (
            <li
              key={i}
              className="text-brand-700 before:mr-2 before:content-['→']"
            >
              {audience}
            </li>
          ))}
        </ul>
      </Section>

      {/* Related Topics — links to topic hubs per internal linking strategy */}
      <Section width="content">
        <h2 className="text-2xl font-bold text-brand-900">Related Topics</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`/topics/${keynote.topicHub.slug}`}
            className="rounded-full bg-accent-100 px-4 py-2 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
          >
            {keynote.topicHub.title}
          </a>
          {keynote.relatedTopicHubs.map((hub) => (
            <a
              key={hub.slug}
              href={`/topics/${hub.slug}`}
              className="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
            >
              {hub.title}
            </a>
          ))}
        </div>
      </Section>

      {/* CTA — links to /contact and /speaker */}
      <Section
        width="content"
        className="bg-accent-600 text-center text-white rounded-none"
      >
        <h2 className="text-2xl font-bold sm:text-3xl">
          Book This Keynote
        </h2>
        <p className="mt-4 text-lg text-accent-100">
          Virtual delivery worldwide. Customized for your audience.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton
            href="/contact"
            className="bg-white !text-accent-600 hover:bg-accent-100"
          >
            Enquire Now
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
