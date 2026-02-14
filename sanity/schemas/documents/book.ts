/**
 * Book document type.
 *
 * Nic's published books. Rendered at /books/{slug}.
 * Schema supports Book JSON-LD structured data.
 */
import { defineField, defineType } from "sanity";

export const book = defineType({
  name: "book",
  title: "Book",
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
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableTextBody",
    }),
    defineField({
      name: "publishedYear",
      title: "Year Published",
      type: "number",
    }),
    defineField({
      name: "isbn",
      title: "ISBN",
      type: "string",
    }),
    defineField({
      name: "buyLinks",
      title: "Buy Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Store Name" },
            { name: "url", type: "url", title: "URL" },
          ],
          preview: {
            select: { title: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "relatedTopics",
      title: "Related Topic Hubs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topicHub" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "coverImage" },
  },
});
