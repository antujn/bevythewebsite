import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { DownloadProvider } from "@/components/DownloadContext";
import MotionProvider from "@/components/MotionProvider";
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
  alternateName: "Bevy — Truth or Dare. Reimagined.",
  description:
    "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ carefully crafted cards. Designed to deepen human connection.",
  applicationCategory: "GameApplication",
  operatingSystem: "iOS",
  url: siteUrl.toString(),
  image: new URL("/opengraph-image", siteUrl).toString(),
  downloadUrl:
    "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490",
  installUrl:
    "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490",
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
  title: "Bevy — Truth or Dare. Reimagined.",
  description:
    "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards. Designed to deepen human connection.",
  openGraph: {
    title: "Bevy — Truth or Dare. Reimagined.",
    description:
      "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards.",
    // Relative URL resolves against metadataBase above.
    url: "/",
    siteName: "Bevy",
    type: "website",
    // og:image tags are injected by src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Bevy — Truth or Dare. Reimagined.",
    description:
      "The modern, meaningful alternative to traditional truth or dare.",
    // Twitter will reuse og:image when twitter:image isn't specified,
    // so the same generated share card covers both.
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
