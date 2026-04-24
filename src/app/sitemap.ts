import type { MetadataRoute } from "next";
import { bundleCatalog } from "@/lib/bundles";

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

/**
 * Static sitemap — every crawlable route the site exposes.
 *
 *   /                         homepage (priority 1)
 *   /press                    brand kit + press contact (priority 0.6)
 *   /bundles/<slug>           11 per-bundle SEO landing pages (0.7 each —
 *                             these are the highest-search-value routes)
 *   /privacy /terms /disclaimer  legal (priority 0.4)
 *
 * When new routes appear (changelog, about, blog, etc.), add them here.
 * The bundle list is derived from the shared catalog so new bundles
 * automatically pick up a sitemap entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const bundles: MetadataRoute.Sitemap = bundleCatalog.map((b) => ({
    url: `${base}/bundles/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/press`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...bundles,
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
