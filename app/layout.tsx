/**
 * Root layout for nicharalambous.com
 *
 * Wraps every page with the site header, footer, and global metadata.
 * Includes sitewide JSON-LD (Person + WebSite) on every page.
 * Font loading uses next/font for optimal performance.
 */
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/site/site-nav";
import { ConditionalFooter } from "@/components/conditional-footer";
import { SmartHeadingManager } from "@/components/smart-heading-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { CookieConsent } from "@/components/cookie-consent";
import { DEFAULT_DESCRIPTION, personJsonLd, websiteJsonLd } from "@/lib/metadata";
import "./globals.css";
import "./v3.css";

/**
 * Unbounded (OFL) self-hosted as static woff2, latin, weights 600–800.
 * Next preloads every file in the family. The postbuild step keeps only the
 * hero weight (800) preload and drops 600 and 700.
 */
const unbounded = localFont({
  src: [
    { path: "./fonts/unbounded-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/unbounded-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/unbounded-800.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-unbounded",
  adjustFontFallback: false,
  fallback: ['"NH Unbounded Fallback"'],
  preload: true,
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
  preload: false,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
  preload: false,
});

/**
 * The web-font rules live in the deferred stylesheet, so the first paint uses
 * these local faces. Unbounded metrics are for weight 800, the hero weight,
 * so the home H1 keeps its line breaks when the woff2 replaces Arial.
 * Arial on macOS and Windows, Arimo or Liberation Sans where Arial is not installed.
 */
const FONT_FALLBACK = `
@font-face{font-family:"NH Unbounded Fallback";src:local("Arial"),local("Arimo"),local("Liberation Sans");ascent-override:68.08%;descent-override:16.76%;line-gap-override:0%;size-adjust:146.16%}
@font-face{font-family:"NH Geist Fallback";src:local("Arial"),local("Arimo"),local("Liberation Sans");ascent-override:95.94%;descent-override:28.16%;line-gap-override:0%;size-adjust:104%}
@font-face{font-family:"NH Geist Mono Fallback";src:local("Arial"),local("Arimo"),local("Liberation Sans");ascent-override:74.67%;descent-override:21.92%;line-gap-override:0%;size-adjust:134.59%}
html[data-nh-consent] .consent{display:none!important}
`;

/** Hides the banner before first paint when a choice is already stored. */
const CONSENT_BOOT = `(function(){try{var raw=localStorage.getItem("nh-consent");if(!raw)return;var stored=JSON.parse(raw);if((stored.choice==="accepted"||stored.choice==="rejected")&&typeof stored.expiresAt==="number"&&stored.expiresAt>Date.now()){document.documentElement.setAttribute("data-nh-consent",stored.choice);}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nicharalambous.com"),
  title: {
    default: "Nic Haralambous | Keynote speaker",
    template: "%s | Nic Haralambous",
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
    siteName: "Nic Haralambous - Keynote Speaker",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nicharry",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": "https://www.nicharalambous.com/rss.xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0C10",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${unbounded.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOT }} />
        <style dangerouslySetInnerHTML={{ __html: FONT_FALLBACK }} />
        <ThemeProvider>
          <SmartHeadingManager />
          <JsonLd data={personJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <SiteNav />
          <CookieConsent />
          <main id="content" className="flex-1">{children}</main>
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
