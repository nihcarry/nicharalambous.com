/**
 * Keynote document type.
 *
 * Individual keynote topics available for booking.
 * Rendered at /keynotes/{slug}. Each keynote links to /speaker
 * and to related topic hubs per the internal linking strategy.
 */
import { defineField, defineType } from "sanity";

export const keynote = defineType({
  name: "keynote",
  title: "Keynote",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "One-line hook for this keynote.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableTextBody",
    }),
    defineField({
      name: "deliveryFormat",
      title: "Delivery Format",
      type: "string",
      description:
        "Every keynote is offered in person or virtually. Older documents may still store virtual, hybrid, or in-person. The site shows all of them as in person or virtual.",
      options: {
        list: [
          { title: "In person or virtual", value: "in-person-or-virtual" },
          { title: "In person or virtual (stored as virtual)", value: "virtual" },
          { title: "In person or virtual (stored as hybrid)", value: "hybrid" },
          { title: "In person or virtual (stored as in-person)", value: "in-person" },
        ],
      },
      initialValue: "in-person-or-virtual",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: "e.g. '45 minutes'",
    }),
    defineField({
      name: "audiences",
      title: "Target Audiences",
      type: "array",
      of: [{ type: "string" }],
      description: "Who is this keynote for?",
    }),
    defineField({
      name: "outcomes",
      title: "What Attendees Leave With",
      type: "array",
      of: [{ type: "string" }],
      description: "Key takeaways / outcomes for the audience.",
    }),
    defineField({
      name: "topics",
      title: "Related Topic Hubs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topicHub" }] }],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
    defineField({
      name: "videoEmbed",
      title: "Video Embed URL",
      type: "url",
      description: "YouTube or Vimeo URL for demo/sizzle reel.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tagline" },
  },
});
