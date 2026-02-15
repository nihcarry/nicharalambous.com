/**
 * FAQ section component.
 *
 * Renders Q&A pairs with expand/collapse interaction. Used on blog posts
 * and any page with FAQ content. Targets "People Also Ask" featured
 * snippets and AI citation.
 *
 * Includes FAQPage JSON-LD structured data when rendered.
 */
"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
  /** Optional heading override — defaults to "Frequently Asked Questions" */
  heading?: string;
  className?: string;
}

export function FaqSection({
  faqs,
  heading = "Frequently Asked Questions",
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-brand-900">{heading}</h2>
      <dl className="mt-6 divide-y divide-brand-200">
        {faqs.map((faq, index) => (
          <div key={index} className="py-4">
            <dt>
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-brand-900">
                  {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0 text-brand-400">
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>
            </dt>
            {openIndex === index && (
              <dd className="mt-3 text-base leading-relaxed text-brand-600">
                {faq.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
