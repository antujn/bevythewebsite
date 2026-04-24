import type { Metadata } from "next";
import Link from "next/link";
import { changelog } from "@/lib/changelog";
import { APP_STORE_URL, APP_FULL_NAME } from "@/lib/appStore";

/**
 * /changelog — public release history.
 *
 * Gives Google + LLMs a "freshness" signal (when does Bevy ship?
 * what did the last release include?), gives journalists/bloggers
 * a concise "what's new" reference, and gives players a reason to
 * check back between App Store updates. Content is driven by
 * src/lib/changelog.ts — add a new entry at the top for every ship.
 *
 * Each entry emits as a Schema.org SoftwareApplication release via
 * the `softwareVersion` property on the page-level SoftwareApplication
 * graph below, so LLMs can query "latest version of Bevy" and get a
 * structured answer.
 */
export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release history for Bevy — the AI-powered Truth or Dare card game app. What's new in each version of the app, listed newest first.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "Bevy Changelog",
    description:
      "Release history for Bevy — what's new in each version of the app.",
    url: "/changelog",
    type: "article",
  },
  robots: { index: true, follow: true },
};

const categoryLabel: Record<string, string> = {
  feature: "New",
  content: "Content",
  improvement: "Improved",
  fix: "Fixed",
};

export default function ChangelogPage() {
  const latest = changelog[0];

  // One JSON-LD graph that lists every release as a structured
  // SoftwareApplicationRelease-ish entity. Schema.org doesn't have a
  // dedicated "Release" type, so we model each entry as an
  // `SoftwareApplication` with `softwareVersion` and
  // `releaseNotes`, linked from a parent `SoftwareApplication`.
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bevy",
    alternateName: APP_FULL_NAME,
    applicationCategory: "GameApplication",
    operatingSystem: "iOS",
    downloadUrl: APP_STORE_URL,
    softwareVersion: latest.version,
    releaseNotes: latest.headline,
    // Each historical release goes into `hasPart` so LLMs can query
    // "what changed in Bevy 2.0?" and walk the graph.
    hasPart: changelog.map((entry) => ({
      "@type": "SoftwareApplication",
      name: `Bevy ${entry.version}`,
      softwareVersion: entry.version,
      datePublished: entry.date,
      releaseNotes: [entry.headline, ...entry.changes.map((c) => c.text)].join(
        "\n- ",
      ),
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Changelog", item: "/changelog" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
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
          <article className="mx-auto max-w-[780px]">
            <header style={{ marginBottom: 48 }}>
              <p className="kicker">Release History</p>
              <h1
                className="section-title"
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  color: "var(--cream)",
                }}
              >
                What&rsquo;s{" "}
                <span className="title-accent font-bold">new.</span>
              </h1>
              <div className="gold-line mt-4" style={{ marginInline: 0 }} />
              <p
                className="section-body"
                style={{ maxWidth: 640, marginTop: 24 }}
              >
                Every version of Bevy, newest first. Install updates from the{" "}
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--ember-bright)" }}
                >
                  App Store
                </a>{" "}
                to play with the latest bundles and features.
              </p>
            </header>

            <section>
              {changelog.map((entry, i) => (
                <article
                  key={entry.version}
                  style={{
                    paddingTop: 28,
                    paddingBottom: 32,
                    borderBottom:
                      i < changelog.length - 1
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : undefined,
                  }}
                >
                  <header
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: 14,
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-plus-jakarta)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "var(--ember-bright)",
                      }}
                    >
                      v{entry.version}
                    </span>
                    <time
                      dateTime={entry.date}
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-soft)",
                      }}
                    >
                      {formatDate(entry.date)}
                    </time>
                  </header>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(22px, 2.4vw, 28px)",
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: "var(--text-main)",
                      marginBottom: 18,
                    }}
                  >
                    {entry.headline}
                  </h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {entry.changes.map((change, j) => (
                      <li
                        key={j}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "88px 1fr",
                          columnGap: 16,
                          marginBottom: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--ember-bright)",
                            padding: "4px 0",
                            fontWeight: 600,
                          }}
                        >
                          {categoryLabel[change.label] ?? change.label}
                        </span>
                        <span
                          style={{
                            fontSize: 15,
                            lineHeight: 1.65,
                            color: "var(--text-main)",
                          }}
                        >
                          {change.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>

            <p
              className="legal-copy"
              style={{
                marginTop: 32,
                fontSize: 13,
                color: "var(--text-soft)",
              }}
            >
              &larr;{" "}
              <Link href="/" style={{ color: "var(--text-sub)" }}>
                Back to Bevy
              </Link>
            </p>
          </article>
        </div>
      </main>
    </>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}
