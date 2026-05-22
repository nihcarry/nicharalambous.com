/**
 * Section wrapper component.
 *
 * Provides consistent vertical spacing and container width
 * for all page sections. Supports content-width and wide variants.
 */

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  width?: "content" | "landing" | "wide" | "full";
  as?: "section" | "div" | "article" | "aside";
  id?: string;
}

export function Section({
  children,
  className = "",
  width = "wide",
  as: Component = "section",
  id,
}: SectionProps) {
  const widthStyles = {
    content: "container-content",
    landing: "container-landing",
    wide: "container-wide",
    full: "",
  };

  return (
    <Component
      id={id}
      className={`py-[var(--spacing-section-sm)] md:py-[var(--spacing-section)] ${widthStyles[width]} ${className}`}
    >
      {children}
    </Component>
  );
}
