/**
 * Root layout for nicharalambous.com
 *
 * Wraps every page with the site header, footer, and global metadata.
 * Includes sitewide JSON-LD (Person + WebSite) on every page.
 * Font loading uses next/font for optimal performance.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { personJsonLd, websiteJsonLd } from "@/lib/metadata";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        {/* Sitewide structured data */}
        <JsonLd data={personJsonLd()} />
        <JsonLd data={websiteJsonLd()} />

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
