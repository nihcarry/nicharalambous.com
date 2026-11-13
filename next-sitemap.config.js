/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Canonical host is www. Do not read SITE_URL here: an apex value would
  // publish the wrong host in the sitemap and robots.txt.
  siteUrl: "https://www.nicharalambous.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  // Home is the only URL with a trailing slash. Other paths stay slash-free,
  // matching next.config `trailingSlash: false`.
  transform: async (config, path) => {
    const isHome = path === "/";
    const dates = await loadUpdatedAt();
    return {
      loc: path,
      lastmod: dates[path] || (config.autoLastmod ? new Date().toISOString() : undefined),
      changefreq: config.changefreq,
      priority: config.priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: isHome,
    };
  },

  // Studio, search, archived drafts, the RSS file, and privacy (until Nic
  // supplies wording; keep in sync with PRIVACY_NOINDEX in lib/site.ts).
  // /session is a meta refresh to /coaching. Index the coaching URL.
  exclude: [
    "/session",
    "/studio",
    "/studio/*",
    "/archive/*",
    "/search",
    "/api",
    "/api/**",
    "/rss.xml",
    "/privacy",
  ],

  // Allow major crawlers, including AI crawlers, across the public site.
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/"],
      },
    ],
    additionalSitemaps: [],
  },
};

let updatedAtPromise;
function loadUpdatedAt() {
  if (!updatedAtPromise) {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lsivhm7f";
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
    const query = `*[_type in ["post","keynote","book","topicHub"] && (!defined(contentStatus) || contentStatus == "published")]{
      _type, "slug": slug.current, _updatedAt
    }`;
    const url = `https://${projectId}.apicdn.sanity.io/v2026-02-14/data/query/${dataset}?query=${encodeURIComponent(query)}`;
    updatedAtPromise = fetch(url)
      .then((response) => (response.ok ? response.json() : { result: [] }))
      .then((json) => {
        const prefix = { post: "/blog/", keynote: "/keynotes/", book: "/books/", topicHub: "/topics/" };
        const map = {};
        for (const doc of json.result || []) {
          if (!doc.slug || !doc._updatedAt || !prefix[doc._type]) continue;
          map[prefix[doc._type] + doc.slug] = doc._updatedAt;
        }
        return map;
      })
      .catch(() => ({}));
  }
  return updatedAtPromise;
}
