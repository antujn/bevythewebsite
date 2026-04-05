import Image from "next/image";
import PhoneMock from "./PhoneMock";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">

      <div className="site-shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — Hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="flex items-center gap-3 fade-in">
            <Image
              src="/images/icons/bevy-logo.png"
              alt="Bevy"
              width={48}
              height={48}
              priority
            />
            <span className="text-[13px] font-medium uppercase tracking-[0.25em] text-white/40">
              Bevy
            </span>
          </div>

          <h1
            style={{ marginTop: 28 }}
            className="font-display text-[clamp(40px,6.5vw,78px)] font-normal leading-[1.05] text-white/92 fade-in fade-in-d1"
          >
            Truth or Dare.
            <br />
            <span className="text-white/50">Reimagined.</span>
          </h1>

          <p
            style={{ marginTop: 20 }}
            className="max-w-[420px] text-[15px] font-light leading-[1.75] text-white/44 fade-in fade-in-d2"
          >
            The modern, meaningful alternative to traditional truth or dare
            games. AI&#8209;powered. 1000+ cards.
          </p>

          <a
            href="https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 32 }}
            className="fade-in fade-in-d3"
          >
            <Image
              src="/images/icons/appstore-dark.png"
              alt="Download on the App Store"
              width={188}
              height={63}
            />
          </a>
        </div>

        {/* Right — Two phone mocks */}
        <div className="hero-mocks fade-in fade-in-d2">
          <div className="hero-mock-front">
            <PhoneMock
              screenSrc="/images/screens/hero-screen.png"
              screenAlt="Bevy welcome screen"
              priority
            />
          </div>
          <div className="hero-mock-back">
            <PhoneMock
              screenSrc="/images/screens/splash.png"
              screenAlt="Bevy splash screen"
            />
          </div>
        </div>
      </div>

      <a
        href="#s1"
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/34 transition-colors hover:text-white/62 fade-in fade-in-d3"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase">
          Discover
        </span>
        <svg
          className="bounce h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </a>
    </section>
  );
}
