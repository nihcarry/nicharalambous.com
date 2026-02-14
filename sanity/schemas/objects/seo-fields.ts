/**
 * Reusable SEO fields object.
 *
 * Attached to every content type that needs search engine optimization.
 * Provides overrides for title tag, meta description, OG image, and
 * canonical URL. Fields are optional — defaults come from the page template.
 */
import { defineField, defineType } from "sanity";

export const seoFields = defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Override for the <title> tag. If empty, uses the page title.",
      validation: (rule) => rule.max(70).warning("Keep under 70 characters for best results in search."),
    }),
    defineField({
      name: "seoDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Appears in search engine results. Aim for 150-160 characters.",
      validation: (rule) => rule.max(160).warning("Keep under 160 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description:
        "Shared when this page is linked on social media. Recommended: 1200x630px.",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      description:
        "Override the canonical URL. Only use if this content also lives elsewhere.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "If checked, adds noindex to this page.",
      initialValue: false,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
