"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureDeck from "@/components/FeatureDeck";
import BundlesShowcase from "@/components/BundlesShowcase";
import GameplaySection from "@/components/GameplaySection";
import FaqSection from "@/components/FaqSection";
import ReviewsSection from "@/components/ReviewsSection";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { useHomeMotionEpoch } from "@/components/HomeMotionEpochProvider";

export default function HomePageContent() {
  const epoch = useHomeMotionEpoch();

  return (
    <div key={`home-motion-${epoch}`}>
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
    </div>
  );
}
