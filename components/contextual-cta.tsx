/**
 * Article close. Retired keynotes are not promoted. The button goes to
 * the Output Paradox page unless the related keynote is still live.
 */
import { OUTPUT_PARADOX_PATH, isRetiredKeynote } from "@/lib/site";

interface RelatedKeynote {
  title: string;
  slug: string;
  tagline: string;
}

interface ContextualCtaProps {
  relatedKeynote: RelatedKeynote | null;
  className?: string;
}

export function ContextualCta({ relatedKeynote }: ContextualCtaProps) {
  const live = relatedKeynote && !isRetiredKeynote(relatedKeynote.slug) ? relatedKeynote : null;
  const title = live?.title || "These ideas come alive in Nic's keynotes";
  const detail =
    live?.tagline ||
    "Real stories, actionable frameworks, tailored to your audience. In person or virtually.";
  const href = live ? `/keynotes/${live.slug}` : OUTPUT_PARADOX_PATH;

  return (
    <div className="plain-card closing-card">
      <h2>{title}</h2>
      <p>{detail}</p>
      <div className="acts">
        <a className="btn" href={href}>
          See the keynote
        </a>
        <a className="quiet-link" href="/#newsletter">
          Subscribe to the newsletter
        </a>
      </div>
    </div>
  );
}
