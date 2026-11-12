import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { NewsletterBlock } from "@/components/site/newsletter-block";
import { breadcrumbJsonLd } from "@/lib/metadata";
import { ENQUIRY_EMAIL, KIT_FORM_ID } from "@/lib/site";

const URL = "https://www.nicharalambous.com/privacy";

export const metadata: Metadata = {
  title: { absolute: "Privacy policy | Nic Haralambous" },
  description:
    "What Nic Haralambous collects on this website, why, and how to ask for it to be deleted. Draft wording, pending Nic's approval.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Privacy policy | Nic Haralambous",
    description: "What this site collects, why, and how to get it deleted. Draft, pending approval.",
    url: URL,
    images: [{ url: "/og/privacy.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy policy | Nic Haralambous",
    description: "Draft privacy policy. Wording pending Nic's approval.",
    images: ["/og/privacy.png"],
  },
};

const SECTIONS = [
  {
    heading: "Who I am and how to contact me",
    body: `This section will name Nic Haralambous as the person responsible for this site, and give a contact route (email ${ENQUIRY_EMAIL}) for privacy requests. Nic still needs to approve the legal wording.`,
  },
  {
    heading: "Newsletter",
    body: `This section will explain the Thursday newsletter, Kit form ${KIT_FORM_ID}, what is stored (email and optional first name), and that you can unsubscribe from any email. Nic still needs to approve the legal wording.`,
  },
  {
    heading: "Enquiry form",
    body: "This section will list the fields on the keynote enquiry form, say they are used only to reply, and say how long they are kept. Nic still needs to approve the legal wording.",
  },
  {
    heading: "Analytics and cookies",
    body: "This section will describe the analytics and cookies actually in use on this site, and nothing else. Nic still needs to confirm what is live and approve the wording.",
  },
  {
    heading: "Payments",
    body: "This section will explain Stripe, once the €999 lunch and learn checkout is live. Until that product exists, the site does not take card payments. Nic still needs to approve the legal wording.",
  },
  {
    heading: "Your rights",
    body: "This section will cover your rights under GDPR, including access, correction and deletion, and how to request them. Nic still needs to approve the legal wording.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="v3" data-no-orphan-opt-out="true">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy policy", path: "/privacy" },
        ])}
      />
      <section className="top pd-person" style={{ paddingBottom: 88 }}>
        <div className="wrap">
          <div className="eyebrow">Privacy</div>
          <h1>Privacy policy</h1>
          <p className="lead">What I collect, why, and how to get it deleted.</p>
          <p className="mono" style={{ color: "#9AA0AE", marginTop: 18 }}>
            Last updated 12/11/2026
          </p>
          <p className="draft-note">Draft. Pending Nic&apos;s wording. Not a final privacy policy.</p>
        </div>
      </section>
      <section className="p-bookmark">
        <div className="wrap prose-col">
          {SECTIONS.map((section) => (
            <article key={section.heading}>
              <h2>{section.heading}</h2>
              <div className="draft-body">
                <p>
                  <strong>Draft, pending Nic&apos;s wording.</strong> {section.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <NewsletterBlock />
    </div>
  );
}
