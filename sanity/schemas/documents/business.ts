/**
 * Business document type.
 *
 * Past and current businesses/exits. Displayed on the /about page
 * in a timeline format. Supports Nic's 4-exit narrative.
 */
import { defineField, defineType } from "sanity";

export const business = defineType({
  name: "business",
  title: "Business",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Company Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. 'Co-founder & CEO'",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "startYear",
      title: "Start Year",
      type: "number",
    }),
    defineField({
      name: "endYear",
      title: "End Year",
      type: "number",
      description: "Leave empty if current.",
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "string",
      options: {
        list: [
          { title: "Exit (Acquired)", value: "exit-acquired" },
          { title: "Exit (Sold)", value: "exit-sold" },
          { title: "Active", value: "active" },
          { title: "Closed", value: "closed" },
        ],
      },
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "screenshot",
      title: "Product Screenshot",
      type: "image",
      description:
        "Primary card visual for /businesses slide cards. Prefer real product or homepage screenshots.",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Chronological",
      name: "startYearDesc",
      by: [{ field: "startYear", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
