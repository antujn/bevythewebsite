import type { Metadata } from "next";
import Link from "next/link";
import { APP_STORE_URL, APP_FULL_NAME, APP_STORE_ID } from "@/lib/appStore";

/**
 * Press / About route.
 *
 * Not linked from the main nav — a discoverable page meant for
 * journalists, bloggers, and partners who want brand assets, the
 * one-line product brief, and the canonical App Store link. Indexable
 * and SEO-friendly so searches like "bevy app press kit" or
 * "bevy truth or dare download" have a clear landing page.
 *
 * Assets linked below already live in /public/images (logo, bundle
 * screenshots) and in /videos (gameplay clips), so no new files are
 * needed for the initial kit.
 */
export const metadata: Metadata = {
  title: "Press & Brand Kit",
  description:
    "Press kit, brand assets, and download links for Bevy — the AI-powered Truth or Dare card game. Logos, screenshots, product one-liner, and founder contact.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Bevy — Press & Brand Kit",
    description:
      "Press kit, brand assets, and download links for Bevy — the AI-powered Truth or Dare card game.",
    url: "/press",
    type: "article",
  },
  robots: { index: true, follow: true },
};

const pressQuickFacts = [
  { label: "Product", value: APP_FULL_NAME },
  { label: "Category", value: "Party Games / Card Games (iOS)" },
  { label: "Platforms", value: "iPhone (iOS 17+)" },
  { label: "App Store ID", value: APP_STORE_ID },
  { label: "Pricing", value: "Free · Optional Premium (IAP)" },
  { label: "Rating", value: "4.7 / 5 from 25K+ App Store reviews" },
  { label: "Creator", value: "Anant Jain · London, UK" },
  { label: "Contact", value: "bevytheapp@gmail.com" },
];

const pressBrief =
  "Bevy is a modern take on Truth or Dare for real conversations — a library of over 1,000 hand-written prompts organized into eleven themed bundles (date night, long-term partners, house parties, NSFW, co-workers, extreme dares, and more), plus a BevyAI play partner for solo sessions. The game is hand-tuned to avoid recycled internet prompts and middle-school clichés; every card is reviewed for inclusivity, tone, and social intelligence.";

const assets = [
  {
    title: "Logo — full lockup",
    href: "/images/icons/bevy-logo.png",
    note: "512×512 PNG, transparent background",
  },
  {
    title: "App icon",
    href: "/icon-512.png",
    note: "512×512 PNG, rounded",
  },
  {
    title: "Open Graph share card",
    href: "/opengraph-image",
    note: "1200×630 auto-generated, matches the current brand palette",
  },
  {
    title: "iPhone mockup (hero)",
    href: "/images/mockups/iphone-17-pro-mockup.png",
    note: "Use with Bevy's gameplay screenshots to show the app in-device",
  },
  {
    title: "Bundle tiles (11 screenshots)",
    href: "/images/bundles/bundle-significant-other.png",
    note: "All 11 bundle images live under /images/bundles/",
  },
];

const links = [
  { label: "App Store listing", href: APP_STORE_URL, external: true },
  { label: "Instagram — @bevytheapp", href: "https://www.instagram.com/bevytheapp", external: true },
  { label: "TikTok — @bevytheapp", href: "https://www.tiktok.com/@bevytheapp", external: true },
  { label: "Email — bevytheapp@gmail.com", href: "mailto:bevytheapp@gmail.com", external: true },
];

export default function PressPage() {
  return (
    <main id="main" tabIndex={-1} style={{ paddingTop: 132, paddingBottom: 100 }}>
      {/* The section-overlay + background body gradient live on the
          layout, so this page only needs content. */}
      <div className="site-shell">
        <article className="mx-auto max-w-[820px]">
          <header style={{ marginBottom: 48 }}>
            <p className="kicker">Press</p>
            <h1
              className="section-title"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--ember-bright)",
                fontStyle: "italic",
              }}
            >
              Bevy — Truth or Dare, <span style={{ color: "var(--cream)", fontStyle: "normal" }}>reimagined.</span>
            </h1>
            <div className="gold-line mt-4" style={{ marginInline: 0 }} />
          </header>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, marginBottom: 16, color: "var(--text-main)" }}>
              One-liner
            </h2>
            <p className="legal-copy" style={{ marginBottom: 0 }}>{pressBrief}</p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, marginBottom: 16, color: "var(--text-main)" }}>
              Quick facts
            </h2>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                rowGap: 10,
                columnGap: 24,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              {pressQuickFacts.map((f) => (
                <div
                  key={f.label}
                  style={{ display: "contents" }}
                >
                  <dt style={{ color: "var(--text-soft)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11, alignSelf: "center" }}>
                    {f.label}
                  </dt>
                  <dd style={{ color: "var(--text-main)", margin: 0 }}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, marginBottom: 16, color: "var(--text-main)" }}>
              Brand assets
            </h2>
            <p className="legal-copy" style={{ marginBottom: 16 }}>
              Direct links to canonical logos, screenshots, and the generated Open
              Graph card. Please keep the ember accent colors intact in downstream
              usage — do not tint the cream body copy or swap the rose italic with
              a different accent.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {assets.map((a) => (
                <li key={a.title} style={{ marginBottom: 12 }}>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-copy"
                    style={{ fontWeight: 600, color: "var(--ember-bright)", textDecoration: "none" }}
                  >
                    {a.title} &rarr;
                  </a>
                  <span style={{ color: "var(--text-soft)", fontSize: 13, marginLeft: 12 }}>
                    {a.note}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, marginBottom: 16, color: "var(--text-main)" }}>
              Product palette
            </h2>
            <p className="legal-copy" style={{ marginBottom: 16 }}>
              Bevy&rsquo;s visual identity is a cinematic wine-black atmosphere
              with a single warm accent — ember (#d9523a / #e86848) — and a rose
              italic (#c14c4c) reserved for editorial payoffs (&ldquo;They&rsquo;re
              felt.&rdquo;).
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[
                { hex: "#0d0505", name: "Background" },
                { hex: "#f4eee5", name: "Cream" },
                { hex: "#d9523a", name: "Ember" },
                { hex: "#e86848", name: "Ember bright" },
                { hex: "#6b0f10", name: "Crimson" },
                { hex: "#c14c4c", name: "Rose" },
              ].map((c) => (
                <div
                  key={c.hex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 92,
                    padding: 10,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      background: c.hex,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    aria-hidden
                  />
                  <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-soft)", marginTop: 10 }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-main)", fontFamily: "var(--font-plus-jakarta)" }}>
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 500, marginBottom: 16, color: "var(--text-main)" }}>
              Links
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((l) => (
                <li key={l.href} style={{ marginBottom: 10 }}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--ember-bright)", textDecoration: "none" }}
                    >
                      {l.label} &rarr;
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      style={{ color: "var(--ember-bright)", textDecoration: "none" }}
                    >
                      {l.label} &rarr;
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="legal-copy" style={{ fontSize: 13, color: "var(--text-soft)" }}>
              &larr;{" "}
              <Link href="/" style={{ color: "var(--text-sub)" }}>
                Back to Bevy
              </Link>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
