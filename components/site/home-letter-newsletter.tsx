"use client";

import { useId, useState, type FormEvent } from "react";
import { subscribeToKit } from "@/lib/kit";
import { NEWS_COPY } from "@/lib/home-letter";

/**
 * Homepage newsletter. Posts to the same Kit form as the rest of the site
 * (lib/kit.ts → KIT_SUBSCRIBE_URL). First name stays off this layout because
 * the approved letter design is email plus the button. Kit accepts email alone.
 */
export function HomeLetterNewsletter() {
  const reactId = useId();
  const emailId = `${reactId}-email`;
  const errorId = `${reactId}-error`;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const result = await subscribeToKit({ email, firstName: "" });
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="thanks" role="status">
        {NEWS_COPY.thanks}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className="email-label" htmlFor={emailId}>
        {NEWS_COPY.placeholder}
      </label>
      <input
        id={emailId}
        name="email_address"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder={NEWS_COPY.placeholder}
        value={email}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button className="btn" type="submit" disabled={sending} aria-busy={sending}>
        {sending ? NEWS_COPY.sending : NEWS_COPY.button}
      </button>
      {error ? (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
