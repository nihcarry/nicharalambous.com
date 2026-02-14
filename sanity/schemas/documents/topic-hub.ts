/**
 * Topic Hub document type.
 *
 * Cluster pages that bridge blog content to keynotes.
 * 7 topic hubs: curiosity, innovation, entrepreneurship, focus, ai, agency, failure.
 * Each hub links to related keynotes and to /speaker.
 */
import { defineField, defineType } from "sanity";

export const topicHub = defineType({
  name: "topicHub",
  title: "Topic Hub",
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
      name: "oneSentenceSummary",
      title: "One-Sentence Summary",
      type: "string",
      description:
        "AI-readable definition. Appears at the top of the topic hub page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "definition",
      title: "Definition",
      type: "portableTextBody",
      description: "What this topic means — in Nic's words.",
    }),
    defineField({
      name: "whyItMatters",
      title: "Why It Matters",
      type: "portableTextBody",
      description: "Why this topic matters for teams and organisations.",
    }),
    defineField({
      name: "relatedKeynotes",
      title: "Related Keynotes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "keynote" }] }],
      description: "Keynotes that cover this topic.",
    }),
    defineField({
      name: "featuredPosts",
      title: "Featured Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      description: "Best articles in this topic cluster.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "oneSentenceSummary" },
  },
});
