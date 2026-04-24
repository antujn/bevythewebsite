import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DownloadProvider } from "@/components/DownloadContext";
import MotionProvider from "@/components/MotionProvider";
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

// https://schema.org/MobileApplication — helps Google surface the app
// with rating + price in rich search results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
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
  author: {
    "@type": "Person",
    name: "Anant Jain",
  },
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
        <MotionProvider>
          <DownloadProvider>{children}</DownloadProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
