"use client";

import type { ReactNode } from "react";

interface MostPopularTopicLinkProps {
  href: string;
  children: ReactNode;
}

/**
 * Topic chip on a Most Popular card.
 *
 * The card title is a stretched link. This chip is its own link, and the
 * click handler has to live in a client component: a Server Component cannot
 * pass onClick through to the anchor during static export.
 */
export function MostPopularTopicLink({
  href,
  children,
}: MostPopularTopicLinkProps) {
  return (
    <a
      href={href}
      className="relative z-10 bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-600 transition-colors hover:bg-accent-600 hover:text-white"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {children}
    </a>
  );
}
