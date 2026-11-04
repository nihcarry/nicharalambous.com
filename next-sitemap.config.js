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
    return {
      loc: path,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: config.changefreq,
      priority: config.priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: isHome,
    };
  },

  // Exclude studio and draft routes from sitemap
  exclude: ["/studio", "/studio/*", "/archive/*", "/search", "/api", "/api/**"],

  // robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: ["/studio", "/studio/", "/*.txt"],
      },
    ],
    additionalSitemaps: [],
  },
};
