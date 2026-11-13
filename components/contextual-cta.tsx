/**
 * Article close. Points at the current keynote and the newsletter.
 */
import { OUTPUT_PARADOX_PATH } from "@/lib/site";

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
  const title = relatedKeynote?.title || "These ideas come alive in Nic's keynotes";
  const detail =
    relatedKeynote?.tagline ||
    "Real stories, actionable frameworks, tailored to your audience. In person or virtually.";

  return (
    <div className="plain-card closing-card">
      <h2>{title}</h2>
      <p>{detail}</p>
      <div className="acts">
        <a className="btn" href={OUTPUT_PARADOX_PATH}>
          See the keynote
        </a>
        <a className="quiet-link" href="/#newsletter">
          Subscribe to the newsletter
        </a>
      </div>
    </div>
  );
}
