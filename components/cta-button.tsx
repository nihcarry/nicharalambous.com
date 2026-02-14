/**
 * Call-to-action button component.
 *
 * Used across the site for booking CTAs, navigation, and engagement.
 * Supports primary (filled) and secondary (outline) variants.
 */
import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

  const variants = {
    primary:
      "bg-accent-600 text-white hover:bg-accent-500 active:bg-accent-600",
    secondary:
      "border-2 border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-white active:bg-brand-900",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        className={combinedStyles}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedStyles}>
      {children}
    </Link>
  );
}
