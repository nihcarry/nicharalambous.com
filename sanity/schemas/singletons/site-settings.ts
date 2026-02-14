/**
 * Site Settings singleton.
 *
 * Global defaults for SEO, social links, and site-wide bio.
 * Only one of these exists — configured in Sanity Studio structure.
 */
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      initialValue: "Nic Haralambous",
    }),
    defineField({
      name: "siteDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      initialValue:
        "Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses.",
    }),
    defineField({
      name: "oneLinerBio",
      title: "One-Liner Bio",
      type: "string",
      description:
        "Used everywhere: homepage H1, JSON-LD, llms.txt, social bios. Keep consistent.",
      initialValue:
        "Entrepreneur, AI product builder, and virtual keynote speaker",
    }),
    defineField({
      name: "ogImage",
      title: "Default OG Image",
      type: "image",
      description: "Fallback social sharing image when pages don't have their own.",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "twitter", title: "X (Twitter) URL", type: "url" }),
        defineField({ name: "substack", title: "Substack URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      description: "Short description shown in the site footer.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
