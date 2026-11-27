import type { Metadata } from "next";
import { Mrs_Saint_Delafield, Newsreader } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { HomeLetter } from "@/components/site/home-letter";
import { HERO_COPY } from "@/lib/home-letter";
import { HOME_URL, organizationJsonLd } from "@/lib/metadata";
import "./home-letter.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
  adjustFontFallback: false,
});

const signature = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-signature",
  adjustFontFallback: false,
});

const description = `${HERO_COPY.titleBefore} ${HERO_COPY.titleEm} ${HERO_COPY.lead1.trim()}`;

export const metadata: Metadata = {
  title: { absolute: "Nic Haralambous | Keynote speaker" },
  description,
  alternates: { canonical: HOME_URL },
  openGraph: {
    title: "Nic Haralambous | Keynote speaker",
    description,
    url: HOME_URL,
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nic Haralambous | Keynote speaker",
    description,
    images: ["/og/home.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <link rel="preload" as="image" href="/v3/nic-hero-4-hd.webp" fetchPriority="high" />
      <JsonLd data={organizationJsonLd()} />
      <HomeLetter fontClassName={`${newsreader.variable} ${signature.variable}`} />
    </>
  );
}
