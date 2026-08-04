/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.nicharalambous.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,

  // Exclude studio and draft routes from sitemap
  // /keynotes/output-paradox-v2 is a temporary design preview — remove this
  // entry when the redesign is flipped onto the live keynote page.
  exclude: [
    "/studio",
    "/studio/*",
    "/archive/*",
    "/search",
    "/api",
    "/api/**",
    "/keynotes/output-paradox-v2",
  ],

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
