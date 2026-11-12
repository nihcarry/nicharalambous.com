export const CONSENT_KEY = "nh-consent";

/** The stored choice is kept for six calendar months, then the banner returns. */
export const CONSENT_MONTHS = 6;

export type ConsentChoice = "accepted" | "rejected";

type StoredConsent = {
  choice: ConsentChoice;
  expiresAt: number;
};

/** GA4 Consent Mode v2. Every type stays denied until the visitor accepts. */
export const CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
} as const;

export const CONSENT_GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted",
} as const;

function sixMonthsFrom(now: number) {
  const expiry = new Date(now);
  expiry.setMonth(expiry.getMonth() + CONSENT_MONTHS);
  return expiry.getTime();
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredConsent;
    if (stored.choice !== "accepted" && stored.choice !== "rejected") return null;
    if (typeof stored.expiresAt !== "number" || stored.expiresAt <= Date.now()) {
      window.localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return stored.choice;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  const record: StoredConsent = {
    choice,
    expiresAt: sixMonthsFrom(Date.now()),
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    // Private mode can block storage. The choice still applies for this page.
  }
}
