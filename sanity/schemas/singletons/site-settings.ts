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
        "Nic Haralambous is an entrepreneur, AI product builder, and keynote speaker. He speaks in person or virtually. 4 startup exits, 3 books, and 20+ years building technology businesses.",
    }),
    defineField({
      name: "oneLinerBio",
      title: "One-Liner Bio",
      type: "string",
      description:
        "Used everywhere: homepage H1, JSON-LD, llms.txt, social bios. Keep consistent.",
      initialValue:
        "Entrepreneur, AI product builder, and keynote speaker",
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
    defineField({
      name: "stageClipUrl",
      title: "Stage clip URL",
      type: "url",
      description:
        "60 to 90 second stage recording. Leave empty until the London recording exists. The site hides the player when this is empty.",
    }),
    defineField({
      name: "approvedTestimonial",
      title: "Named testimonial",
      type: "object",
      description:
        "Third quote on the Output Paradox page. Renders only when name, role, company, quote and photo are all filled.",
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "role", title: "Role", type: "string" }),
        defineField({ name: "company", title: "Company", type: "string" }),
        defineField({
          name: "photo",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "sectionPatterns",
      title: "Section patterns",
      type: "array",
      description:
        "Optional wallpaper overrides. Pages use the v3 assignments when this is empty.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "sectionId", title: "Section id", type: "string" }),
            defineField({
              name: "pattern",
              title: "Pattern",
              type: "string",
              options: {
                list: [
                  "beard",
                  "calendar",
                  "broadcast",
                  "mic",
                  "speech",
                  "envelope",
                  "quill",
                  "cta",
                  "foot",
                  "spotlight",
                  "bookmark",
                  "pen",
                  "lightbulb",
                  "person",
                ].map((value) => ({ title: value, value })),
              },
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
