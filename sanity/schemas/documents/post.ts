/**
 * Blog Post document type.
 *
 * Core content type for the site. Supports both manually written posts
 * and AI-optimized content from the content pipeline. AI workflow fields
 * track content status, source references, and optimization notes.
 *
 * Rendered at /blog/{slug} (published) or /archive/{slug} (archived).
 */
import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    /* ---------- Core Fields ---------- */
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
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      description: "Set when content is refreshed or optimized.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt / TL;DR",
      type: "text",
      rows: 3,
      description:
        "2-3 sentence summary. AI models pull from this. Also used on blog listing.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableTextBody",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineField({
      name: "topics",
      title: "Topic Hubs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topicHub" }] }],
      description: "Every post must link to at least 1 topic hub.",
      validation: (rule) => rule.min(1).warning("Posts should link to at least one topic hub."),
    }),
    defineField({
      name: "relatedKeynote",
      title: "Related Keynote",
      type: "reference",
      to: [{ type: "keynote" }],
      description: "Link to the most relevant keynote (for contextual CTA).",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question", validation: (rule) => rule.required() },
            { name: "answer", type: "text", title: "Answer", validation: (rule) => rule.required() },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
      description: "5 Q&A pairs related to the post content. Targets 'People Also Ask' and AI citations.",
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "estimatedReadTime",
      title: "Estimated Read Time (minutes)",
      type: "number",
    }),
    defineField({
      name: "videoEmbed",
      title: "Video Embed URL",
      type: "url",
      description:
        "YouTube or Vimeo embed URL for a read-along or companion video. Displayed prominently on the post page.",
    }),
    defineField({
      name: "featured",
      title: "Featured / Most Read",
      type: "boolean",
      initialValue: false,
      description:
        "Highlight this post in the 'Most Read' hero section on the blog listing page.",
    }),
    defineField({
      name: "featuredLabel",
      title: "Featured Label",
      type: "string",
      description:
        'Custom label for the featured badge (e.g. "500K+ Reads on Medium"). Only shown when featured is true.',
      hidden: ({ parent }) => !parent?.featured,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),

    /* ---------- AI Workflow Fields ---------- */
    defineField({
      name: "contentStatus",
      title: "Content Status",
      type: "string",
      options: {
        list: [
          { title: "Archived", value: "archived" },
          { title: "AI Draft", value: "ai-draft" },
          { title: "In Review", value: "in-review" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "archived",
      description:
        "Workflow status: archived → ai-draft → in-review → published.",
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Which keynote transcript, book, or archive post this content derives from.",
    }),
    defineField({
      name: "targetKeywords",
      title: "Target Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Keywords this post is optimized for.",
    }),
    defineField({
      name: "targetTopicHub",
      title: "Target Topic Hub",
      type: "reference",
      to: [{ type: "topicHub" }],
      description: "The topic hub this post is primarily targeting.",
    }),
    defineField({
      name: "optimizationNotes",
      title: "Optimization Notes",
      type: "text",
      rows: 4,
      description:
        "What the AI changed and why. Helps human reviewers assess drafts quickly.",
    }),
    defineField({
      name: "originalUrl",
      title: "Original Squarespace URL",
      type: "url",
      description: "Used for redirect generation during migration.",
    }),
    defineField({
      name: "rawHtmlBody",
      title: "Original HTML Body",
      type: "text",
      description: "Preserved raw HTML from Squarespace import. Reference only.",
    }),
  ],
  orderings: [
    {
      title: "Published Date (Newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Content Status",
      name: "contentStatusAsc",
      by: [{ field: "contentStatus", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "contentStatus",
      media: "featuredImage",
    },
  },
});
