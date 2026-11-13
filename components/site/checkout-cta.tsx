import { checkoutHref, type CheckoutOffer } from "@/lib/checkout-links";
import { INTRO_CALL_LABEL, INTRO_CALL_URL } from "@/lib/offers";

export function CheckoutButton({
  id,
  offer,
  label,
  variant = "button",
}: {
  id: string;
  offer: CheckoutOffer;
  label: string;
  variant?: "button" | "link";
}) {
  const href = checkoutHref(offer) || "#checkout";
  if (variant === "link") {
    return (
      <a id={id} className="go buy" data-offer={offer} href={href}>
        {label} <span>→</span>
      </a>
    );
  }
  return (
    <a id={id} className="btn btn-wrap" data-offer={offer} href={href}>
      {label}
    </a>
  );
}

export function IntroCallLink() {
  return (
    <a className="quiet-link" href={INTRO_CALL_URL} target="_blank" rel="noopener noreferrer">
      {INTRO_CALL_LABEL}
    </a>
  );
}
