/**
 * ThemeSwitcher — 4-color palette that swaps the site's accent theme.
 *
 * Renders as a compact row of swatches designed to sit in the nav status bar
 * where the Share button used to be. Clicking a swatch instantly switches
 * the entire site's accent color via CSS custom properties.
 */
"use client";

import { useTheme, THEMES, type ThemeName } from "@/components/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold leading-tight text-white">
        Themes
      </span>
      <div className="flex items-center gap-1.5">
        {themes.map((name: ThemeName) => (
          <button
            key={name}
            type="button"
            onClick={() => setTheme(name)}
            className={[
              "h-4 w-4 rounded-full transition-transform hover:scale-125",
              "focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-nav-bg",
              theme === name ? "ring-2 ring-white scale-110" : "",
            ].join(" ")}
            style={{ backgroundColor: THEMES[name].swatch }}
            aria-label={`Switch to ${name} theme`}
            aria-pressed={theme === name}
          />
        ))}
      </div>
    </div>
  );
}
