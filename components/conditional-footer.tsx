/**
 * ConditionalFooter — renders the site Footer on all pages except the homepage.
 *
 * On the homepage ("/"), the footer content is rendered as the final slide
 * inside the SlideDeck instead, so we hide the global Footer to avoid duplication.
 */
import { Footer } from "@/components/footer";

export function ConditionalFooter() {
  return <Footer />;
}
