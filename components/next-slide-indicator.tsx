"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSlideDeck } from "@/components/slide-deck";

/**
 * Persistent "Next slide" button at the bottom of the viewport.
 * Always visible on desktop except on the last slide (footer).
 * Clicking scrolls to whichever slide comes after the current one.
 * Respects prefers-reduced-motion.
 */
export function NextSlideIndicator() {
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { containerRef } = useSlideDeck();
  const slidesRef = useRef<HTMLElement[]>([]);

  const scrollToNextSlide = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = slidesRef.current;
    if (slides.length === 0) return;

    const scrollTop = container.scrollTop;
    const viewportMid = scrollTop + container.clientHeight / 2;
    /* Determine current slide by viewport midpoint, then advance exactly one. */
    let currentIndex = 0;
    for (let i = 0; i < slides.length; i++) {
      const top = slides[i].offsetTop;
      const bottom = top + slides[i].offsetHeight;
      if (viewportMid >= top && viewportMid < bottom) {
        currentIndex = i;
        break;
      }
      if (top <= viewportMid) {
        currentIndex = i;
      } else {
        break;
      }
    }
    const targetIndex = Math.min(currentIndex + 1, slides.length - 1);

    container.scrollTo({
      top: slides[targetIndex].offsetTop,
      behavior: "smooth",
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotion);

    /* Collect all slide sections (direct children that are <section> elements) */
    const updateSlides = () => {
      slidesRef.current = Array.from(container.querySelectorAll<HTMLElement>(":scope > section"));
    };
    updateSlides();

    /* Watch scroll position to detect last slide */
    const handleScroll = () => {
      const slides = slidesRef.current;
      if (slides.length === 0) return;

      const lastSlide = slides[slides.length - 1];
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      /* Hide when last slide is mostly in view */
      const lastSlideTop = lastSlide.offsetTop;
      setIsLastSlide(scrollTop + containerHeight * 0.75 > lastSlideTop + lastSlide.offsetHeight / 2);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      mediaQuery.removeEventListener("change", handleMotion);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);

  if (isLastSlide) return null;

  return (
    <button
      type="button"
      onClick={scrollToNextSlide}
      className="fixed bottom-6 left-1/2 z-[100] hidden -translate-x-1/2 md:flex flex-col items-center rounded-full border border-white/30 bg-black/20 px-4 py-2 text-brand-50 backdrop-blur-[2px] transition-colors hover:bg-black/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
      aria-label="Go to next slide"
    >
      <span
        className={`text-xs font-medium uppercase tracking-wider ${
          prefersReducedMotion ? "" : "animate-next-slide-glow"
        }`}
      >
        Next slide
      </span>
    </button>
  );
}
