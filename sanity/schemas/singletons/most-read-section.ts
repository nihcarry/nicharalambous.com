/**
 * Most Read Section singleton.
 *
 * Curated list of up to 5 posts for the "Most Read" block on the blog
 * listing page. Order is explicit; drag to reorder in Studio.
 */
import { defineField, defineType } from "sanity";

export const mostReadSection = defineType({
  name: "mostReadSection",
  title: "Most Read (Blog)",
  type: "document",
  fields: [
    defineField({
      name: "posts",
      title: "Top 5 Articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (rule) => rule.max(5),
      description: "Drag to reorder. Only published posts appear on the site.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Most Read (Blog)" };
    },
  },
});
