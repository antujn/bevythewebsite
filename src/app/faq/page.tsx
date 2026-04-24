import type { Metadata } from "next";
import Link from "next/link";
import { faqItems, buildFaqPageJsonLd } from "@/lib/faq";
import { APP_STORE_URL } from "@/lib/appStore";

/**
 * Standalone FAQ route.
 *
 * The homepage FaqSection renders the same 8 questions in an
 * interactive flippable-card rail — great for browsing, weaker for
 * SEO + LLM citation because answers only appear after a user tap.
 * This /faq page promotes the same catalog to a plain, fully-
 * expanded document: every question + answer is visible in the first
 * paint, so search engines get clean snippets and LLMs get a single
 * canonical URL to cite ("According to bevythewebsite.com/faq,…").
 *
 * The shared `buildFaqPageJsonLd()` emits the same FAQPage schema
 * that's on the homepage. Google's guidance is that duplicate
 * emission of identical content is fine — both places get indexed,
 * and the one they choose to surface depends on the query intent
 * ("bevy faq" → /faq; "is bevy free" → homepage section).
 */
export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Bevy — the AI-powered Truth or Dare card game app. Who it's for, how BevyAI works, pricing, age requirements, data privacy, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Bevy — Frequently Asked Questions",
    description:
      "Answers to common questions about Bevy: who it's for, how BevyAI works, pricing, privacy, age requirements, and more.",
    url: "/faq",
    type: "article",
  },
  robots: { index: true, follow: true },
};

export default function FaqPage() {
  const jsonLd = buildFaqPageJsonLd();

  // BreadcrumbList → cleaner SERP rendering ("Home > FAQ").
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "FAQ", item: "/faq" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <p className="kicker">Frequently Asked Questions</p>
              <h1
                className="section-title"
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  color: "var(--cream)",
                }}
              >
                A deck of{" "}
                <span className="title-accent font-bold">answers.</span>
              </h1>
              <div className="gold-line mt-4" style={{ marginInline: 0 }} />
              <p
                className="section-body"
                style={{ maxWidth: 640, marginTop: 24 }}
              >
                Questions people ask most often about Bevy. If something&rsquo;s
                missing, email{" "}
                <a
                  href="mailto:bevytheapp@gmail.com"
                  style={{ color: "var(--ember-bright)" }}
                >
                  bevytheapp@gmail.com
                </a>
                .
              </p>
            </header>

            <section style={{ marginBottom: 48 }}>
              {faqItems.map((item, i) => (
                <article
                  key={item.q}
                  // Spacing between Q&As that reads clean on desktop AND
                  // gives enough vertical rhythm for Google to pick each
                  // Q/A as a distinct answer block.
                  style={{
                    paddingTop: 28,
                    paddingBottom: 28,
                    borderBottom:
                      i < faqItems.length - 1
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : undefined,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(20px, 2.2vw, 24px)",
                      fontWeight: 500,
                      lineHeight: 1.25,
                      color: "var(--ember-bright)",
                      fontStyle: "italic",
                      marginBottom: 14,
                    }}
                  >
                    {item.q}
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: "var(--text-main)",
                      margin: 0,
                    }}
                  >
                    {item.a}
                  </p>
                </article>
              ))}
            </section>

            <section style={{ marginBottom: 32 }}>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="try-bevy-btn"
              >
                Try Bevy
              </a>
            </section>

            <p
              className="legal-copy"
              style={{ fontSize: 13, color: "var(--text-soft)" }}
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
