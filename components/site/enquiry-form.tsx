"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ENQUIRY_ENDPOINT, bookNowHref, checkoutIsLive } from "@/lib/site";
import {
  BUDGET_BANDS,
  DECISION_MAKERS,
  FORMATS,
  TEAM_SIZES,
  enquiryPayload,
  formatFromQuery,
  validateEnquiry,
  type EnquiryErrors,
} from "@/lib/enquiry";

function EnquiryFields() {
  const [format, setFormat] = useState("");
  useEffect(() => {
    const next = formatFromQuery(new URLSearchParams(window.location.search).get("format"));
    if (next) setFormat(next);
  }, []);
  const [budget, setBudget] = useState("");
  const [decision, setDecision] = useState("");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const payOnline = checkoutIsLive();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      format,
      organisation: String(data.get("organisation") || ""),
      teamSize: String(data.get("team_size") || ""),
      audience: String(data.get("audience") || ""),
      dateFrom: String(data.get("date_from_display") || ""),
      dateTo: String(data.get("date_to_display") || ""),
      budget,
      decisionMaker: decision,
      decisionRole: String(data.get("decision_role") || ""),
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      honey: String(data.get("_honey") || ""),
    };
    const nextErrors = validateEnquiry(input);
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
    const payload = enquiryPayload(input);
    const body = new FormData();
    for (const [key, value] of Object.entries(payload)) body.set(key, value);

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
        <a href="/keynotes/output-paradox-reengage-teams">Back to the keynote</a>
        <a href="/#newsletter">Get the Thursday newsletter</a>
      </div>
    );
  }

  return (
    <form className="q" onSubmit={onSubmit} noValidate>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grp">
        <span className="lab" id="format-label">
          Format
        </span>
        <div className="seg" role="radiogroup" aria-labelledby="format-label">
          {FORMATS.map((item) => (
            <label className="opt" key={item.value}>
              <input
                type="radio"
                name="format"
                value={item.value}
                checked={format === item.value}
                onChange={() => setFormat(item.value)}
              />
              <b>{item.title}</b>
              {item.detail}
            </label>
          ))}
        </div>
        {errors.format ? (
          <p className="form-error" role="alert">
            {errors.format}
          </p>
        ) : null}
      </div>

      <div className="two">
        <div className="field">
          <label htmlFor="organisation">Organisation</label>
          <input
            id="organisation"
            name="organisation"
            placeholder="Your organisation"
            autoComplete="organization"
            aria-invalid={errors.organisation ? true : undefined}
            required
          />
          {errors.organisation ? (
            <p className="form-error" role="alert">
              {errors.organisation}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="team-size">Team size</label>
          <select id="team-size" name="team_size" defaultValue="">
            <option value="">Select a size</option>
            {TEAM_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} people
              </option>
            ))}
          </select>
          <span className="hint">Under 50 · 50 to 200 · 200 to 1,000 · 1,000 to 5,000 · 5,000+</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="audience">
          Who is the audience? <small>(for example, all-hands, leadership team, conference delegates)</small>
        </label>
        <input
          id="audience"
          name="audience"
          placeholder="All-hands for our product and engineering teams across three countries"
        />
      </div>

      <div className="grp">
        <span className="lab">
          Date window <small>DD/MM/YYYY</small>
        </span>
        <div className="dates">
          <DateField name="date_from_display" label="From" error={errors.dateFrom} />
          <DateField name="date_to_display" label="To" error={errors.dateTo} />
        </div>
      </div>

      <div className="grp">
        <span className="lab" id="budget-label">
          Budget band <small>in EUR, excluding VAT</small>
        </span>
        <div className="chips" role="radiogroup" aria-labelledby="budget-label">
          {BUDGET_BANDS.map((band) => (
            <label className="chip" key={band}>
              <input
                type="radio"
                name="budget"
                value={band}
                checked={budget === band}
                onChange={() => setBudget(band)}
              />
              {band}
            </label>
          ))}
        </div>
      </div>

      <div className="grp">
        <span className="lab" id="decision-label">
          Are you the decision maker?
        </span>
        <div className="chips" role="radiogroup" aria-labelledby="decision-label">
          {DECISION_MAKERS.map((option) => (
            <label className="chip" key={option}>
              <input
                type="radio"
                name="decision_maker"
                value={option}
                checked={decision === option}
                onChange={() => setDecision(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <input name="decision_role" placeholder="If not, what is their role? (optional)" />
      </div>

      <hr />

      <div className="two">
        <div className="field">
          <label htmlFor="enquiry-name">Your name</label>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            placeholder="Full name"
            required
            aria-invalid={errors.name ? true : undefined}
          />
          {errors.name ? (
            <p className="form-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="enquiry-email">Work email</label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            aria-invalid={errors.email ? true : undefined}
          />
          {errors.email ? (
            <p className="form-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="enquiry-message">
          Anything else I should know? <em>(optional)</em>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={3}
          placeholder="Themes, the challenge your team is facing, the event agenda"
        />
      </div>

      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="submit">
        <p className="micro" style={{ maxWidth: 380 }}>
          I use these details to reply to your enquiry and nothing else. <a href="/privacy">Privacy policy</a>.
        </p>
        <button className="btn" type="submit" disabled={sending} style={{ padding: "18px 30px" }}>
          {sending ? "Sending" : "Send my enquiry"}
        </button>
      </div>
      {payOnline ? null : (
        <p className="hint">Online payment is not open yet. Send the enquiry and I will reply by email.</p>
      )}
    </form>
  );
}

function DateField({ name, label, error }: { name: string; label: string; error?: string }) {
  const id = name;
  return (
    <div className="field">
      <label htmlFor={id} className="hint">
        {label}
      </label>
      <div className="in">
        <input
          id={id}
          name={name}
          inputMode="numeric"
          lang="en-GB"
          placeholder="DD/MM/YYYY"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
        />
        <input
          className="date-proxy"
          type="date"
          lang="en-GB"
          aria-label={`Choose ${label.toLowerCase()} date`}
          onChange={(event) => {
            const value = event.target.value;
            const text = event.target.previousElementSibling;
            if (!(text instanceof HTMLInputElement) || !value) return;
            const [year, month, day] = value.split("-");
            text.value = `${day}/${month}/${year}`;
          }}
        />
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm() {
  return <EnquiryFields />;
}

export function QuickBookCard() {
  const live = checkoutIsLive();
  return (
    <div className="card dk">
      <span className="mono">Want the quick version?</span>
      <h2>Book the 20-minute lunch and learn</h2>
      <p>
        {live
          ? "No form needed. Pick a date, pay online and I will be in touch to tailor it to your team."
          : "Tell me it is the lunch and learn. I will reply by email to tailor the 20 minutes to your team."}
      </p>
      <a className="btn" href={bookNowHref()} style={{ marginTop: 20 }}>
        Book now <span className="p">€999</span>
      </a>
    </div>
  );
}
