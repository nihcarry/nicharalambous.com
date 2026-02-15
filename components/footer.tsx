/**
 * Site footer.
 *
 * Includes links to all key pages per the internal linking strategy.
 * /speaker, /keynotes, /topics, /blog, /about, /contact are all present.
 * Social links point to Nic's active profiles.
 */
import Link from "next/link";

const footerLinks = {
  speaking: [
    { href: "/speaker", label: "Virtual Keynote Speaker" },
    { href: "/keynotes", label: "Keynote Topics" },
    { href: "/contact", label: "Book Nic" },
  ],
  explore: [
    { href: "/businesses", label: "Building" },
    { href: "/blog", label: "Blog" },
    { href: "/topics", label: "Topics" },
    { href: "/books", label: "Books" },
    { href: "/media", label: "Media" },
  ],
  connect: [
    { href: "/about", label: "About Nic" },
    { href: "/contact", label: "Contact" },
    { href: "https://nichasgottago.substack.com/", label: "Newsletter" },
  ],
};

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/nicharalambous/",
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/nicharalambous",
    label: "X (Twitter)",
  },
  {
    href: "https://nichasgottago.substack.com/",
    label: "Substack",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-brand-50">
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-brand-900"
            >
              Nic Haralambous
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-brand-600">
              Entrepreneur, AI product builder, and virtual keynote speaker.
              4 startup exits, 3 books, 20+ years building technology businesses.
            </p>
          </div>

          {/* Speaking links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              Speaking
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.speaking.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label} &rarr;
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-600 transition-colors hover:text-brand-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label} &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-200 pt-8 md:flex-row">
          <p className="text-sm text-brand-400">
            &copy; {new Date().getFullYear()} Nic Haralambous. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/rss.xml"
              className="text-sm text-brand-400 transition-colors hover:text-brand-600"
            >
              RSS
            </Link>
            <Link
              href="/sitemap.xml"
              className="text-sm text-brand-400 transition-colors hover:text-brand-600"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
