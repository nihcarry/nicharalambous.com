/**
 * Contact form client component.
 *
 * Handles form state, submission to Formspree, and success/error feedback.
 * Separated from the page to allow server-side metadata export.
 *
 * Fields per plan:
 * - Name (required)
 * - Email (required)
 * - Company/Organisation (required)
 * - Role/Title
 * - Event type (dropdown)
 * - Preferred keynote topic (dropdown)
 * - Event date
 * - Estimated audience size
 * - Budget range (optional dropdown)
 * - Additional details (textarea)
 */
"use client";

import { useState } from "react";
import { trackFormSubmission } from "@/lib/analytics";

/* ---------- Formspree endpoint ---------- */

const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/placeholder";

/* ---------- Form options ---------- */

const EVENT_TYPES = [
  "Conference",
  "Corporate Event",
  "Team Offsite",
  "Webinar",
  "Other",
];

const KEYNOTE_TOPICS = [
  "Reclaiming Focus: The DIAL Framework",
  "How to Build Breakthrough Product Teams",
  "The Curiosity Catalyst",
  "Custom / Not Sure Yet",
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $20,000",
  "$20,000+",
  "Prefer not to say",
];

/* ---------- Shared input styles ---------- */

const inputStyles =
  "mt-1 block w-full border border-brand-300 bg-white px-4 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20";

/* ---------- Component ---------- */

export function ContactForm() {
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
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        trackFormSubmission("booking_inquiry");
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
      <div className="mt-12 border-2 border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-green-800">
          Thank you for your inquiry!
        </h2>
        <p className="mt-3 text-base text-green-700">
          Nic will review your request and get back to you within 48 hours.
          If your event is urgent, please email directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-6">
      {/* Name + Email row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={inputStyles}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={inputStyles}
            placeholder="you@company.com"
          />
        </div>
      </div>

      {/* Company + Role row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-brand-700">
            Company / Organisation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className={inputStyles}
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-brand-700">
            Role / Title
          </label>
          <input
            type="text"
            id="role"
            name="role"
            className={inputStyles}
            placeholder="Your role"
          />
        </div>
      </div>

      {/* Event type + Keynote topic row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-brand-700">
            Event Type
          </label>
          <select id="eventType" name="eventType" className={inputStyles}>
            <option value="">Select event type</option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="keynoteTopic" className="block text-sm font-medium text-brand-700">
            Preferred Keynote Topic
          </label>
          <select id="keynoteTopic" name="keynoteTopic" className={inputStyles}>
            <option value="">Select a keynote</option>
            {KEYNOTE_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date + Audience size row */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-brand-700">
            Event Date
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="audienceSize" className="block text-sm font-medium text-brand-700">
            Estimated Audience Size
          </label>
          <input
            type="text"
            id="audienceSize"
            name="audienceSize"
            className={inputStyles}
            placeholder="e.g. 200"
          />
        </div>
      </div>

      {/* Budget range */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-brand-700">
          Budget Range (optional)
        </label>
        <select id="budget" name="budget" className={inputStyles}>
          <option value="">Select budget range</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Additional details */}
      <div>
        <label htmlFor="details" className="block text-sm font-medium text-brand-700">
          Additional Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          className={inputStyles}
          placeholder="Tell Nic about your event, audience, and what you're hoping to achieve."
        />
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center bg-accent-600 px-6 py-3 font-bold text-xl uppercase tracking-[0.02em] text-white transition-colors hover:bg-accent-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:opacity-50 sm:w-auto"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
