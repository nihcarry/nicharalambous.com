/**
 * Site footer.
 *
 * Wraps FooterContent in the standard footer element with border and background.
 * Used on all pages except the homepage, where footer content is rendered
 * as the final slide instead (via ConditionalFooter).
 */
import { FooterContent } from "@/components/footer-content";

export function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-foot-pattern">
      <div className="container-wide py-16">
        <FooterContent />
      </div>
    </footer>
  );
}
