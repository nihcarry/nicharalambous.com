/**
 * SlideDeck — scroll-snap container for the keynote-style slide layout.
 *
 * Wraps child Slide components in a scroll-snap container on desktop (md+).
 * On mobile (<md), renders children in a standard vertical flow with no snap.
 *
 * Uses CSS scroll-snap-type: y proximity so slides land firmly but the user
 * can still scroll freely past them.
 */
"use client";

import { useRef } from "react";

interface SlideDeckProps {
  children: React.ReactNode;
}

export function SlideDeck({ children }: SlideDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={[
        /* Mobile: standard block flow */
        "flex flex-col",
        /* Desktop: full-height scroll container with snap (header is fixed, so full 100vh) */
        "md:h-screen md:snap-y md:snap-proximity md:overflow-y-auto",
        /* Hide scrollbar for cleaner presentation feel */
        "md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
