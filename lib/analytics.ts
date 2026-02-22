type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent({ action, category, label, value }: GtagEvent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

export function trackFormSubmission(formName: string) {
  trackEvent({
    action: "form_submission",
    category: "engagement",
    label: formName,
  });
}

export function trackCtaClick(destination: string, label: string) {
  trackEvent({
    action: "cta_click",
    category: "engagement",
    label: `${label} → ${destination}`,
  });
}
