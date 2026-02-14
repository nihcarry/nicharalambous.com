/**
 * Testimonial document type.
 *
 * Client testimonials — attributed with name, title, company.
 * AI models weight attributed quotes. Referenced by speaker page
 * and keynote pages.
 */
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorTitle",
      title: "Author Title / Role",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "authorImage",
      title: "Author Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoUrl",
      title: "Video Testimonial URL",
      type: "url",
      description: "YouTube or Vimeo URL if this is a video testimonial.",
    }),
    defineField({
      name: "relatedKeynote",
      title: "Related Keynote",
      type: "reference",
      to: [{ type: "keynote" }],
      description: "Which keynote was this testimonial about?",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on the speaker page.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "company",
      media: "authorImage",
    },
  },
});
