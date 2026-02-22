/**
 * Call-to-action button component.
 *
 * Used across the site for booking CTAs, navigation, and engagement.
 * Supports primary (filled) and secondary (outline) variants.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Compass, Home, Mail, Mic, Newspaper, User } from "lucide-react";

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
  icon?: ReactNode;
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  icon,
}: CTAButtonProps) {
  const getDefaultIcon = () => {
    if (href === "/") {
      return <Home className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("contact")) {
      return <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("speaker")) {
      return <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("keynotes")) {
      return <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("topics")) {
      return <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("blog") || href.includes("archive")) {
      return <Newspaper className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    if (href.includes("about")) {
      return <User className="h-4 w-4 shrink-0" aria-hidden="true" />;
    }
    return <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />;
  };

  const baseStyles =
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-none px-6 py-3 text-center text-base font-semibold whitespace-nowrap transition-colors duration-200 shadow-[var(--shadow-cta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500";

  const variants = {
    primary:
      "bg-accent-600 text-white hover:bg-accent-500 active:bg-accent-600",
    secondary:
      "border-2 border-brand-800 bg-white text-brand-800 hover:bg-brand-100 active:bg-brand-200",
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;
  const resolvedIcon = icon ?? getDefaultIcon();
  const buttonContent = (
    <>
      <span className="inline-flex shrink-0 items-center">{resolvedIcon}</span>
      <span className="leading-tight">{children}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={combinedStyles}
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedStyles}>
      {buttonContent}
    </Link>
  );
}
