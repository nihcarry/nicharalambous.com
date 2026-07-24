/**
 * Pay What You Can Afford coaching application form.
 *
 * Submits via FormSubmit.co which emails submissions directly to Nic.
 * Nic reviews applications and manages accepted clients in Notion.
 */
"use client";

import { useState } from "react";
import { trackFormSubmission } from "@/lib/analytics";

const CONTACT_EMAIL = "nic@nharry.com";
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const inputStyles =
  "mt-1 block w-full border border-brand-300 bg-white px-4 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20";

export function PwycaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        trackFormSubmission("pwyca_application");
        setSubmitted(true);
        form.reset();
      } else {
        setError("Something went wrong. Please try again or email directly.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 border-2 border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-xl font-bold text-green-800">
          Application received
        </h3>
        <p className="mt-3 text-base text-green-700">
          Nic will review your application and get back to you. Spots are
          limited to 5 clients per month.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <input type="hidden" name="_captcha" value="false" />
      <input
        type="hidden"
        name="_subject"
        value="New PWYCA Coaching Application from nicharalambous.com"
      />
      <input type="hidden" name="_template" value="table" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-brand-700"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            className={inputStyles}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-brand-700"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className={inputStyles}
            placeholder="City, country"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-brand-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputStyles}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-brand-700"
          >
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className={inputStyles}
            placeholder="+31 6 0000 0000"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="linkedin"
          className="block text-sm font-medium text-brand-700"
        >
          LinkedIn URL <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="linkedin"
          name="linkedin"
          required
          className={inputStyles}
          placeholder="https://linkedin.com/in/you"
        />
      </div>

      <div>
        <label
          htmlFor="goals"
          className="block text-sm font-medium text-brand-700"
        >
          What are you hoping to achieve through working with Nic?{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="goals"
          name="goals"
          required
          rows={5}
          className={inputStyles}
          placeholder="Tell Nic about where you are, what you're building, and what you want from coaching."
        />
      </div>

      <div>
        <label
          htmlFor="afford"
          className="block text-sm font-medium text-brand-700"
        >
          What can you afford to pay for coaching?{" "}
          <span className="text-red-500">*</span>
        </label>
        <p className="mt-1 font-mono text-xs leading-relaxed text-brand-500">
          Paying €0 is totally fine. Nic limits this programme to 5 clients per
          month. That&apos;s why there&apos;s an application.
        </p>
        <input
          type="text"
          id="afford"
          name="afford"
          required
          className={inputStyles}
          placeholder="e.g. €0, €50/session, or whatever works for you"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center bg-accent-600 px-6 py-3 text-xl font-bold uppercase tracking-[0.02em] text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Sending..." : "Submit Application"}
      </button>
    </form>
  );
}
