"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface PagefindResult {
  id: string;
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

interface PagefindResponse {
  results: Array<{ id: string; data: () => Promise<PagefindResult> }>;
}

interface PagefindInstance {
  search: (query: string) => Promise<PagefindResponse>;
  debouncedSearch: (
    query: string,
    options?: Record<string, unknown>,
    ms?: number,
  ) => Promise<PagefindResponse | null>;
}

export function SearchUI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const pagefindRef = useRef<PagefindInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadPagefind() {
      try {
        // Pagefind JS is generated post-build into /pagefind/; loaded at runtime only
        const pf = await new Function(
          'return import("/pagefind/pagefind.js")',
        )();
        pagefindRef.current = pf;
        setReady(true);
      } catch {
        // Pagefind index doesn't exist in dev mode
      }
    }
    loadPagefind();
  }, []);

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (!pagefindRef.current || value.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await pagefindRef.current.debouncedSearch(value, {}, 300);
        if (!response) return;

        const data = await Promise.all(
          response.results.slice(0, 20).map((r) => r.data()),
        );
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <div className="mt-8">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={ready ? "Search articles, keynotes, topics..." : "Loading search..."}
          disabled={!ready}
          className="w-full border border-brand-300 bg-white py-4 pl-12 pr-12 text-base text-brand-900 placeholder:text-brand-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 disabled:opacity-50"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {loading && (
        <p className="mt-6 text-sm text-brand-500">Searching...</p>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <p className="mt-6 text-sm text-brand-500">
          No results found for &ldquo;{query}&rdquo;. Try a different search
          term.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-brand-500">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((result) => (
            <a
              key={result.id}
              href={result.url}
              className="block border border-brand-200 p-5 transition-colors hover:border-accent-500 hover:bg-brand-50"
            >
              <h2 className="text-lg font-semibold text-brand-900">
                {result.meta?.title || "Untitled"}
              </h2>
              <p
                className="mt-2 text-sm leading-relaxed text-brand-600"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
