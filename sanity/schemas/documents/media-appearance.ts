/**
 * Media Appearance document type.
 *
 * Press mentions, podcast appearances, and video features.
 * Displayed on the /media page. Supports PodcastEpisode
 * and VideoObject JSON-LD schemas.
 */
import { defineField, defineType } from "sanity";

export const mediaAppearance = defineType({
  name: "mediaAppearance",
  title: "Media Appearance",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Podcast", value: "podcast" },
          { title: "Video", value: "video" },
          { title: "Press Article", value: "press" },
          { title: "TV/Radio", value: "broadcast" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publication",
      title: "Publication / Show Name",
      type: "string",
      description: "e.g. 'BBC', 'Fast Company', 'CNBC Africa'",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
    }),
    defineField({
      name: "url",
      title: "External URL",
      type: "url",
      description: "Link to the original appearance.",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url",
      description: "YouTube, Spotify, or other embeddable URL.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
      title: "Publication Logo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "publication", media: "logo" },
  },
});
