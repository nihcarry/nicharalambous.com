/**
 * ThemeProvider — manages the site color theme.
 *
 * Provides a React context with 4 named theme palettes. Themes override
 * CSS custom properties on the document root for instant color swapping.
 * The user's choice is persisted in localStorage.
 *
 * Theme names: "default", "ocean", "forest", "sunset".
 */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ---------- Theme definitions ---------- */

export type ThemeName = "default" | "ocean" | "forest" | "sunset";

interface ThemeColors {
  /** Display swatch color for the theme switcher */
  swatch: string;
  /** CSS custom property overrides applied to :root */
  vars: Record<string, string>;
}

/**
 * Each theme overrides accent and surface colors.
 * Brand colors stay unchanged to preserve text readability.
 */
export const THEMES: Record<ThemeName, ThemeColors> = {
  default: {
    swatch: "#2563eb",
    vars: {
      "--color-accent-600": "#2563eb",
      "--color-accent-500": "#3b82f6",
      "--color-accent-400": "#60a5fa",
      "--color-accent-100": "#dbeafe",
      "--color-accent-50": "#eff6ff",
      "--color-accent-800": "#1e40af",
    },
  },
  ocean: {
    swatch: "#0891b2",
    vars: {
      "--color-accent-600": "#0891b2",
      "--color-accent-500": "#06b6d4",
      "--color-accent-400": "#22d3ee",
      "--color-accent-100": "#cffafe",
      "--color-accent-50": "#ecfeff",
      "--color-accent-800": "#155e75",
    },
  },
  forest: {
    swatch: "#059669",
    vars: {
      "--color-accent-600": "#059669",
      "--color-accent-500": "#10b981",
      "--color-accent-400": "#34d399",
      "--color-accent-100": "#d1fae5",
      "--color-accent-50": "#ecfdf5",
      "--color-accent-800": "#065f46",
    },
  },
  sunset: {
    swatch: "#ca8a04",
    vars: {
      "--color-accent-600": "#ca8a04",
      "--color-accent-500": "#eab308",
      "--color-accent-400": "#facc15",
      "--color-accent-100": "#fef9c3",
      "--color-accent-50": "#fefce8",
      "--color-accent-800": "#854d0e",
    },
  },
};

const THEME_NAMES: ThemeName[] = ["default", "ocean", "forest", "sunset"];

const STORAGE_KEY = "nic-site-theme";

/* ---------- Context ---------- */

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (name: ThemeName) => void;
  themes: typeof THEME_NAMES;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "default",
  setTheme: () => {},
  themes: THEME_NAMES,
});

export function useTheme() {
  return useContext(ThemeContext);
}

/* ---------- Provider ---------- */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("default");

  /* Load saved theme on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (saved && saved in THEMES) {
        setThemeState(saved);
        applyTheme(saved);
      }
    } catch {
      /* localStorage may be blocked; ignore */
    }
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeState(name);
    applyTheme(name);
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_NAMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ---------- Helpers ---------- */

/** Apply theme CSS custom properties to the document root. */
function applyTheme(name: ThemeName) {
  const vars = THEMES[name].vars;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(vars)) {
    root.style.setProperty(prop, value);
  }
}
