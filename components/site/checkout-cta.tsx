import { checkoutHref, type CheckoutOffer } from "@/lib/checkout-links";
import { CHECKOUT_PLACEHOLDER, INTRO_CALL_LABEL, INTRO_CALL_URL } from "@/lib/offers";

export function CheckoutButton({
  id,
  offer,
  label,
}: {
  id: string;
  offer: CheckoutOffer;
  label: string;
}) {
  const href = checkoutHref(offer);
  if (href) {
    return (
      <a id={id} className="btn wrap" data-offer={offer} href={href}>
        {label}
      </a>
    );
  }
  return (
    <span className="buy-slot">
      <span id={id} className="btn wrap static" data-offer={offer} data-checkout="tbc">
        {label}
      </span>
      <span className="tbc-line">{CHECKOUT_PLACEHOLDER}</span>
    </span>
  );
}

export function IntroCallLink() {
  return (
    <a className="link" href={INTRO_CALL_URL} target="_blank" rel="noopener noreferrer">
      {INTRO_CALL_LABEL}
    </a>
  );
}
