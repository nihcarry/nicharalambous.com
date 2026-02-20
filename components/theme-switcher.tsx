/**
 * ThemeSwitcher — "Theme" label + shuffle button for 25 random accent palettes.
 *
 * Renders in the nav status bar. One tap picks a random complementary color
 * (persisted in localStorage). Styled like a dark pill with light grey icon.
 */
"use client";

import { useTheme, pickRandomTheme } from "@/components/theme-provider";

function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold leading-tight text-white">
        Theme
      </span>
      <button
        type="button"
        onClick={() => setTheme(pickRandomTheme())}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-nav-red)]"
        aria-label="Pick a random theme"
        title="Random theme"
      >
        <ShuffleIcon className="h-4 w-4 text-neutral-300" />
      </button>
    </div>
  );
}
