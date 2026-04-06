import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureDeck from "@/components/FeatureDeck";
import QuoteBreak from "@/components/QuoteBreak";
import BundlesShowcase from "@/components/BundlesShowcase";
import ReviewsSection from "@/components/ReviewsSection";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />

        <FeatureDeck />

        <BundlesShowcase />

        <ReviewsSection />

        <QuoteBreak download>
          &ldquo;Ask the questions
          <br />
          you&rsquo;ve always wanted to.&rdquo;
        </QuoteBreak>
      </main>

      <Footer />
    </>
  );
}
