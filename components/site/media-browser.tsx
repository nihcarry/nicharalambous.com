"use client";

import { useEffect, useMemo, useState } from "react";
import type { MediaCard, MediaType } from "@/lib/media-coverage";

const PAGE_SIZE = 24;

const TYPE_CHIPS: { id: string; label: string; type: MediaType | null }[] = [
  { id: "all", label: "All", type: null },
  { id: "press", label: "Press", type: "Press" },
  { id: "podcast", label: "Podcasts", type: "Podcast" },
  { id: "tv", label: "TV", type: "TV" },
  { id: "radio", label: "Radio", type: "Radio" },
  { id: "video", label: "Video", type: "Video" },
  { id: "talk", label: "Talks", type: "Talk" },
];

type Filters = { type: string; year: string; q: string };

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    type: params.get("type") || "all",
    year: params.get("year") || "all",
    q: params.get("q") || "",
  };
}

function writeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.year !== "all") params.set("year", filters.year);
  if (filters.q) params.set("q", filters.q);
  const query = params.toString();
  const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, "", next);
}

function formatDate(value: string | null): string {
  if (!value) return "Undated";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "Undated";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function matchesYear(item: MediaCard, year: string): boolean {
  if (year === "all") return true;
  if (year === "undated") return item.year === null;
  if (year.endsWith("s") && year.length === 5) {
    const start = Number(year.slice(0, 4));
    return item.year !== null && item.year >= start && item.year < start + 10;
  }
  return item.year === Number(year);
}

function matchesQuery(item: MediaCard, q: string): boolean {
  if (!q) return true;
  const haystack = `${item.title} ${item.outlet} ${item.summary}`.toLowerCase();
  return haystack.includes(q.toLowerCase());
}

function PlayMark() {
  return (
    <span className="play" aria-hidden="true">
      <svg viewBox="0 0 12 12" width="12" height="12">
        <path d="M3 1.5v9l8-4.5-8-4.5z" fill="currentColor" />
      </svg>
    </span>
  );
}

function ExternalMark() {
  return (
    <svg className="ext" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M4 4h5.2M9.2 4v5.2M9.2 4 4 9.2M6.2 12H3.5A1.5 1.5 0 0 1 2 10.5V4.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function Card({ item, featured = false }: { item: MediaCard; featured?: boolean }) {
  const showPlay = Boolean(item.poster) && (item.type === "Podcast" || item.type === "Video");
  const meta = [item.outlet, item.type, formatDate(item.date), item.archived ? "Archived" : null]
    .filter(Boolean)
    .join(" · ");
  return (
    <a
      className={`${featured ? "media-feature-card" : "media-card"}${!featured && item.poster ? " has-poster" : ""}`}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item.poster ? (
        <span className="shot">
          <img src={item.poster} alt="" width={480} height={360} />
          {showPlay ? <PlayMark /> : null}
        </span>
      ) : null}
      <span className="copy">
        <span className="meta">{meta}</span>
        <span className="title">
          {item.title}
          <ExternalMark />
        </span>
        {item.summary ? <span className="sum">{item.summary}</span> : null}
      </span>
    </a>
  );
}

export function MediaBrowser({
  items,
  featured,
}: {
  items: MediaCard[];
  featured: MediaCard[];
}) {
  const [filters, setFilters] = useState<Filters>({ type: "all", year: "all", q: "" });
  const [shown, setShown] = useState(PAGE_SIZE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const apply = () => {
      setFilters(readFilters());
      setShown(PAGE_SIZE);
    };
    apply();
    setReady(true);
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  function update(next: Partial<Filters>) {
    const value = { ...filters, ...next };
    setFilters(value);
    setShown(PAGE_SIZE);
    writeFilters(value);
  }

  const years = useMemo(() => {
    const found = new Set<number>();
    for (const item of items) {
      if (item.year) found.add(item.year);
    }
    return [...found].sort((a, b) => b - a);
  }, [items]);

  const decades = useMemo(() => {
    const found = new Set<number>();
    for (const year of years) found.add(Math.floor(year / 10) * 10);
    return [...found].sort((a, b) => b - a);
  }, [years]);

  const searched = items.filter((item) => matchesQuery(item, filters.q.trim()));
  const yearScoped = searched.filter((item) => matchesYear(item, filters.year));
  const chipType = TYPE_CHIPS.find((chip) => chip.id === filters.type) || TYPE_CHIPS[0];
  const results = yearScoped.filter((item) => (chipType.type ? item.type === chipType.type : true));
  const visible = results.slice(0, shown);
  const filtersActive = filters.type !== "all" || filters.year !== "all" || filters.q.trim() !== "";
  const showFeatured = !filtersActive && featured.length > 0;

  const groups: { label: string; items: MediaCard[] }[] = [];
  for (const item of visible) {
    const label = item.year ? String(item.year) : "Undated";
    const last = groups[groups.length - 1];
    if (!last || last.label !== label) groups.push({ label, items: [item] });
    else last.items.push(item);
  }

  return (
    <div data-media-ready={ready ? "true" : "false"}>
      <section>
        <div className="wrap">
          {showFeatured ? (
            <>
              <h2>Featured</h2>
              <div className="media-feature">
                {featured.map((item) => (
                  <Card key={item.id} item={item} featured />
                ))}
              </div>
            </>
          ) : null}
          <div className={`media-filters${showFeatured ? " after-feature" : ""}`}>
          <div className="media-chips" role="group" aria-label="Type">
            {TYPE_CHIPS.map((chip) => {
              const count = chip.type
                ? yearScoped.filter((item) => item.type === chip.type).length
                : yearScoped.length;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={filters.type === chip.id ? "is-on" : undefined}
                  aria-pressed={filters.type === chip.id}
                  onClick={() => update({ type: chip.id })}
                >
                  {chip.label} <span>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="media-tools">
            <div className="field">
              <label htmlFor="media-q">Search</label>
              <input
                id="media-q"
                type="search"
                value={filters.q}
                placeholder="Title, outlet or summary"
                onChange={(event) => update({ q: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="media-year">Year</label>
              <select id="media-year" value={filters.year} onChange={(event) => update({ year: event.target.value })}>
                <option value="all">All years</option>
                {decades.map((decade) => (
                  <optgroup key={decade} label={`${decade}s`}>
                    <option value={`${decade}s`}>All of the {decade}s</option>
                    {years
                      .filter((year) => Math.floor(year / 10) * 10 === decade)
                      .map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                  </optgroup>
                ))}
                <option value="undated">Undated</option>
              </select>
            </div>
          </div>
          </div>

          {results.length === 0 ? (
            <p className="lead">No appearances match that search.</p>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <h2 className="media-year">{group.label}</h2>
                <div className="media-list">
                  {group.items.map((item) => (
                    <Card key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))
          )}
          {shown < results.length ? (
            <p className="more">
              <button type="button" className="btn" onClick={() => setShown((count) => count + PAGE_SIZE)}>
                Show more
              </button>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
