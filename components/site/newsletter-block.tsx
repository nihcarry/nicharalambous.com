"use client";

import { useId, useState, type FormEvent } from "react";
import { subscribeToKit } from "@/lib/kit";

export function NewsletterBlock({
  heading = "I write to you every Thursday",
}: {
  heading?: string;
}) {
  const reactId = useId();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const result = await subscribeToKit({ email, firstName });
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <section className="news pd-envelope" id="newsletter">
      <div className="big-t" aria-hidden="true">
        Thursday
      </div>
      <div className="wrap grid">
        <div>
          <div className="eyebrow">The newsletter</div>
          <h2>
            {heading === "I write to you every Thursday" ? (
              <>
                I write to you every <br className="h-break" />
                Thursday
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="lead">
            Every Thursday I send one email with the three things I liked that week, and a little thinking on business and work.
          </p>
          <img
            className="px typer"
            src="/v3/px/Blog_Bottom_Left.png"
            alt="Pixel drawing of Nic at a typewriter"
            width={199}
            height={240}
            loading="lazy"
          />
        </div>
        {done ? (
          <div className="success" role="status">
            <p>Thanks, you are in. Look for me on Thursday.</p>
            <a href="/keynotes/output-paradox-reengage-teams">See the keynote</a>
            <a href="/blog">Read the blog</a>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor={`${reactId}-name`}>
                First name <em>(optional)</em>
              </label>
              <input
                id={`${reactId}-name`}
                name="first_name"
                autoComplete="given-name"
                placeholder="Nic"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${reactId}-email`}>Email</label>
              <input
                id={`${reactId}-email`}
                name="email_address"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${reactId}-error` : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button className="btn" type="submit" disabled={sending}>
              {sending ? "Sending" : "Send it to me"}
            </button>
            {error ? (
              <p id={`${reactId}-error`} className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <p className="micro">
              I email once a week. You can unsubscribe any time. <a href="/privacy">Privacy policy</a>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
