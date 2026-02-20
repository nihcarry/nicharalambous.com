/**
 * Final CTA section — standardized brutalist call-to-action used at the
 * bottom of every page. Pattern background, display heading with stroke,
 * and sharp-cornered CTA buttons.
 *
 * Supports an optional blockquote (used on /businesses).
 */
import { Section } from "@/components/section";
import { CTAButton } from "@/components/cta-button";

interface FinalCtaProps {
  heading: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Optional blockquote shown above heading (used on /businesses) */
  quote?: string;
  quoteAttribution?: string;
  /** Optional className for the heading (e.g. landing-page slide style) */
  headingClassName?: string;
}

export function FinalCta({
  heading,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  quote,
  quoteAttribution,
  headingClassName,
}: FinalCtaProps) {
  return (
    <Section width="full" className="bg-cta-pattern text-center">
      <div className="container-content">
        {quote && (
          <>
            <blockquote
              className="heading-display-stroke-sm text-2xl italic leading-relaxed text-brand-900 sm:text-3xl"
              style={{ fontStyle: "italic" }}
            >
              &ldquo;{quote}&rdquo;
            </blockquote>
            {quoteAttribution && (
              <p className="mt-4 text-brand-500">&mdash; {quoteAttribution}</p>
            )}
            <div className="mt-8" />
          </>
        )}

        <h2
          className={headingClassName ?? "heading-display-stroke-sm text-3xl text-brand-900 sm:text-4xl md:text-5xl"}
        >
          {heading}
        </h2>
        <p className="mt-4 text-lg text-brand-600">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <CTAButton href={primaryHref}>
            {primaryLabel}
          </CTAButton>
          {secondaryHref && secondaryLabel && (
            <CTAButton href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </CTAButton>
          )}
        </div>
      </div>
    </Section>
  );
}
