/**
 * ThemeProvider — manages the site color theme.
 *
 * Provides 4 fixed theme palettes + 25 random palettes. Themes override
 * CSS custom properties on the document root for instant color swapping.
 * The user's choice is persisted in localStorage.
 *
 * Fixed: "default", "ocean", "forest", "sunset".
 * Random: "random-0" … "random-24" (complementary to design system).
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

export type ThemeName =
  | "default"
  | "ocean"
  | "forest"
  | "sunset"
  | `random-${number}`;

interface ThemeColors {
  /** Display swatch color for the theme switcher */
  swatch: string;
  /** CSS custom property overrides applied to :root */
  vars: Record<string, string>;
}

/**
 * Fixed themes — each overrides accent colors; brand stays for readability.
 */
const FIXED_THEMES: Record<"default" | "ocean" | "forest" | "sunset", ThemeColors> = {
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

/** 25 palettes complementary to nav/slate brand — used by shuffle. */
const RANDOM_PALETTES: ThemeColors[] = [
  { swatch: "#2563eb", vars: { "--color-accent-600": "#2563eb", "--color-accent-500": "#3b82f6", "--color-accent-400": "#60a5fa", "--color-accent-100": "#dbeafe", "--color-accent-50": "#eff6ff", "--color-accent-800": "#1e40af" } },
  { swatch: "#4f46e5", vars: { "--color-accent-600": "#4f46e5", "--color-accent-500": "#6366f1", "--color-accent-400": "#818cf8", "--color-accent-100": "#e0e7ff", "--color-accent-50": "#eef2ff", "--color-accent-800": "#3730a3" } },
  { swatch: "#7c3aed", vars: { "--color-accent-600": "#7c3aed", "--color-accent-500": "#8b5cf6", "--color-accent-400": "#a78bfa", "--color-accent-100": "#ede9fe", "--color-accent-50": "#f5f3ff", "--color-accent-800": "#5b21b6" } },
  { swatch: "#9333ea", vars: { "--color-accent-600": "#9333ea", "--color-accent-500": "#a855f7", "--color-accent-400": "#c084fc", "--color-accent-100": "#f3e8ff", "--color-accent-50": "#faf5ff", "--color-accent-800": "#6b21a8" } },
  { swatch: "#c026d3", vars: { "--color-accent-600": "#c026d3", "--color-accent-500": "#d946ef", "--color-accent-400": "#e879f9", "--color-accent-100": "#fae8ff", "--color-accent-50": "#fdf4ff", "--color-accent-800": "#86198f" } },
  { swatch: "#db2777", vars: { "--color-accent-600": "#db2777", "--color-accent-500": "#ec4899", "--color-accent-400": "#f472b6", "--color-accent-100": "#fce7f3", "--color-accent-50": "#fdf2f8", "--color-accent-800": "#9d174d" } },
  { swatch: "#e11d48", vars: { "--color-accent-600": "#e11d48", "--color-accent-500": "#f43f5e", "--color-accent-400": "#fb7185", "--color-accent-100": "#ffe4e6", "--color-accent-50": "#fff1f2", "--color-accent-800": "#9f1239" } },
  { swatch: "#dc2626", vars: { "--color-accent-600": "#dc2626", "--color-accent-500": "#ef4444", "--color-accent-400": "#f87171", "--color-accent-100": "#fee2e2", "--color-accent-50": "#fef2f2", "--color-accent-800": "#991b1b" } },
  { swatch: "#ea580c", vars: { "--color-accent-600": "#ea580c", "--color-accent-500": "#f97316", "--color-accent-400": "#fb923c", "--color-accent-100": "#ffedd5", "--color-accent-50": "#fff7ed", "--color-accent-800": "#9a3412" } },
  { swatch: "#d97706", vars: { "--color-accent-600": "#d97706", "--color-accent-500": "#f59e0b", "--color-accent-400": "#fbbf24", "--color-accent-100": "#fef3c7", "--color-accent-50": "#fffbeb", "--color-accent-800": "#92400e" } },
  { swatch: "#ca8a04", vars: { "--color-accent-600": "#ca8a04", "--color-accent-500": "#eab308", "--color-accent-400": "#facc15", "--color-accent-100": "#fef9c3", "--color-accent-50": "#fefce8", "--color-accent-800": "#854d0e" } },
  { swatch: "#65a30d", vars: { "--color-accent-600": "#65a30d", "--color-accent-500": "#84cc16", "--color-accent-400": "#a3e635", "--color-accent-100": "#ecfccb", "--color-accent-50": "#f7fee7", "--color-accent-800": "#4d7c0f" } },
  { swatch: "#16a34a", vars: { "--color-accent-600": "#16a34a", "--color-accent-500": "#22c55e", "--color-accent-400": "#4ade80", "--color-accent-100": "#dcfce7", "--color-accent-50": "#f0fdf4", "--color-accent-800": "#166534" } },
  { swatch: "#059669", vars: { "--color-accent-600": "#059669", "--color-accent-500": "#10b981", "--color-accent-400": "#34d399", "--color-accent-100": "#d1fae5", "--color-accent-50": "#ecfdf5", "--color-accent-800": "#065f46" } },
  { swatch: "#0d9488", vars: { "--color-accent-600": "#0d9488", "--color-accent-500": "#14b8a6", "--color-accent-400": "#2dd4bf", "--color-accent-100": "#ccfbf1", "--color-accent-50": "#f0fdfa", "--color-accent-800": "#115e59" } },
  { swatch: "#0891b2", vars: { "--color-accent-600": "#0891b2", "--color-accent-500": "#06b6d4", "--color-accent-400": "#22d3ee", "--color-accent-100": "#cffafe", "--color-accent-50": "#ecfeff", "--color-accent-800": "#155e75" } },
  { swatch: "#0284c7", vars: { "--color-accent-600": "#0284c7", "--color-accent-500": "#0ea5e9", "--color-accent-400": "#38bdf8", "--color-accent-100": "#e0f2fe", "--color-accent-50": "#f0f9ff", "--color-accent-800": "#0369a1" } },
  { swatch: "#0369a1", vars: { "--color-accent-600": "#0369a1", "--color-accent-500": "#0284c7", "--color-accent-400": "#0ea5e9", "--color-accent-100": "#e0f2fe", "--color-accent-50": "#f0f9ff", "--color-accent-800": "#075985" } },
  { swatch: "#1d4ed8", vars: { "--color-accent-600": "#1d4ed8", "--color-accent-500": "#2563eb", "--color-accent-400": "#3b82f6", "--color-accent-100": "#dbeafe", "--color-accent-50": "#eff6ff", "--color-accent-800": "#1e40af" } },
  { swatch: "#4338ca", vars: { "--color-accent-600": "#4338ca", "--color-accent-500": "#4f46e5", "--color-accent-400": "#6366f1", "--color-accent-100": "#e0e7ff", "--color-accent-50": "#eef2ff", "--color-accent-800": "#3730a3" } },
  { swatch: "#6d28d9", vars: { "--color-accent-600": "#6d28d9", "--color-accent-500": "#7c3aed", "--color-accent-400": "#8b5cf6", "--color-accent-100": "#ede9fe", "--color-accent-50": "#f5f3ff", "--color-accent-800": "#5b21b6" } },
  { swatch: "#be185d", vars: { "--color-accent-600": "#be185d", "--color-accent-500": "#db2777", "--color-accent-400": "#ec4899", "--color-accent-100": "#fce7f3", "--color-accent-50": "#fdf2f8", "--color-accent-800": "#9d174d" } },
  { swatch: "#be123c", vars: { "--color-accent-600": "#be123c", "--color-accent-500": "#e11d48", "--color-accent-400": "#f43f5e", "--color-accent-100": "#ffe4e6", "--color-accent-50": "#fff1f2", "--color-accent-800": "#9f1239" } },
  { swatch: "#b91c1c", vars: { "--color-accent-600": "#b91c1c", "--color-accent-500": "#dc2626", "--color-accent-400": "#ef4444", "--color-accent-100": "#fee2e2", "--color-accent-50": "#fef2f2", "--color-accent-800": "#991b1b" } },
  { swatch: "#c2410c", vars: { "--color-accent-600": "#c2410c", "--color-accent-500": "#ea580c", "--color-accent-400": "#f97316", "--color-accent-100": "#ffedd5", "--color-accent-50": "#fff7ed", "--color-accent-800": "#9a3412" } },
  { swatch: "#15803d", vars: { "--color-accent-600": "#15803d", "--color-accent-500": "#16a34a", "--color-accent-400": "#22c55e", "--color-accent-100": "#dcfce7", "--color-accent-50": "#f0fdf4", "--color-accent-800": "#166534" } },
  { swatch: "#0f766e", vars: { "--color-accent-600": "#0f766e", "--color-accent-500": "#0d9488", "--color-accent-400": "#14b8a6", "--color-accent-100": "#ccfbf1", "--color-accent-50": "#f0fdfa", "--color-accent-800": "#115e59" } },
];

const RANDOM_THEME_IDS = RANDOM_PALETTES.map((_, i) => `random-${i}` as const);
export const THEMES: Record<string, ThemeColors> = {
  ...FIXED_THEMES,
  ...Object.fromEntries(RANDOM_PALETTES.map((p, i) => [`random-${i}`, p])),
};

export function pickRandomTheme(): (typeof RANDOM_THEME_IDS)[number] {
  return RANDOM_THEME_IDS[Math.floor(Math.random() * RANDOM_THEME_IDS.length)];
}

const THEME_NAMES: ("default" | "ocean" | "forest" | "sunset")[] = ["default", "ocean", "forest", "sunset"];

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
function applyTheme(name: string) {
  const entry = THEMES[name];
  if (!entry) return;
  const root = document.documentElement;
  for (const [prop, value] of Object.entries(entry.vars)) {
    root.style.setProperty(prop, value);
  }
}
