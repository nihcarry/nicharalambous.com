import type { Metadata } from "next";
import { SearchUI } from "./search-ui";

export const metadata: Metadata = {
  title: "Search | Nic Haralambous",
  description:
    "Search blog posts, keynotes, and topics on nicharalambous.com.",
  robots: { index: false },
  alternates: { canonical: "https://www.nicharalambous.com/search" },
  openGraph: { url: "https://www.nicharalambous.com/search" },
};

export default function SearchPage() {
  return (
    <div className="v3">
      <section>
        <div className="wrap">
          <h1>Search</h1>
          <p className="lead">Find articles, keynotes, and topics across the site.</p>
          <SearchUI />
        </div>
      </section>
    </div>
  );
}
