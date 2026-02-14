/**
 * Section wrapper component.
 *
 * Provides consistent vertical spacing and container width
 * for all page sections. Supports content-width and wide variants.
 */

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  width?: "content" | "wide" | "full";
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
    wide: "container-wide",
    full: "",
  };

  return (
    <Component
      id={id}
      className={`py-(--spacing-section-sm) md:py-(--spacing-section) ${widthStyles[width]} ${className}`}
    >
      {children}
    </Component>
  );
}
