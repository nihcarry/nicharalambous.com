/**
 * Slide component — full-viewport section for the keynote-style home page.
 *
 * Each slide fills the viewport height, snaps into view on scroll (desktop),
 * and centers its content vertically. Variants control inner container width
 * to match existing Section sizing conventions.
 *
 * On mobile (<md), slides revert to standard block layout without snap or
 * viewport-height enforcement.
 *
 * The optional `image` prop renders a decorative SlideImage behind the content,
 * positioned absolutely within the slide.
 */

interface SlideProps {
  children: React.ReactNode;
  /** Controls inner container width. Defaults to "wide" (72rem). */
  variant?: "hero" | "centered" | "grid-3" | "grid-6" | "logos" | "cta" | "footer";
  /** Optional background class (e.g. "bg-brand-50", "bg-accent-600"). */
  background?: string;
  /** Additional classes applied to the outer slide wrapper. */
  className?: string;
  /** HTML id for anchor linking. */
  id?: string;
  /** Optional decorative image element (SlideImage) rendered behind content. */
  image?: React.ReactNode;
  /** Optional foreground element rendered above content (e.g. hero portrait). */
  foreground?: React.ReactNode;
}

/**
 * Map variants to inner container width classes.
 * Matches the existing container-content (48rem) and container-wide (72rem).
 */
const variantWidth: Record<NonNullable<SlideProps["variant"]>, string> = {
  hero: "container-wide",
  centered: "container-content",
  "grid-3": "container-wide",
  "grid-6": "container-wide",
  logos: "container-wide",
  cta: "container-content",
  footer: "container-wide",
};

export function Slide({
  children,
  variant = "centered",
  background = "",
  className = "",
  id,
  image,
  foreground,
}: SlideProps) {
  return (
    <section
      id={id}
      className={[
        /* Relative positioning for absolute SlideImage children */
        "relative overflow-hidden",
        /* Full viewport on desktop; standard block on mobile */
        "md:min-h-screen md:snap-start",
        /* Flex column to vertically center content on desktop */
        "md:flex md:flex-col md:items-center md:justify-center",
        /* Standard section padding on mobile; tighter on desktop slides */
        "py-[var(--spacing-section-sm)] md:py-12",
        /* Background and extra classes */
        background,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Decorative image layer — behind content */}
      {image}
      {/* Content sits above the decorative image layer */}
      <div className={`relative z-10 ${variantWidth[variant]}`}>{children}</div>
      {/* Foreground layer — renders above content (e.g. hero portrait) */}
      {foreground}
    </section>
  );
}
