/**
 * Speaker page singleton.
 *
 * THE money page — `/speaker`. Contains all content sections for the
 * primary conversion page for booking a keynote, in person or virtually.
 */
import { defineField, defineType } from "sanity";

export const speaker = defineType({
  name: "speaker",
  title: "Speaker Page",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "H1 Headline",
      type: "string",
      description: "Primary heading.",
      initialValue: "Keynote speaker for curious, modern teams",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
      description: "Supporting text below the headline.",
    }),
    defineField({
      name: "whyBookNic",
      title: "Why Book Nic",
      type: "portableTextBody",
      description: "Differentiators: why Nic, not someone else.",
    }),
    defineField({
      name: "howVirtualWorks",
      title: "How Delivery Works",
      type: "portableTextBody",
      description:
        "Explain the keynote in person or virtually. The field name stays howVirtualWorks so existing content still loads.",
    }),
    defineField({
      name: "clientLogos",
      title: "Client Logos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Company Name" },
          ],
        },
      ],
      description: "Logos of companies that have booked you.",
    }),
    defineField({
      name: "asSeenAt",
      title: "As Seen At",
      type: "array",
      of: [{ type: "string" }],
      description: "List of events/companies, including SXSW, Standard Bank, Vodacom, etc.",
    }),
    defineField({
      name: "testimonials",
      title: "Featured Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question", validation: (rule) => rule.required() },
            { name: "answer", type: "text", title: "Answer", validation: (rule) => rule.required() },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
      description: "Structured FAQ for featured snippets and AI readability.",
    }),
    defineField({
      name: "videoEmbed",
      title: "Sizzle Reel / Demo Video",
      type: "url",
      description: "YouTube or Vimeo URL for the speaker demo video.",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
      initialValue: "Book Nic for Your Next Event",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Speaker Page" };
    },
  },
});
