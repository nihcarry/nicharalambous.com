/**
 * SlideDeck — scroll-snap container for the keynote-style slide layout.
 *
 * Wraps child Slide components in a scroll-snap container on desktop (md+).
 * On mobile (<md), renders children in a standard vertical flow with no snap.
 *
 * Uses CSS scroll-snap-type: y proximity so slides land firmly but the user
 * can still scroll freely past them.
 *
 * Provides a context (`useSlideDeck`) so child components (SlideContent,
 * NextSlideIndicator, etc.) can reference the scroll container for
 * IntersectionObserver roots and programmatic scrolling.
 */
"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

/* ---------- Context ---------- */

interface SlideDeckContextValue {
  containerRef: RefObject<HTMLDivElement | null>;
}

const SlideDeckContext = createContext<SlideDeckContextValue>({
  containerRef: { current: null },
});

/** Access the SlideDeck scroll container ref from any descendant. */
export function useSlideDeck() {
  return useContext(SlideDeckContext);
}

/* ---------- Component ---------- */

interface SlideDeckProps {
  children: React.ReactNode;
}

export function SlideDeck({ children }: SlideDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SlideDeckContext.Provider value={{ containerRef }}>
      <div
        ref={containerRef}
        className={[
          /* Pull up so first slide extends behind fixed header (no white band) */
          "-mt-[var(--header-height-mobile)] md:-mt-[var(--header-height-desktop)]",
          /* Mobile: standard block flow */
          "flex flex-col",
          /* Desktop: full-height scroll container with snap (header is fixed, so full 100vh) */
          "md:h-screen md:snap-y md:snap-mandatory md:overflow-y-auto",
          /* Hide scrollbar for cleaner presentation feel */
          "md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {children}
      </div>
    </SlideDeckContext.Provider>
  );
}
