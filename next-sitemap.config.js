/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.nicharalambous.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // Exclude studio and draft routes from sitemap
  exclude: ["/studio", "/studio/*", "/archive/*", "/search", "/api", "/api/**"],

  // robots.txt configuration
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
