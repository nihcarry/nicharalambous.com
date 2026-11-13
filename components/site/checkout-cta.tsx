import { checkoutHref, type CheckoutOffer } from "@/lib/checkout-links";
import { INTRO_CALL_LABEL, INTRO_CALL_URL } from "@/lib/offers";

export function CheckoutButton({
  id,
  offer,
  label,
}: {
  id: string;
  offer: CheckoutOffer;
  label: string;
}) {
  const href = checkoutHref(offer) || "#checkout";
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
