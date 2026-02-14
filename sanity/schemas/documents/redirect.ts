/**
 * Redirect document type.
 *
 * Maps old Squarespace URLs to new destinations.
 * Used to generate the CloudFront Function redirect map.
 * Also useful for tracking redirects as content is promoted
 * from /archive/ to /blog/.
 */
import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "Source Path",
      type: "string",
      description: "Old URL path (e.g. /blog/2020/01/01/old-slug)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "destination",
      title: "Destination Path",
      type: "string",
      description: "New URL path (e.g. /blog/new-slug)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "statusCode",
      title: "Status Code",
      type: "number",
      options: {
        list: [
          { title: "301 (Permanent)", value: 301 },
          { title: "302 (Temporary)", value: 302 },
          { title: "410 (Gone)", value: 410 },
        ],
      },
      initialValue: 301,
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "string",
      description: "Why this redirect exists.",
    }),
  ],
  preview: {
    select: { title: "source", subtitle: "destination" },
  },
});
