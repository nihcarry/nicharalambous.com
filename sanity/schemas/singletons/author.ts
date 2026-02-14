/**
 * Author singleton.
 *
 * Just Nic for now, but structured as a document type for extensibility.
 * Referenced by blog posts for the Article JSON-LD author field.
 */
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
