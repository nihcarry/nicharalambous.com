/**
 * Contact / Booking Page — /contact
 *
 * Structured inquiry form for booking Nic as a virtual keynote speaker.
 * Server component wrapper that exports metadata; the form is a
 * client component imported below.
 *
 * JSON-LD: ContactPage
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";
import { JsonLd } from "@/components/json-ld";
import { contactPageJsonLd } from "@/lib/metadata";
import { ContactForm } from "./contact-form";

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book Nic Haralambous for your next virtual keynote. Enquire about speaking engagements for conferences, corporate events, team offsites, and webinars.",
  alternates: { canonical: "https://nicharalambous.com/contact" },
  openGraph: {
    type: "website",
    title: "Book Nic Haralambous | Contact",
    description:
      "Enquire about virtual keynote speaking for your next event.",
    url: "https://nicharalambous.com/contact",
  },
};

/* ---------- Page ---------- */

export default function ContactPage() {
  return (
    <div className="page-bg bg-envelope-pattern">
      {/* Structured data */}
      <JsonLd data={contactPageJsonLd()} />

      <Section width="content">
        <div className="text-center">
          <h1 className="heading-display-stroke-sm text-5xl text-brand-900 sm:text-6xl">
            Book Nic for Your Event
          </h1>
          <p className="mt-4 text-lg text-brand-600">
            Virtual keynotes for conferences, corporate events, team offsites,
            and webinars. Fill out the form below and Nic will get back to you
            within 48 hours.
          </p>
        </div>

        <ContactForm />
      </Section>
    </div>
  );
}
