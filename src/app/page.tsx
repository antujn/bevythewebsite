import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureDeck from "@/components/FeatureDeck";
import BundlesShowcase from "@/components/BundlesShowcase";
import GameplaySection from "@/components/GameplaySection";
import FaqSection from "@/components/FaqSection";
import ReviewsSection from "@/components/ReviewsSection";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { bundleCatalog } from "@/lib/bundles";

/**
 * Page-level ItemList JSON-LD for the 11 bundles. Helps LLMs + search
 * engines understand the homepage's bundle dial as an enumerable
 * collection (ranked, each item has its own canonical sub-page), so
 * answers to queries like "what bundles does Bevy have?" can be
 * generated directly from structured data instead of from dial HTML.
 *
 * Paired with the ItemList, each entry points at its own
 * MobileApplication sub-entity so LLMs have deep-linkable targets.
 */
const bundleItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bevy bundle collection",
  description:
    "Eleven themed prompt bundles — each one tuned to a specific mood, audience, and intensity.",
  numberOfItems: bundleCatalog.length,
  itemListElement: bundleCatalog.map((b, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `/bundles/${b.slug}`,
    name: b.label,
    description: b.description,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bundleItemListJsonLd),
        }}
      />
      <ScrollProgressBar />
      <Header />

      <main id="main" tabIndex={-1}>
        <HeroSection />

        <FeatureDeck />

        <BundlesShowcase />

        <GameplaySection />

        <ReviewsSection />

        <FaqSection />
      </main>

      <Footer />
    </>
  );
}
