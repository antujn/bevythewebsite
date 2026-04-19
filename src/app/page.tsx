import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureDeck from "@/components/FeatureDeck";
import BundlesShowcase from "@/components/BundlesShowcase";
import GameplaySection from "@/components/GameplaySection";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <>
      <Header />

      <main id="main" tabIndex={-1}>
        <HeroSection />

        <FeatureDeck />

        <BundlesShowcase />

        <GameplaySection />

        <ReviewsSection />
      </main>

      <Footer />
    </>
  );
}
