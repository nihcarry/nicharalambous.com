/**
 * Sanity Studio route — /studio
 *
 * Renders the Sanity Studio UI client-side. No server rendering.
 * Studio handles its own internal routing. CloudFront is configured
 * to serve this page for all /studio/* paths.
 */
import StudioClient from "./studio-client";

export default function StudioPage() {
  return <StudioClient />;
}
