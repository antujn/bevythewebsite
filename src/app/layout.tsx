import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DownloadProvider } from "@/components/DownloadContext";
import MotionProvider from "@/components/MotionProvider";
import BfcacheGuard from "@/components/BfcacheGuard";
import { APP_FULL_NAME, APP_STORE_ID, APP_STORE_URL } from "@/lib/appStore";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/**
 * Derive the canonical site URL from Vercel's automatic env vars so we
 * don't hardcode a domain that isn't wired up yet. Preference order:
 *   1. VERCEL_PROJECT_PRODUCTION_URL — the production deployment's URL
 *      (stable across preview branches)
 *   2. VERCEL_URL — the current deployment (e.g. preview URL)
 *   3. localhost for `next dev` / local builds
 */
function getSiteUrl(): URL {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

const siteUrl = getSiteUrl();

// A single `@graph` emitting every top-level entity the site wants
// search engines + LLMs to recognise:
//
//   MobileApplication  — the product. Rating + price + download URL.
//   Organization       — the publisher. Entity-linking target for
//                        "who makes Bevy" type queries.
//   Person             — the creator. Entity-linking target for
//                        author/founder queries.
//   WebSite            — enables sitelinks search box in Google
//                        and gives LLMs a stable canonical URL.
//
// Emitting as a single JSON-LD block (vs four separate <script> tags)
// lets search engines resolve cross-references via `@id` — e.g. the
// `MobileApplication.author` points at the `Person`'s `@id` below.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MobileApplication",
      "@id": `${siteUrl.toString()}#product`,
      name: "Bevy",
      alternateName: APP_FULL_NAME,
      description:
        "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ carefully crafted cards. Designed to deepen human connection.",
      applicationCategory: "GameApplication",
      operatingSystem: "iOS",
      url: siteUrl.toString(),
      image: new URL("/opengraph-image", siteUrl).toString(),
      downloadUrl: APP_STORE_URL,
      installUrl: APP_STORE_URL,
      author: { "@id": `${siteUrl.toString()}#creator` },
      publisher: { "@id": `${siteUrl.toString()}#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        bestRating: "5",
        ratingCount: "25000",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl.toString()}#organization`,
      name: "Bevy",
      url: siteUrl.toString(),
      logo: new URL("/icon-512.png", siteUrl).toString(),
      founder: { "@id": `${siteUrl.toString()}#creator` },
      email: "bevytheapp@gmail.com",
      sameAs: [
        "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490",
        "https://www.instagram.com/bevytheapp",
        "https://www.tiktok.com/@bevytheapp",
      ],
    },
    {
      "@type": "Person",
      "@id": `${siteUrl.toString()}#creator`,
      name: "Anant Jain",
      jobTitle: "Founder",
      worksFor: { "@id": `${siteUrl.toString()}#organization` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl.toString()}#website`,
      url: siteUrl.toString(),
      name: "Bevy",
      description:
        "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards. Designed to deepen human connection.",
      publisher: { "@id": `${siteUrl.toString()}#organization` },
      inLanguage: "en-US",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: APP_FULL_NAME,
    // Each sub-route with its own metadata.title gets framed as
    // "<route title> · Bevy" automatically (e.g. "Privacy Policy · Bevy").
    template: "%s · Bevy",
  },
  description:
    "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards. Designed to deepen human connection.",
  applicationName: "Bevy",
  keywords: [
    "Truth or Dare",
    "card game",
    "party game",
    "date night game",
    "couples questions",
    "BevyAI",
    "ice breaker app",
    "conversation starters",
    "iOS card game",
  ],
  authors: [{ name: "Anant Jain" }],
  creator: "Anant Jain",
  publisher: "Anant Jain",
  alternates: {
    // Explicit canonical URL per Google best-practice — stops preview
    // deployments (`*.vercel.app`) from being indexed alongside prod.
    canonical: "/",
  },
  // Search-engine ownership verification. Each key emits one
  // `<meta name="<engine>-site-verification" content="…">` tag
  // (except `other`, which emits raw `<meta name="…">` pairs for
  // engines that don't follow the `-site-verification` convention).
  // Required once per engine during property setup, then kept
  // permanently so Google / Bing / etc. can re-verify ownership
  // even if the DNS path ever changes.
  verification: {
    // Google Search Console → Google organic search + AI Overviews.
    google: "F1wVYWMFhfM3dCACA2LN2GxLmoLuU1Gn4fXHsvBuQts",
    // Bing Webmaster Tools → Bing organic search. Also the backing
    // index for ChatGPT's web-browsing tool, so being verified here
    // specifically improves visibility in LLM-cited results.
    other: {
      "msvalidate.01": "897FE365FC3C66BEB588D3923663B139",
    },
  },
  // Give crawlers (including AI crawlers like GPTBot and Google-Extended)
  // explicit permission to use the full page content — no snippet length
  // cap, large image previews, full video previews. This is the SEO side
  // of the "you're welcome here" signal started in robots.ts.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: APP_FULL_NAME,
    description:
      "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards.",
    // Relative URL resolves against metadataBase above.
    url: "/",
    siteName: "Bevy",
    type: "website",
    locale: "en_US",
    // og:image tags are injected by src/app/opengraph-image.tsx — Next
    // generates the width/height/type automatically from the file's
    // exported `size` + `contentType` so we don't repeat them here.
  },
  twitter: {
    card: "summary_large_image",
    title: APP_FULL_NAME,
    description:
      "The modern, meaningful alternative to traditional truth or dare.",
    // Attribute shared cards to the brand account. Twitter will reuse
    // og:image when twitter:image isn't specified, so the same
    // generated share card covers both platforms.
    site: "@bevytheapp",
    creator: "@bevytheapp",
  },
  // iOS Safari smart banner. Adds a sticky iTunes-branded "View" pill
  // at the top of the page when the user is on iPhone, deep-linking
  // straight to the App Store listing. Higher install conversion than
  // a CTA click for iPhone sessions. Using `appleWebApp` here ships
  // the corresponding `<meta name="apple-itunes-app">` tag.
  appleWebApp: {
    title: "Bevy",
    statusBarStyle: "black-translucent",
  },
  other: {
    // Smart-banner directive. The `app-argument` is a URL that the app,
    // if installed, receives via AppDelegate to deep-link into a
    // specific screen — we point at the site root so the app treats
    // the tap as "open from web-marketing," but can be tightened later
    // (e.g. app-argument=/bundles/date-night for a per-bundle page).
    "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${siteUrl.toString()}`,
  },
  // Icons are supplied via Next.js file conventions:
  //   src/app/icon.png       → <link rel="icon">
  //   src/app/apple-icon.png → <link rel="apple-touch-icon">
  //   src/app/manifest.ts    → <link rel="manifest">
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body>
        {/* JSON-LD structured data. Rendered inline so crawlers see it in
            the initial HTML without waiting for JS. Using
            dangerouslySetInnerHTML avoids React escaping the quotes
            inside the stringified JSON. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Skip-link for keyboard users. Invisible until focused; lets
            them jump past the header straight into the page content. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {/* Safari/Chrome can restore the previous page from bfcache
            on browser back, freezing motion hooks, scroll trackers,
            and IntersectionObservers in their pre-navigation state.
            BfcacheGuard listens for the `pageshow` event with
            `persisted: true` and reloads the page to reinitialise
            everything cleanly. See the component for details. */}
        <BfcacheGuard />
        <MotionProvider>
          <DownloadProvider>{children}</DownloadProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
