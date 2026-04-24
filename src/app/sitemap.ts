import type { MetadataRoute } from "next";
import { bundleCatalog } from "@/lib/bundles";
import { changelog } from "@/lib/changelog";

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
 *   /                       homepage (priority 1)
 *   /faq                    standalone FAQ (priority 0.8 — high-intent search)
 *   /compare                Bevy vs traditional (priority 0.8 — comparison queries)
 *   /changelog              release history (priority 0.6 — freshness signal)
 *   /press                  brand kit + press contact (priority 0.6)
 *   /bundles/<slug>         11 per-bundle SEO landing pages (0.7 each)
 *   /privacy /terms /disclaimer  legal (priority 0.4)
 *
 * The `lastModified` for each route is chosen deliberately rather than
 * always being `now`:
 *   - homepage + marketing routes → the latest changelog publish date
 *     (tells Google the site shipped content when the app last updated)
 *   - legal routes                → the legal layout's own LEGAL_LAST_UPDATED
 *     constant (kept in `now` here because importing it would pull a
 *     client-component module into a server-only file; bump by hand)
 *
 * When new routes appear, add them here. The bundle + changelog lists
 * are derived from shared catalogs so adding a new bundle or release
 * automatically rebuilds the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  // Latest release timestamp — represents when the site's content
  // (copy, bundle list, release notes) most recently changed.
  const latestReleaseDate = changelog[0]?.date
    ? new Date(`${changelog[0].date}T00:00:00Z`)
    : now;

  const bundles: MetadataRoute.Sitemap = bundleCatalog.map((b) => ({
    url: `${base}/bundles/${b.slug}`,
    lastModified: latestReleaseDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: latestReleaseDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/faq`,
      lastModified: latestReleaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/compare`,
      lastModified: latestReleaseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/changelog`,
      lastModified: latestReleaseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/press`,
      lastModified: latestReleaseDate,
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
