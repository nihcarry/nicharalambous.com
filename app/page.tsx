/**
 * Homepage — nicharalambous.com
 *
 * Pre-launch: serves as a "coming soon" page that establishes
 * the site's identity and core positioning.
 *
 * Post-launch: will be replaced with the full homepage
 * (hero + featured keynotes + recent posts + social proof).
 */
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

export default function HomePage() {
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

      {/* Topics preview */}
      <Section width="wide" className="bg-brand-50">
        <h2 className="text-center text-2xl font-bold text-brand-900 sm:text-3xl">
          What Nic Speaks About
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Curiosity & Innovation",
              description:
                "Why curiosity is the god particle of innovation — and how to build teams that never stop experimenting.",
              href: "/topics/curiosity",
            },
            {
              title: "AI & Product Building",
              description:
                "How to use AI as a tool without losing your mind — or your team's creative edge.",
              href: "/topics/ai",
            },
            {
              title: "Entrepreneurship & Resilience",
              description:
                "4 startup exits, countless failures. Real stories of building, breaking, and rebuilding.",
              href: "/topics/entrepreneurship",
            },
            {
              title: "Focus & Agency",
              description:
                "Reclaiming attention in a world that profits from your distraction.",
              href: "/topics/focus",
            },
            {
              title: "Failure as Data",
              description:
                "Why blameless postmortems and post-traumatic growth build stronger teams.",
              href: "/topics/failure",
            },
            {
              title: "Building Breakthrough Teams",
              description:
                "High agency, selective curiosity, and the innovation flywheel.",
              href: "/topics/innovation",
            },
          ].map((topic) => (
            <a
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
            </a>
          ))}
        </div>
      </Section>

      {/* CTA section */}
      <Section width="content" className="text-center">
        <h2 className="text-2xl font-bold text-brand-900 sm:text-3xl">
          Want Nic at Your Next Event?
        </h2>
        <p className="mt-4 text-lg text-brand-600">
          Virtual keynotes for conferences, corporate events, team offsites, and
          webinars. Worldwide delivery.
        </p>
        <div className="mt-8">
          <CTAButton href="/contact">Book Nic for Your Event</CTAButton>
        </div>
      </Section>
    </>
  );
}
