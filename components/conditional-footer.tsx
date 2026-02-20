/**
 * ConditionalFooter — renders the site Footer on all pages except the homepage.
 *
 * On the homepage ("/"), the footer content is rendered as the final slide
 * inside the SlideDeck instead, so we hide the global Footer to avoid duplication.
 */
"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  /* Homepage, speaker, and keynotes render footer as last slide in SlideDeck; skip global footer */
  if (pathname === "/" || pathname === "/speaker" || pathname === "/keynotes") return null;

  return <Footer />;
}
