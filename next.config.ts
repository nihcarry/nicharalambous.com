import type { NextConfig } from "next";
import path from "path";

/**
 * Next.js configuration for nicharalambous.com
 *
 * Static export applies only to production builds (`next build`). In development,
 * we omit `output: "export"` so dynamic routes like `/blog/[slug]` can render
 * new Sanity posts without pre-listing every slug in `generateStaticParams`
 * (required by export mode and painful with a cached path list).
 *
 * Deployed to S3 + CloudFront. Sanity Studio runs client-side only.
 */
const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),

  // Use project root so Next.js doesn't infer parent dir (multiple lockfiles warning / broken dev)
  outputFileTracingRoot: path.resolve(process.cwd()),


  // Generate clean URLs without trailing slashes
  trailingSlash: false,

  // Optimize images for static export using Sanity's image CDN
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
