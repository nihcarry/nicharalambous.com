export const CONSENT_KEY = "nh-consent";

/** Fired after the visitor accepts or rejects, including when storage is blocked. */
export const CONSENT_EVENT = "nh-consent";

/** The stored choice is kept for six calendar months, then the banner returns. */
export const CONSENT_MONTHS = 6;

export type ConsentChoice = "accepted" | "rejected";

type StoredConsent = {
  choice: ConsentChoice;
  expiresAt: number;
};

/** GA4 Consent Mode v2. Nothing is granted until the visitor accepts. */
export const CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
} as const;

/**
 * Accept turns on analytics only. The banner does not ask for ads,
 * so every other Consent Mode type stays denied.
 */
export const CONSENT_GRANTED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "granted",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "denied",
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

/** Drop GA cookies on this host, the parent domain, and the root path. */
export function clearAnalyticsCookies(measurementId: string) {
  if (typeof document === "undefined") return;
  const suffix = measurementId.replace(/^G-/, "");
  const names = ["_ga", `_ga_${suffix}`];
  const host = window.location.hostname;
  const domains = new Set<string>([host, `.${host}`]);
  const parts = host.split(".").filter(Boolean);
  if (parts.length >= 2) {
    const root = parts.slice(-2).join(".");
    domains.add(root);
    domains.add(`.${root}`);
  }
  const paths = new Set(["/", window.location.pathname || "/"]);
  for (const name of names) {
    for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
      }
    }
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
