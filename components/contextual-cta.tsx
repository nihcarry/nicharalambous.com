/**
 * Contextual CTA component for blog posts.
 *
 * When a blog post has a related keynote, this displays a targeted
 * call-to-action linking to that specific keynote. Falls back to a
 * generic /speaker CTA when no related keynote is set.
 *
 * Part of the authority flow: blog posts → keynotes → /speaker.
 */
import { CTAButton } from "@/components/cta-button";

interface RelatedKeynote {
  title: string;
  slug: string;
  tagline: string;
}

interface ContextualCtaProps {
  relatedKeynote: RelatedKeynote | null;
  className?: string;
}

export function ContextualCta({
  relatedKeynote,
  className = "",
}: ContextualCtaProps) {
  if (relatedKeynote) {
    return (
      <div
        className={`bg-accent-50 p-8 text-center ${className}`}
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
          Explore This as a Keynote
        </p>
        <h3 className="mt-2 heading-display text-2xl text-brand-900">
          {relatedKeynote.title}
        </h3>
        <p className="mt-2 text-base text-brand-600">
          {relatedKeynote.tagline}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <CTAButton href={`/keynotes/${relatedKeynote.slug}`}>
            Learn More About This Keynote
          </CTAButton>
          <CTAButton href="/contact" variant="secondary">
            Book This Keynote
          </CTAButton>
        </div>
      </div>
    );
  }

  /* Fallback: generic speaker CTA */
  return (
    <div
      className={`bg-accent-50 p-8 text-center ${className}`}
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
        Want the Keynote Version?
      </p>
      <h3 className="mt-2 heading-display text-2xl text-brand-900">
        These ideas come alive in Nic&rsquo;s virtual keynotes
      </h3>
      <p className="mt-2 text-base text-brand-600">
        Real stories, actionable frameworks, tailored to your audience.
        Worldwide virtual delivery.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <CTAButton href="/speaker">About Nic as a Speaker</CTAButton>
        <CTAButton href="/keynotes" variant="secondary">
          Explore Keynotes
        </CTAButton>
      </div>
    </div>
  );
}
