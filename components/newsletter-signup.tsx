"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

/**
 * Native newsletter form. The site is a static export with no server
 * runtime, so the browser posts straight to Kit. next.config.ts does
 * not set headers, rewrites, or a content security policy that would
 * block app.kit.com.
 */
const KIT_SUBSCRIBE_URL = "https://app.kit.com/forms/10044760/subscriptions";

const COPY = {
  heading: "Get my weekly newsletter",
  subtext: "Thinking on business, work and philosophy. One email a week.",
  button: "Subscribe",
  success: "Thanks, you're in. See you in your inbox.",
  error: "Could not subscribe right now. Please try again.",
} as const;

type NewsletterSignupProps = {
  /** section: full homepage block. compact: shared footer row. */
  variant?: "section" | "compact";
};

/* 16px text and a 44px minimum box: iOS zooms focused fields under 16px. */
const inputClassName =
  "mt-1 block min-h-11 w-full border border-brand-300 bg-white px-4 py-3 text-base text-brand-900 placeholder:text-brand-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 max-md:scroll-mb-28";

const buttonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-none bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-[var(--shadow-cta)] transition-colors duration-200 hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-60 max-md:scroll-mb-28";

export function NewsletterSignup({ variant = "section" }: NewsletterSignupProps) {
  const reactId = useId();
  const emailId = `${reactId}-email`;
  const nameId = `${reactId}-first-name`;
  const errorId = `${reactId}-error`;
  const compact = variant === "compact";

  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    let locked = false;

    function nudge(target: EventTarget | null) {
      if (locked || !mobile.matches) return;
      if (!(target instanceof HTMLElement)) return;
      const field = target.closest("[data-newsletter] input, [data-newsletter] button");
      if (!(field instanceof HTMLElement)) return;

      const nav = document.querySelector("nav[aria-label='Mobile navigation']");
      const navTop = nav?.getBoundingClientRect().top ?? window.innerHeight;
      const viewport = window.visualViewport;
      const visibleBottom = Math.min(
        navTop,
        viewport ? viewport.offsetTop + viewport.height : window.innerHeight,
      );
      const overlap = field.getBoundingClientRect().bottom - (visibleBottom - 16);
      if (overlap > 1) {
        locked = true;
        window.scrollBy({ top: overlap, left: 0, behavior: "instant" });
        locked = false;
      }
    }

    function onFocusIn(event: FocusEvent) {
      nudge(event.target);
    }

    function onViewportChange() {
      nudge(document.activeElement);
    }

    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("scroll", onViewportChange);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("scroll", onViewportChange);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    const body = new FormData();
    body.set("email_address", emailAddress.trim());
    body.set("fields[first_name]", firstName.trim());

    try {
      const response = await fetch(KIT_SUBSCRIBE_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      if (!response.ok) {
        setError(COPY.error);
        return;
      }

      setSucceeded(true);
    } catch {
      setError(COPY.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      data-newsletter={variant}
      className={compact ? "text-left" : "mx-auto max-w-xl text-left"}
    >
      <div className={compact ? "lg:flex lg:items-end lg:justify-between lg:gap-10" : undefined}>
        <div className={compact ? "lg:max-w-sm lg:shrink-0" : undefined}>
          <h2
            className={
              compact
                ? "text-base font-bold tracking-tight text-brand-900"
                : "heading-display-stroke-sm text-center text-4xl text-brand-900 sm:text-5xl"
            }
          >
            {COPY.heading}
          </h2>
          <p
            className={
              compact
                ? "mt-1 text-sm leading-relaxed text-brand-600"
                : "mt-4 text-center text-lg leading-relaxed text-brand-700"
            }
          >
            {COPY.subtext}
          </p>
        </div>

        {succeeded ? (
          <p
            role="status"
            className={
              compact
                ? "mt-4 text-sm font-medium text-brand-900 lg:mt-0"
                : "mt-8 text-center text-lg font-medium text-brand-900"
            }
          >
            {COPY.success}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={compact ? "mt-4 lg:mt-0 lg:min-w-0 lg:flex-1" : "mt-8"}
          >
            <div className={compact ? "flex flex-col gap-3 sm:flex-row sm:items-end" : "grid gap-4 sm:grid-cols-2"}>
              <div className={compact ? "sm:w-40 sm:shrink-0" : undefined}>
                <label htmlFor={nameId} className="block text-sm font-medium text-brand-700">
                  First name
                </label>
                <input
                  id={nameId}
                  name="fields[first_name]"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="First name"
                  className={inputClassName}
                />
              </div>
              <div className={compact ? "sm:min-w-0 sm:flex-1" : undefined}>
                <label htmlFor={emailId} className="block text-sm font-medium text-brand-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id={emailId}
                  name="email_address"
                  type="email"
                  required
                  autoComplete="email"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  className={inputClassName}
                />
              </div>
              <div className={compact ? "sm:shrink-0" : "flex justify-center sm:col-span-2"}>
                <button
                  type="submit"
                  disabled={sending}
                  aria-busy={sending}
                  className={compact ? `${buttonClassName} w-full sm:w-auto` : buttonClassName}
                >
                  {COPY.button}
                </button>
              </div>
            </div>
            {error ? (
              <p id={errorId} role="alert" className="mt-3 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
