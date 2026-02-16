/**
 * Slide animation wrappers — Framer Motion effects for the keynote slide deck.
 *
 * Provides client-side wrappers:
 * - SlideParallaxImage: Parallax effect on decorative slide images
 * - SlideForeground: Parallax + fade for foreground elements
 * - SlideContent: Fade/slide-up animation when content enters the viewport
 *
 * All respect prefers-reduced-motion via useReducedMotion().
 * SlideContent and SlideForeground use the SlideDeck scroll container as the
 * IntersectionObserver root so animations trigger correctly inside the nested
 * scroll container.
 */
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useSlideDeck } from "@/components/slide-deck";

/* ---------- Parallax image wrapper ---------- */

interface SlideParallaxImageProps {
  children: React.ReactNode;
}

/**
 * Wraps a SlideImage with a subtle parallax effect.
 * The image moves at a slower rate than the scroll, creating depth.
 * Disabled when user prefers reduced motion.
 */
export function SlideParallaxImage({ children }: SlideParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { containerRef } = useSlideDeck();

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  /* Map scroll progress to a vertical offset: -30px to +30px */
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  if (prefersReducedMotion) {
    return <div ref={ref} className="absolute inset-0">{children}</div>;
  }

  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ---------- Foreground parallax wrapper ---------- */

interface SlideForegroundProps {
  children: React.ReactNode;
  /** Optional additional classes. */
  className?: string;
}

/**
 * Wraps a foreground element (e.g. hero portrait) with a parallax effect
 * that moves faster than background, creating a "closer to camera" feel.
 * Also fades in on initial view. Disabled when user prefers reduced motion.
 */
export function SlideForeground({ children, className = "" }: SlideForegroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { containerRef } = useSlideDeck();

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  /* Foreground moves more than background: -60px to +60px */
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3, root: containerRef }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Content enter animation ---------- */

interface SlideContentProps {
  children: React.ReactNode;
  /** Optional additional classes. */
  className?: string;
}

/**
 * Wraps slide content with a subtle fade-in + slide-up animation
 * triggered when the element scrolls into view within the SlideDeck.
 * Disabled when user prefers reduced motion.
 */
export function SlideContent({ children, className = "" }: SlideContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { containerRef } = useSlideDeck();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, root: containerRef }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
