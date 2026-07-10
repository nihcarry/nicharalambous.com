"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * HomePageImageBackground
 *
 * Renders a desktop-only fixed image background behind the site shell when the
 * current route is the homepage. Kept pointer-events-none so navigation and
 * content remain fully interactive above it.
 */
export function HomePageVideoBackground() {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateMatch = () => setIsDesktop(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  if (pathname !== "/" || !isDesktop) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-brand-900"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/slides/hero-stage.jpg"
        alt=""
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
