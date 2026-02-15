/**
 * Sanity client configuration.
 *
 * Used at build time to fetch content from Sanity CMS via GROQ queries.
 * No runtime API calls — the site is fully static.
 *
 * IMPORTANT: This file does NOT import `next-sanity`. The `next-sanity`
 * package registers server actions internally, which are incompatible
 * with Next.js static export (`output: "export"`). Since page components
 * import this module (transitively via the image builder and queries),
 * keeping `next-sanity` out of this module tree prevents the build error.
 *
 * `next-sanity` is imported ONLY in the Sanity Studio client component
 * (`app/studio/studio-client.tsx`), which is marked `"use client"` and
 * doesn't affect the server-side build.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-14";

/**
 * Lightweight Sanity data fetcher using native fetch.
 *
 * Queries Sanity's CDN API directly at build time. Uses native fetch
 * to avoid importing any Sanity client library in the server component
 * module tree.
 */
export const client = {
  async fetch<T>(query: string, params?: Record<string, string>): Promise<T> {
    const searchParams = new URLSearchParams({ query });
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        searchParams.set(`$${key}`, JSON.stringify(value));
      }
    }

    const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${searchParams.toString()}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Sanity fetch failed: ${response.status}`);
    }

    const json = await response.json();
    return json.result as T;
  },
};
