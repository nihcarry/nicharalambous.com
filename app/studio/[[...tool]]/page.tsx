/**
 * Sanity Studio catch-all route — /studio and /studio/*
 *
 * Renders the Sanity Studio UI client-side. The [[...tool]] catch-all
 * ensures Studio sub-routes (like /studio/vision) work when accessed
 * directly. Studio handles its own internal routing via hash fragments.
 *
 * generateStaticParams returns an empty array because the Studio only
 * needs the root /studio path pre-rendered — internal routing is
 * handled client-side.
 */
import StudioClient from "../studio-client";

export function generateStaticParams(): { tool?: string[] }[] {
  // Only the root /studio path needs to be statically generated.
  // Studio handles all sub-navigation client-side (hash routing).
  return [{ tool: undefined }];
}

export default function StudioPage() {
  return <StudioClient />;
}
