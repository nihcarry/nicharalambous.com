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
    <div className="plain-card" style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      <p>{detail}</p>
      <div className="acts" style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
        <a className="btn" href={OUTPUT_PARADOX_PATH}>
          See the keynote
        </a>
        <a className="link" href="/#newsletter">
          Subscribe to the newsletter
        </a>
      </div>
    </div>
  );
}
