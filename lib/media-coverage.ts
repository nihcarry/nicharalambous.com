/**
 * Media coverage is read from data/media-coverage.json at build time.
 * Sanity is not queried, and nothing is written back.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/** Unverified appearances from the old fallback. They are not in the JSON. */
export const HIDDEN_MEDIA: { id: string; title: string }[] = [
  { id: "fm-1", title: "The Future of Work and Curiosity" },
  { id: "fm-2", title: "South African Entrepreneur on Building with AI" },
  { id: "fm-3", title: "Entrepreneurship in Africa" },
];

const HIDDEN_TITLES = new Set(HIDDEN_MEDIA.map((item) => item.title));
const HIDDEN_IDS = new Set<string>(HIDDEN_MEDIA.map((item) => item.id));

const FEATURED_ORDER = [
  "South Africa's 'fun sock' entrepreneur",
  "Top 20 Tech Startups in Africa",
  "Socks by subscription: the tech guy who wants to revolutionise South African fashion",
  "Talking Books Ep 18: Do. Fail. Learn. Repeat.",
  "Living at the Forefront of Incompetence",
  "Choosing not to have children",
];

/** Shown only when the name appears in the data. Fast Company is never added. */
const OUTLET_NAMES = [
  "BBC News",
  "Forbes",
  "The Guardian",
  "CNBC Africa",
  "Mail & Guardian",
  "Daily Maverick",
  "TechCabal",
  "TEDxCapeTown",
];

export type MediaType = "Press" | "Podcast" | "TV" | "Radio" | "Video" | "Talk";

export type MediaCard = {
  id: string;
  title: string;
  outlet: string;
  type: MediaType;
  date: string | null;
  year: number | null;
  summary: string;
  href: string;
  archived: boolean;
  featured: boolean;
  poster: string | null;
};

type RawItem = {
  notionId?: string;
  title?: string;
  outlet?: string;
  type?: string;
  date?: string | null;
  url?: string | null;
  archiveUrl?: string | null;
  summary?: string | null;
  thumbnailUrl?: string | null;
  hidden?: boolean;
  featured?: boolean;
  linkStatus?: string;
};

const TYPES = new Set<MediaType>(["Press", "Podcast", "TV", "Radio", "Video", "Talk"]);

function posterFor(thumbnailUrl: string | null | undefined): string | null {
  if (!thumbnailUrl) return null;
  const match = thumbnailUrl.match(/\/vi\/([^/]+)\//);
  if (!match) return null;
  const file = path.join(process.cwd(), "public/media/posters", `${match[1]}.jpg`);
  if (!existsSync(file)) return null;
  return `/media/posters/${match[1]}.jpg`;
}

function isHidden(item: RawItem): boolean {
  if (item.hidden) return true;
  const title = item.title || "";
  const id = item.notionId || "";
  return HIDDEN_TITLES.has(title) || HIDDEN_IDS.has(id);
}

export function loadMediaCoverage(): MediaCard[] {
  const file = path.join(process.cwd(), "data/media-coverage.json");
  const raw = JSON.parse(readFileSync(file, "utf8")) as { items?: RawItem[] };
  const cards: MediaCard[] = [];
  for (const item of raw.items || []) {
    if (isHidden(item)) continue;
    if (!item.title || !item.outlet || !item.type || !TYPES.has(item.type as MediaType)) continue;
    const archived = item.linkStatus === "Dead" || item.linkStatus === "Archive only";
    const href = archived ? item.archiveUrl || item.url : item.url || item.archiveUrl;
    if (!href) continue;
    const date = item.date || null;
    const year = date ? Number(date.slice(0, 4)) : null;
    cards.push({
      id: item.notionId || href,
      title: item.title,
      outlet: item.outlet,
      type: item.type as MediaType,
      date,
      year: year && Number.isFinite(year) ? year : null,
      summary: (item.summary || "").replace(/\s+/g, " ").trim(),
      href,
      archived,
      featured: Boolean(item.featured),
      poster: posterFor(item.thumbnailUrl),
    });
  }
  cards.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
  return cards;
}

export function featuredMedia(items: MediaCard[]): MediaCard[] {
  return items
    .filter((item) => item.featured)
    .sort((a, b) => {
      const ai = FEATURED_ORDER.indexOf(a.title);
      const bi = FEATURED_ORDER.indexOf(b.title);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

export function mediaStats(items: MediaCard[]): { count: number; years: number; earliest: number; latest: number } {
  const years = items.map((item) => item.year).filter((year): year is number => year !== null);
  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  return { count: items.length, years: latest - earliest, earliest, latest };
}

export function outletNames(items: MediaCard[]): string[] {
  const outlets = items.map((item) => item.outlet);
  return OUTLET_NAMES.filter((name) => {
    if (name === "Fast Company") return false;
    if (name === "SXSW") return outlets.some((outlet) => outlet.includes("SXSW"));
    return outlets.some((outlet) => outlet.includes(name));
  });
}

export function mediaStatLine(items: MediaCard[]): string {
  const stats = mediaStats(items);
  return `${stats.count} features across ${stats.years} years`;
}
