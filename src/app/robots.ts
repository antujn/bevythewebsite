import type { MetadataRoute } from "next";

function getSiteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Allow all crawlers and point them at the sitemap. Disallow /_next/
 * so bots don't crawl Next.js internals.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/_next/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
