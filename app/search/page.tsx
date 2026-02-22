import type { Metadata } from "next";
import { SearchUI } from "./search-ui";

export const metadata: Metadata = {
  title: "Search | Nic Haralambous",
  description:
    "Search blog posts, keynotes, and topics on nicharalambous.com.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <div className="container-content py-16 md:py-24">
      <h1 className="text-3xl font-bold text-brand-900 sm:text-4xl">Search</h1>
      <p className="mt-3 text-lg text-brand-600">
        Find articles, keynotes, and topics across the site.
      </p>
      <SearchUI />
    </div>
  );
}
