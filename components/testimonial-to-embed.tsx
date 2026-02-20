"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useSlideDeck } from "@/components/slide-deck";

const IFRAME_SRC =
  "https://embed-v2.testimonial.to/w/nic-haralambous---speaker?id=5b8610ee-6b4a-4779-9503-cddbd8c5ac26";

/**
 * Testimonial.to embed — testimonial wall for Nic Haralambous (speaker).
 * Fits in viewport with responsive height. Scales down as the slide scrolls
 * in/out of view for a receding depth effect.
 */
export function TestimonialToEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { containerRef } = useSlideDeck();

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.92, 1, 1, 0.92]);

  return (
    <motion.div
      ref={ref}
      className="origin-center"
      style={prefersReducedMotion ? undefined : { scale }}
    >
      <iframe
        id="testimonialto-5b8610ee-6b4a-4779-9503-cddbd8c5ac26"
        src={IFRAME_SRC}
        frameBorder={0}
        scrolling="no"
        width="100%"
        title="Client testimonials"
        className="block w-full"
        style={{ height: "clamp(240px, 46vh, 384px)" }}
      />
    </motion.div>
  );
}
