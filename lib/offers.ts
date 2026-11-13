/**
 * Public offer paths and structured data.
 * Team Workflow Upgrade Session has no price here. The copy doc still
 * shows a per-seat figure, and that price is being reworked.
 */

import { SITE_URL } from "@/lib/site";

export const INTRO_CALL_URL = "https://calendly.com/nharry/output-paradox-intro";

export const INTRO_CALL_LABEL = "Not sure yet? Book a free 20-minute intro call";

export const PATHS = {
  workshops: "/workshops",
  team: "/workshops/team-workflow-upgrade",
  executive: "/workshops/executive-workflow-upgrade",
  grokWeek: "/workshops/my-week-with-grok-bot",
  coaching: "/coaching",
} as const;

/**
 * Homepage card in the "I speak, I coach and I write" row.
 * "workshops-plus-coaching" is the default.
 * "coaching-only" is the alternate card from the copy doc.
 */
export const HOMEPAGE_COACHING_CARD: "workshops-plus-coaching" | "coaching-only" =
  "workshops-plus-coaching";

const PERSON = {
  "@type": "Person",
  name: "Nic Haralambous",
  url: `${SITE_URL}/`,
};

function pageUrl(path: string) {
  return `${SITE_URL}${path}`;
}

function pricedOffer(price: number, unitText: string) {
  return {
    "@type": "Offer",
    price: String(price),
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(price),
      priceCurrency: "EUR",
      valueAddedTaxIncluded: false,
      unitText,
    },
  };
}

/** Base price €4,999. Extra seats are described. No discount. */
export function teamWorkshopJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Team Workflow Upgrade Session",
    serviceType: "Workshop",
    description:
      "A hands-on workshop for up to 8 senior leaders from one company. 2 hours, €4,999 per session, ex VAT, plus €499 per extra seat up to 10. Virtual by default.",
    url: pageUrl(PATHS.team),
    provider: PERSON,
    offers: pricedOffer(4999, "session"),
  };
}

export function executiveWorkshopJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Executive Workflow Upgrade Session",
    serviceType: "Workshop",
    description:
      "A 2-hour one-to-one session for a CEO. Virtual by default. €1,499 excluding VAT.",
    url: pageUrl(PATHS.executive),
    provider: PERSON,
    offers: pricedOffer(1499, "session"),
  };
}

export function grokWeekJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "My week with Grok Bot",
    serviceType: "Workshop",
    description:
      "A 90-minute show-and-tell for up to 20 people. €2,999 per session, excluding VAT. Virtual by default.",
    url: pageUrl(PATHS.grokWeek),
    provider: PERSON,
    offers: pricedOffer(2999, "session"),
  };
}

export function coachingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Accountability business coaching",
    serviceType: "Business coaching",
    description:
      "Two 60-minute calls a month, plus ongoing accountability and chat support. €399 a month, excluding VAT.",
    url: pageUrl(PATHS.coaching),
    provider: PERSON,
    offers: pricedOffer(399, "month"),
  };
}

/** Sessions named on the Output Paradox page. The team session has no price. */
export function followOnSessionsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sessions after the talk",
    itemListElement: [
      { "@type": "ListItem", position: 1, item: grokWeekJsonLd() },
      { "@type": "ListItem", position: 2, item: teamWorkshopJsonLd() },
      { "@type": "ListItem", position: 3, item: executiveWorkshopJsonLd() },
      { "@type": "ListItem", position: 4, item: coachingJsonLd() },
    ],
  };
}
