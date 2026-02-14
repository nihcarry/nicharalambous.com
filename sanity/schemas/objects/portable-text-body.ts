/**
 * Rich text (Portable Text) body field.
 *
 * Used for blog posts, keynote descriptions, topic hub content, and
 * any other long-form content. Supports standard formatting plus
 * custom blocks for video embeds, code blocks, and pull quotes.
 */
import { defineArrayMember, defineType } from "sanity";

export const portableTextBody = defineType({
  name: "portableTextBody",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
          { title: "Strikethrough", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the image for accessibility and SEO.",
          validation: (rule) => rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineArrayMember({
      name: "videoEmbed",
      type: "object",
      title: "Video Embed",
      fields: [
        {
          name: "url",
          type: "url",
          title: "Video URL",
          description: "YouTube or Vimeo URL.",
          validation: (rule) => rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineArrayMember({
      name: "codeBlock",
      type: "object",
      title: "Code Block",
      fields: [
        {
          name: "language",
          type: "string",
          title: "Language",
          options: {
            list: [
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "Python", value: "python" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "Bash", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "Other", value: "text" },
            ],
          },
        },
        {
          name: "code",
          type: "text",
          title: "Code",
          validation: (rule) => rule.required(),
        },
      ],
    }),
    defineArrayMember({
      name: "pullQuote",
      type: "object",
      title: "Pull Quote",
      fields: [
        {
          name: "quote",
          type: "text",
          title: "Quote",
          validation: (rule) => rule.required(),
        },
        {
          name: "attribution",
          type: "string",
          title: "Attribution",
        },
      ],
    }),
  ],
});
