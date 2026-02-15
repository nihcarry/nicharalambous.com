/**
 * Sanity Studio route — /studio
 *
 * Renders the Sanity Studio UI client-side. No server rendering.
 * Studio handles its own internal routing via hash fragments.
 * The parent layout.tsx positions this in a full-viewport overlay
 * so the site header/footer don't interfere.
 */
import StudioClient from "./studio-client";

export default function StudioPage() {
  return <StudioClient />;
}
