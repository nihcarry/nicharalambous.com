"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { ENQUIRY_EMAIL, ENQUIRY_ENDPOINT } from "@/lib/site";
import { enquiryMailto, finishEnquiry, postEnquiry } from "@/lib/enquiry-submit";
import {
  HUMAN_EDGE_ENQUIRE_COPY,
  KEYNOTE_ENQUIRY_FORMATS,
  keynoteEnquiryPayload,
  validateKeynoteEnquiry,
  type KeynoteEnquiryErrors,
  type KeynoteEnquiryFormatValue,
} from "@/lib/human-edge";

const LEGACY_ENQUIRE_HASHES = new Set(["#book", "#checkout", "#formats"]);

export function scrollToKeynoteEnquire(focusName = true) {
  const target = document.getElementById("enquire");
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  if (window.location.hash !== "#enquire") {
    window.history.replaceState(null, "", "#enquire");
  }
  if (focusName) {
    window.setTimeout(() => {
      const field = document.getElementById("f-name");
      if (field && !field.closest("[hidden]")) {
        field.focus({ preventScroll: true });
      }
    }, 700);
  }
}

export function EnquireScrollButton({
  className = "btn",
  children,
}: {
  className?: string;
  children: string;
}) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    scrollToKeynoteEnquire(true);
  }

  return (
    <a className={className} href="#enquire" data-enquire="" onClick={onClick}>
      {children}
    </a>
  );
}

export function KeynoteEnquiryForm() {
  const [format, setFormat] = useState<KeynoteEnquiryFormatValue>("lunch-and-learn");
  const [errors, setErrors] = useState<KeynoteEnquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deliveryError, setDeliveryError] = useState(false);
  const [backgroundFailed, setBackgroundFailed] = useState(false);
  const [mailto, setMailto] = useState(`mailto:${ENQUIRY_EMAIL}`);
  const [savedPayload, setSavedPayload] = useState<Record<string, string> | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const selectedFormat =
    KEYNOTE_ENQUIRY_FORMATS.find((item) => item.value === format) ??
    KEYNOTE_ENQUIRY_FORMATS[0];

  useEffect(() => {
    function handleLegacyHash() {
      if (LEGACY_ENQUIRE_HASHES.has(window.location.hash)) {
        scrollToKeynoteEnquire(false);
      }
    }
    handleLegacyHash();
    window.addEventListener("hashchange", handleLegacyHash);
    return () => window.removeEventListener("hashchange", handleLegacyHash);
  }, []);

  useEffect(() => {
    if (done) {
      doneRef.current?.focus();
    }
  }, [done]);

  async function deliver(payload: Record<string, string>, fromFallback: boolean) {
    setSavedPayload(payload);
    setMailto(enquiryMailto(payload));
    flushSync(() => {
      setSending(true);
      setFormError(null);
      setDeliveryError(false);
      setDone(false);
      if (!fromFallback) setBackgroundFailed(false);
    });

    const result = await finishEnquiry(postEnquiry(ENQUIRY_ENDPOINT, payload), {
      onPending: () => {
        setSending(false);
        setBackgroundFailed(false);
        setDone(true);
      },
    });

    setSending(false);
    if (result.ok) {
      setBackgroundFailed(false);
      setDone(true);
      return;
    }
    setDone(false);
    if (result.pending) setBackgroundFailed(true);
    else setDeliveryError(true);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      format,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      date: String(data.get("date") || ""),
      message: String(data.get("message") || ""),
      honey: String(data.get("_honey") || ""),
    };

    const nextErrors = validateKeynoteEnquiry(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Check the highlighted fields and try again.");
      setDeliveryError(false);
      const firstId = nextErrors.name
        ? "f-name"
        : nextErrors.email
          ? "f-email"
          : nextErrors.company
            ? "f-co"
            : null;
      if (firstId) document.getElementById(firstId)?.focus();
      return;
    }

    if (input.honey.trim()) {
      setDone(true);
      return;
    }

    await deliver(keynoteEnquiryPayload(input), false);
  }

  function retry() {
    if (!savedPayload || sending) return;
    void deliver(savedPayload, true);
  }

  if (backgroundFailed) {
    return (
      <div className="enq-done enq-error-panel" role="alert" tabIndex={-1}>
        <h3>Something went wrong.</h3>
        <p>
          Please try again or <a href={mailto}>email {ENQUIRY_EMAIL}</a>.
        </p>
        <div className="enq-go">
          <button className="btn" type="button" onClick={retry} disabled={sending}>
            {sending ? HUMAN_EDGE_ENQUIRE_COPY.sendingLabel : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        className="enq"
        id="enq-form"
        onSubmit={onSubmit}
        noValidate
        hidden={done}
      >
        <div className="hp" aria-hidden="true">
          <label htmlFor="enq-company-website">Company website</label>
          <input id="enq-company-website" name="_honey" tabIndex={-1} autoComplete="off" />
        </div>

        <fieldset>
          <legend>Format</legend>
          <div className="enq-opts" role="radiogroup" aria-label="Format">
            {KEYNOTE_ENQUIRY_FORMATS.map((item) => (
              <label className="enq-opt" key={item.value}>
                <input
                  type="radio"
                  name="format"
                  value={item.value}
                  checked={format === item.value}
                  onChange={() => setFormat(item.value)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <p className="enq-note" id="fmt-note" aria-live="polite">
            {selectedFormat.note}
          </p>
        </fieldset>

        <div className="enq-grid">
          <div className="enq-f">
            <label className="l" htmlFor="f-name">
              Name
            </label>
            <input
              id="f-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
              onChange={() => {
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? (
              <p className="enq-err" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="enq-f">
            <label className="l" htmlFor="f-email">
              Work email
            </label>
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
              onChange={() => {
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email ? (
              <p className="enq-err" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="enq-f">
            <label className="l" htmlFor="f-co">
              Company
            </label>
            <input
              id="f-co"
              name="company"
              type="text"
              autoComplete="organization"
              required
              aria-invalid={errors.company ? true : undefined}
              onChange={() => {
                if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
              }}
            />
            {errors.company ? (
              <p className="enq-err" role="alert">
                {errors.company}
              </p>
            ) : null}
          </div>

          <div className="enq-f">
            <label className="l" htmlFor="f-date">
              Rough date
            </label>
            <input id="f-date" name="date" type="date" />
          </div>

          <div className="enq-f enq-wide">
            <label className="l" htmlFor="f-msg">
              Message
            </label>
            <textarea id="f-msg" name="message" />
          </div>
        </div>

        {deliveryError ? (
          <p className="enq-err enq-err-summary" role="alert">
            Something went wrong. Please try again or{" "}
            <a href={mailto}>email {ENQUIRY_EMAIL}</a>.
          </p>
        ) : null}
        {formError ? (
          <p className="enq-err enq-err-summary" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="enq-go">
          <button
            className="btn"
            type="submit"
            disabled={sending}
            aria-busy={sending || undefined}
          >
            {sending
              ? HUMAN_EDGE_ENQUIRE_COPY.sendingLabel
              : HUMAN_EDGE_ENQUIRE_COPY.submitLabel}
          </button>
        </div>
      </form>

      <div
        className="enq-done"
        id="enq-done"
        ref={doneRef}
        role="status"
        tabIndex={-1}
        hidden={!done}
      >
        <h3>{HUMAN_EDGE_ENQUIRE_COPY.successMessage}</h3>
      </div>
    </>
  );
}
