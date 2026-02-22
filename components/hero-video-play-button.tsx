"use client";

import { Play } from "lucide-react";

/**
 * Small desktop-only trigger for opening the homepage hero video overlay.
 */
export function HeroVideoPlayButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("home-video-overlay:open"))}
      className="hidden h-12 w-12 items-center justify-center rounded-full border-[4px] border-brand-900 bg-white/95 text-brand-900 shadow-[var(--shadow-cta)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 md:inline-flex md:h-14 md:w-14"
      aria-label="Play full-screen hero video with sound"
    >
      <Play className="h-5 w-5 translate-x-[1px] stroke-[2.75] md:h-6 md:w-6" />
    </button>
  );
}
