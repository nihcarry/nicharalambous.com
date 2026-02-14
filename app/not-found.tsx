/**
 * Custom 404 page.
 *
 * Provides helpful navigation back to key pages.
 * Includes search suggestion and links to main sections.
 */
import { CTAButton } from "@/components/cta-button";
import { Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section width="content" className="flex flex-col items-center text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
        404
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-brand-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <CTAButton href="/">Go Home</CTAButton>
        <CTAButton href="/speaker" variant="secondary">
          View Speaking
        </CTAButton>
      </div>
      <div className="mt-12 text-sm text-brand-400">
        <p>Looking for something specific? Try these:</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a href="/blog" className="text-accent-600 hover:underline">
            Blog
          </a>
          <a href="/keynotes" className="text-accent-600 hover:underline">
            Keynotes
          </a>
          <a href="/topics" className="text-accent-600 hover:underline">
            Topics
          </a>
          <a href="/about" className="text-accent-600 hover:underline">
            About
          </a>
          <a href="/contact" className="text-accent-600 hover:underline">
            Contact
          </a>
        </div>
      </div>
    </Section>
  );
}
