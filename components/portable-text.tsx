/**
 * Portable Text renderer for Sanity rich text content.
 *
 * Handles standard blocks (headings, paragraphs, lists) plus custom
 * blocks defined in the portableTextBody schema: video embeds, code
 * blocks, and pull quotes. Styled with Tailwind typography classes.
 */
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
  type PortableTextBlock as PTBlock,
} from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

/** Custom component map for Portable Text rendering */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-bold text-brand-900 sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-brand-900 sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 text-lg font-semibold text-brand-900">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-brand-700">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-accent-400 pl-4 italic text-brand-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 space-y-2 pl-5 list-disc text-brand-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 space-y-2 pl-5 list-decimal text-brand-700">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-900">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-brand-100 px-1.5 py-0.5 text-sm font-mono text-brand-800">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal =
        href.startsWith("http") && !href.includes("nicharalambous.com");
      return (
        <a
          href={href}
          className="text-accent-600 underline hover:text-accent-500"
          {...(isExternal && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urlFor(value).width(960).auto("format").url()}
            alt={value.alt || ""}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-brand-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      if (!value?.url) return null;
      const embedUrl = getVideoEmbedUrl(value.url);
      if (!embedUrl) return null;
      return (
        <figure className="mt-8">
          <div className="aspect-video overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              title={value.caption || "Video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-brand-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      if (!value?.code) return null;
      return (
        <pre className="mt-6 overflow-x-auto rounded-lg bg-brand-900 p-4">
          <code className="text-sm text-brand-100 font-mono">
            {value.code}
          </code>
        </pre>
      );
    },
    pullQuote: ({ value }) => {
      if (!value?.quote) return null;
      return (
        <aside className="my-8 rounded-xl bg-accent-50 p-6 text-center">
          <p className="text-lg font-medium italic text-accent-800">
            &ldquo;{value.quote}&rdquo;
          </p>
          {value.attribution && (
            <p className="mt-2 text-sm text-accent-600">
              — {value.attribution}
            </p>
          )}
        </aside>
      );
    },
  },
};

/** Convert a YouTube or Vimeo URL to an embeddable URL */
function getVideoEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null;
}

/* ---------- Public API ---------- */

interface PortableTextProps {
  // Accept the loosely-typed blocks that come from Sanity GROQ queries
  value: PTBlock[] | Record<string, unknown>[] | null | undefined;
  className?: string;
}

/**
 * Render Sanity Portable Text content with consistent styling.
 * Returns null if no content is provided.
 */
export function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableTextRenderer
        value={value as PTBlock[]}
        components={components}
      />
    </div>
  );
}
