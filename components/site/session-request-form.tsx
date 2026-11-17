"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ENQUIRY_ENDPOINT } from "@/lib/site";
import {
  SESSION_OFFERS,
  sessionOffer,
  sessionRequestPayload,
  validateSessionRequest,
  type SessionRequestErrors,
} from "@/lib/session-request";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="form-error" role="alert">
      {message}
    </p>
  );
}

export function SessionRequestForm() {
  const [offer, setOffer] = useState("");
  const [fromLink, setFromLink] = useState(false);
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("offer");
    if (sessionOffer(code)) {
      setOffer(code as string);
      setFromLink(true);
    }
  }, []);
  const [errors, setErrors] = useState<SessionRequestErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const chosen = sessionOffer(offer);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    const input = {
      offer: String(data.get("offer") || ""),
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      teamSize: String(data.get("team_size") || ""),
      preferredDates: String(data.get("preferred_dates") || ""),
      message: String(data.get("message") || ""),
      honey: String(data.get("_honey") || ""),
    };
    const nextErrors = validateSessionRequest(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("Check the highlighted fields and try again.");
      return;
    }
    if (input.honey.trim()) {
      setDone(true);
      return;
    }

    setSending(true);
    setFormError(null);
    const body = new FormData();
    for (const [key, value] of Object.entries(sessionRequestPayload(input))) body.set(key, value);
    try {
      const response = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        setFormError("Something went wrong. Please try again or email nic@nharry.com.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("Network error. Please try again or email nic@nharry.com.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="card success" role="status">
        <h2>Thanks, I will reply by email within two working days.</h2>
        <p>If it is urgent, email nic@nharry.com.</p>
        <a href="/workshops">Back to the workshops</a>
        <a href="/#newsletter">Get the weekly newsletter</a>
      </div>
    );
  }

  return (
    <form className="enquiry" id="request-a-session" onSubmit={onSubmit} noValidate>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="offer" value={offer} />
      {fromLink && chosen ? (
        <div className="grp">
          <span className="lab">Session</span>
          <p style={{ margin: 0 }}>
            <b>{chosen.title}</b>
            <br />
            {chosen.detail}
          </p>
        </div>
      ) : (
        <div className="grp">
          <span className="lab" id="offer-label">
            Which session?
          </span>
          <div className="seg" role="radiogroup" aria-labelledby="offer-label">
            {SESSION_OFFERS.map((item) => (
              <label className="opt" key={item.value}>
                <input
                  type="radio"
                  name="offer_choice"
                  value={item.value}
                  checked={offer === item.value}
                  onChange={() => setOffer(item.value)}
                />
                <b>{item.title}</b>
                {item.detail}
              </label>
            ))}
          </div>
          <FieldError message={errors.offer} />
        </div>
      )}

      <div className="two">
        <div className="field">
          <label htmlFor="request-name">Your name</label>
          <input
            id="request-name"
            name="name"
            autoComplete="name"
            placeholder="Full name"
            required
            aria-invalid={errors.name ? true : undefined}
          />
          <FieldError message={errors.name} />
        </div>
        <div className="field">
          <label htmlFor="request-email">Work email</label>
          <input
            id="request-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            aria-invalid={errors.email ? true : undefined}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="request-company">Company</label>
          <input
            id="request-company"
            name="company"
            autoComplete="organization"
            placeholder="Your company"
            required
            aria-invalid={errors.company ? true : undefined}
          />
          <FieldError message={errors.company} />
        </div>
        <div className="field">
          <label htmlFor="request-team-size">Team size</label>
          <input
            id="request-team-size"
            name="team_size"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="How many people will join"
            required
            aria-invalid={errors.teamSize ? true : undefined}
          />
          <FieldError message={errors.teamSize} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="request-dates">
          Preferred dates <em>(optional)</em>
        </label>
        <input id="request-dates" name="preferred_dates" placeholder="For example, any Tuesday in February" />
      </div>

      <div className="field">
        <label htmlFor="request-message">
          Message <em>(optional)</em>
        </label>
        <textarea
          id="request-message"
          name="message"
          rows={3}
          placeholder="What your team does today, and what you want out of the session"
        />
      </div>

      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="submit">
        <p className="micro" style={{ maxWidth: 380 }}>
          I use these details to reply to your request and nothing else. <a href="/privacy">Privacy policy</a>.
        </p>
        <button className="btn" type="submit" disabled={sending} style={{ padding: "18px 30px" }}>
          {sending ? "Sending" : "Request a session"}
        </button>
      </div>
    </form>
  );
}
