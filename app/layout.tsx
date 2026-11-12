/**
 * Root layout for nicharalambous.com
 *
 * Wraps every page with the site header, footer, and global metadata.
 * Includes sitewide JSON-LD (Person + WebSite) on every page.
 * Font loading uses next/font for optimal performance.
 */
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/site/site-nav";
import { ConditionalFooter } from "@/components/conditional-footer";
import { SmartHeadingManager } from "@/components/smart-heading-manager";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@/components/google-analytics";
import { DEFAULT_DESCRIPTION, personJsonLd, websiteJsonLd } from "@/lib/metadata";
import "./globals.css";
import "./v3.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  axes: ["opsz", "wdth"],
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
    <html lang="en-GB" className={`${bricolage.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <ThemeProvider>
          <SmartHeadingManager />
          <GoogleAnalytics />
          <JsonLd data={personJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <SiteNav />
          <main id="content" className="flex-1">{children}</main>
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
