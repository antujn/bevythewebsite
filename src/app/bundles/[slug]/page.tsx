import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bundleCatalog, findBundle, type BundleDefinition } from "@/lib/bundles";
import { APP_STORE_URL } from "@/lib/appStore";

/**
 * Per-bundle SEO landing pages.
 *
 * Each bundle now has its own crawlable URL (`/bundles/date-night`,
 * `/bundles/baby-making`, etc.) with a dedicated hero, descriptive
 * narrative, and a topics list that expands the site's keyword
 * surface area for search queries like "truth or dare date night
 * questions" or "baby making dare game."
 *
 * Pages are fully static — `generateStaticParams` pre-renders all 11
 * bundles at build time, and there's no dynamic fetching.
 */

export function generateStaticParams() {
  return bundleCatalog.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = findBundle(slug);
  if (!bundle) return {};

  const title = `${bundle.label} — ${
    bundle.category === "truth"
      ? "Truth Questions"
      : bundle.category === "dare"
        ? "Dare Challenges"
        : "Custom Deck"
  }`;

  return {
    title,
    description: bundle.description,
    alternates: { canonical: `/bundles/${bundle.slug}` },
    openGraph: {
      title: `Bevy — ${bundle.label}`,
      description: bundle.description,
      url: `/bundles/${bundle.slug}`,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function BundlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = findBundle(slug);
  if (!bundle) notFound();

  // `BreadcrumbList` + product schema so Google can render a rich
  // "Home › Bundles › <bundle name>" trail in SERP and optionally
  // show a product card with price + rating inherited from the root
  // MobileApplication schema.
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Bundles", item: "/#bundles-heading" },
      {
        "@type": "ListItem",
        position: 3,
        name: bundle.label,
        item: `/bundles/${bundle.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <main
        id="main"
        tabIndex={-1}
        style={{ paddingTop: 132, paddingBottom: 100 }}
      >
        <div
          aria-hidden
          className="section-overlay pointer-events-none fixed inset-0 z-[5]"
        />

        <div className="site-shell relative z-10">
          <article className="mx-auto max-w-[880px]">
            <header style={{ marginBottom: 40 }}>
              <p className="kicker">
                {bundle.category === "truth"
                  ? "Question Bundle"
                  : bundle.category === "dare"
                    ? "Challenge Bundle"
                    : "Custom Bundle"}
              </p>
              <h1
                className="section-title"
                style={{
                  fontSize: "clamp(34px, 4.2vw, 52px)",
                  color: "var(--cream)",
                }}
              >
                {bundle.label}
              </h1>
              <div className="gold-line mt-4" style={{ marginInline: 0 }} />
            </header>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 40,
                alignItems: "center",
                marginBottom: 56,
              }}
              className="bundle-hero-grid"
            >
              <BundleHeroCopy bundle={bundle} />

              <div
                style={{
                  position: "relative",
                  borderRadius: 28,
                  overflow: "hidden",
                  background: `linear-gradient(135deg, rgba(255,255,255,0.08), transparent 55%), ${bundle.accent}`,
                  border: `1px solid ${bundle.accent}`,
                  aspectRatio: "9 / 16",
                  maxWidth: 320,
                  marginInline: "auto",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={bundle.imageSrc}
                  alt={`${bundle.label} bundle screenshot`}
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-contain"
                  priority
                />
              </div>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: 22,
                  fontWeight: 500,
                  marginBottom: 16,
                  color: "var(--text-main)",
                }}
              >
                What&rsquo;s inside
              </h2>
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {bundle.topics.map((topic) => (
                  <li
                    key={topic}
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      background: "rgba(255, 255, 255, 0.02)",
                      color: "var(--text-main)",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </section>

            <section style={{ marginBottom: 56 }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: 22,
                  fontWeight: 500,
                  marginBottom: 16,
                  color: "var(--text-main)",
                }}
              >
                Ideal for
              </h2>
              <p className="legal-copy" style={{ marginBottom: 0 }}>
                {bundle.idealFor === "group"
                  ? "Group play — house parties, team off-sites, family gatherings. Works with 3+ people."
                  : bundle.idealFor === "oneOnOne"
                    ? "One-on-one play — date nights, couples, close friend pairs. Designed for two."
                    : "Flexible — plays equally well solo with BevyAI, with a partner, or in a group of 3+."}
              </p>
            </section>

            <section style={{ marginBottom: 40 }}>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="try-bevy-btn"
              >
                Try {bundle.label} in Bevy
              </a>
            </section>

            <p className="legal-copy" style={{ fontSize: 13, color: "var(--text-soft)" }}>
              &larr;{" "}
              <Link href="/#bundles-heading" style={{ color: "var(--text-sub)" }}>
                Back to the collection
              </Link>
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

function BundleHeroCopy({ bundle }: { bundle: BundleDefinition }) {
  return (
    <div>
      <p
        className="section-body"
        style={{ marginTop: 0, fontSize: 17, lineHeight: 1.6, color: "var(--text-sub)", marginBottom: 16 }}
      >
        {bundle.description}
      </p>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.75,
          color: "var(--text-muted)",
          marginBottom: 0,
        }}
      >
        {bundle.narrative}
      </p>
    </div>
  );
}
