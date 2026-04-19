import type { MetadataRoute } from "next";

/**
 * Derive the canonical site URL the same way layout.tsx does, so the
 * sitemap always matches wherever the deployment currently lives.
 */
function getSiteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

// Static sitemap — every route the site exposes. When routes are added
// later (press page, FAQ, changelog, etc.), add them here.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
