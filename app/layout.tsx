/**
 * Root layout for nicharalambous.com
 *
 * Wraps every page with the site header, footer, and global metadata.
 * Includes sitewide JSON-LD (Person + WebSite) on every page.
 * Font loading uses next/font for optimal performance.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Header } from "@/components/header";
import { ConditionalFooter } from "@/components/conditional-footer";
import { HomePageVideoBackground } from "@/components/home-page-video-background";
import { ThemeProvider } from "@/components/theme-provider";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@/components/google-analytics";
import { personJsonLd, websiteJsonLd } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nicharalambous.com"),
  title: {
    default: "Nic Haralambous | Entrepreneur, AI Product Builder, Virtual Keynote Speaker",
    template: "%s | Nic Haralambous",
  },
  description:
    "Nic Haralambous is an entrepreneur, AI product builder, and virtual keynote speaker with 4 startup exits, 3 books, and 20+ years building technology businesses.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nic Haralambous",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nicharalambous",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": "https://nicharalambous.com/rss.xml",
    },
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <GoogleAnalytics />
          {/* Sitewide structured data */}
          <JsonLd data={personJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
          <HomePageVideoBackground />

          <Header />
          <main className="flex-1 pb-[calc(var(--bottom-nav-height-mobile)+env(safe-area-inset-bottom,0px))] pt-[var(--top-branding-height-mobile)] md:pb-0 md:pt-[var(--header-height-desktop)]">{children}</main>
          <ConditionalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
