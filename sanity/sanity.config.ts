/**
 * Sanity Studio configuration.
 *
 * Embedded in the Next.js app at /studio. Configures the content
 * structure with grouped navigation for singletons, content types,
 * and migration tools.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { viewOnSiteAction } from "./actions/view-on-site";
import { viewBuildStatusAction } from "./actions/view-build-status";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "nicharalambous",
  title: "Nic Haralambous",

  projectId,
  dataset,

  plugins: [
    presentationTool({
      previewUrl: {
        origin:
          typeof window !== "undefined" && window.location.hostname === "localhost"
            ? "http://localhost:3001"
            : (process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || "http://localhost:3001"),
        preview: "/",
      },
      resolve: {
        locations: {
          post: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? { locations: [{ title: doc.title || "Post", href: `/blog/${doc.slug}` }] }
                : undefined,
          },
          keynote: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? { locations: [{ title: doc.title || "Keynote", href: `/keynotes/${doc.slug}` }] }
                : undefined,
          },
          topicHub: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? { locations: [{ title: doc.title || "Topic", href: `/topics/${doc.slug}` }] }
                : undefined,
          },
          book: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) =>
              doc?.slug
                ? { locations: [{ title: doc.title || "Book", href: `/books/${doc.slug}` }] }
                : undefined,
          },
          speaker: {
            select: { title: "title" },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || "Speaker Page", href: "/speaker" }],
            }),
          },
        },
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Singletons group
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.listItem()
              .title("Speaker Page")
              .child(
                S.document()
                  .schemaType("speaker")
                  .documentId("speakerPage")
              ),
            S.listItem()
              .title("Author")
              .child(
                S.document().schemaType("author").documentId("mainAuthor")
              ),

            S.divider(),

            // Content types
            S.listItem()
              .title("Keynotes")
              .child(S.documentTypeList("keynote").title("Keynotes")),
            S.listItem()
              .title("Topic Hubs")
              .child(S.documentTypeList("topicHub").title("Topic Hubs")),

            S.divider(),

            // Blog posts with status filtering
            S.listItem()
              .title("Blog Posts")
              .child(
                S.list()
                  .title("Blog Posts")
                  .items([
                    S.listItem()
                      .title("All Posts")
                      .child(
                        S.documentTypeList("post")
                          .title("All Posts")
                          .defaultOrdering([
                            { field: "publishedAt", direction: "desc" },
                          ])
                      ),
                    S.listItem()
                      .title("Published")
                      .child(
                        S.documentList()
                          .title("Published Posts")
                          .filter(
                            '_type == "post" && contentStatus == "published"'
                          )
                      ),
                    S.listItem()
                      .title("AI Drafts")
                      .child(
                        S.documentList()
                          .title("AI Drafts")
                          .filter(
                            '_type == "post" && contentStatus == "ai-draft"'
                          )
                      ),
                    S.listItem()
                      .title("In Review")
                      .child(
                        S.documentList()
                          .title("In Review")
                          .filter(
                            '_type == "post" && contentStatus == "in-review"'
                          )
                      ),
                    S.listItem()
                      .title("Archived")
                      .child(
                        S.documentList()
                          .title("Archived Posts")
                          .filter(
                            '_type == "post" && contentStatus == "archived"'
                          )
                      ),
                  ])
              ),

            S.divider(),

            // Supporting content
            S.listItem()
              .title("Books")
              .child(S.documentTypeList("book").title("Books")),
            S.listItem()
              .title("Media Appearances")
              .child(
                S.documentTypeList("mediaAppearance").title(
                  "Media Appearances"
                )
              ),
            S.listItem()
              .title("Testimonials")
              .child(
                S.documentTypeList("testimonial").title("Testimonials")
              ),
            S.listItem()
              .title("Businesses")
              .child(
                S.documentTypeList("business").title("Businesses")
              ),

            S.divider(),

            // Migration tools
            S.listItem()
              .title("Redirects")
              .child(
                S.documentTypeList("redirect").title("Redirects")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2026-02-14" }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      const actionTypes = [
        "post",
        "keynote",
        "topicHub",
        "book",
        "mediaAppearance",
        "business",
        "speaker",
        "siteSettings",
      ];

      if (!actionTypes.includes(context.schemaType)) return prev;

      const extra =
        context.schemaType === "siteSettings"
          ? [viewBuildStatusAction]
          : [viewOnSiteAction, viewBuildStatusAction];

      return [...extra, ...prev];
    },
  },
});
