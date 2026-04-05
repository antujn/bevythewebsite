import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import QuoteBreak from "@/components/QuoteBreak";
import BundlesShowcase from "@/components/BundlesShowcase";
import ReviewsSection from "@/components/ReviewsSection";


export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />

        <FeatureSection
          id="s1"
          eyebrow="The Feeling"
          title={
            <>
              Go further,
              <br />
              feel more.
            </>
          }
          body="Behind every person you know is a conversation you haven't had yet. Bevy helps you start it."
          imageSrc="/images/illustrations/illustration5.png"
          imageAlt="An intimate moment"
        />

        <FeatureSection
          eyebrow="The Experience"
          title={
            <>
              Conversations
              <br />
              that stay with you.
            </>
          }
          body="Every card in Bevy is crafted to go beyond the surface. Questions that make you pause. Dares that make you feel alive. Moments that bond you closer to the people around you."
          imageSrc="/images/illustrations/illustration6.png"
          imageAlt="An intimate embrace"
          reverse
        />

        <QuoteBreak>
          &ldquo;The best nights aren&rsquo;t planned.
          <br />
          They&rsquo;re felt.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="Game Night"
          title={
            <>
              Elevate
              <br />
              the ordinary.
            </>
          }
          body="House parties, date nights, long weekends away. Bevy turns any gathering into something electric. No awkward silences. No recycled questions. Just the right card at the right moment."
          imageSrc="/images/illustrations/illustration2.png"
          imageAlt="Couples dancing at night"
        />

        <BundlesShowcase />

        <ReviewsSection />

        <QuoteBreak>
          &ldquo;Some truths need telling.
          <br />
          Some dares need taking.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="Powered by AI"
          title={
            <>
              Thoughtfully
              <br />
              intelligent.
            </>
          }
          body="BevyAI learns the room. It adapts to your energy, your comfort level, your dynamic. Every prompt is emotionally considered, socially aware, and designed to land."
          imageSrc="/images/illustrations/illustration8.jpeg"
          imageAlt="A diverse group of friends"
        />

        <FeatureSection
          eyebrow="Safe & Inclusive"
          title={
            <>
              Play without
              <br />
              hesitation.
            </>
          }
          body="Every card is thoughtfully crafted to be inclusive and respectful of all players. No cringe. No discomfort. Just honest, socially intelligent prompts designed for real people in real rooms."
          imageSrc="/images/illustrations/illustration4.png"
          imageAlt="A warm, inclusive gathering"
          reverse
        />

        <QuoteBreak>
          &ldquo;Ask the questions
          <br />
          you&rsquo;ve always wanted to.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="The People You Love"
          title={
            <>
              Made for
              <br />
              the moments
              <br />
              in between.
            </>
          }
          body="Ten bundles. Over a thousand cards. From the first date to the twentieth anniversary. From Friday night with strangers to Sunday morning with your person. Bevy meets you wherever you are."
          imageSrc="/images/illustrations/illustration1.png"
          imageAlt="A sophisticated social gathering"
        />
      </main>

      <Footer />
    </>
  );
}
