"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import DownloadButton from "./DownloadButton";

const frontVideos = [
  "/videos/alias-mode-significant-other.mov",
  "/videos/alias-mode-nsfw.mov",
  "/videos/alias-mode-early-dating.mov",
];

const backVideo = "/videos/hero-screen.mov";
const NEXT_VIDEO_DELAY_MS = 2000;

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFrontAdvancing, setIsFrontAdvancing] = useState(false);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const cycleTimeoutRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);

  const handleFrontVideoEnd = useCallback(() => {
    if (isFrontAdvancing) return;

    setIsFrontAdvancing(true);

    if (cycleTimeoutRef.current !== null) {
      window.clearTimeout(cycleTimeoutRef.current);
    }

    cycleTimeoutRef.current = window.setTimeout(() => {
      setCurrentIndex((prev) => {
        setPrevIndex(prev);
        return (prev + 1) % frontVideos.length;
      });

      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }

      fadeTimeoutRef.current = window.setTimeout(() => {
        setPrevIndex(null);
        fadeTimeoutRef.current = null;
      }, 700);

      setIsFrontAdvancing(false);
      cycleTimeoutRef.current = null;
    }, NEXT_VIDEO_DELAY_MS);
  }, [isFrontAdvancing]);

  useEffect(() => {
    return () => {
      if (cycleTimeoutRef.current !== null) {
        window.clearTimeout(cycleTimeoutRef.current);
      }

      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
      </div>

      <div className="site-shell relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — Hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="hero-proof fade-in">
            <span className="hero-proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="hero-proof-text">4.7 &middot; 25K+ downloads on the App Store</span>
          </div>

          <h1
            style={{ marginTop: 20 }}
            className="font-display text-[clamp(40px,6.5vw,78px)] font-normal leading-[1.05] text-white/92 fade-in fade-in-d1"
          >
            Truth or Dare.
            <br />
            <span className="text-white/50 font-bold italic">Reimagined.</span>
          </h1>

          <p
            style={{ marginTop: 20 }}
            className="max-w-[420px] text-[15px] font-light leading-[1.75] text-white/44 fade-in fade-in-d2"
          >
            The modern, meaningful alternative to traditional truth or dare
            games. 1000+ carefully crafted cards.
          </p>

          <div style={{ marginTop: 24 }} className="fade-in fade-in-d3">
            <DownloadButton width={188} height={63} />
          </div>
        </div>

        {/* Right — Two phone mocks */}
        <div className="hero-mocks fade-in fade-in-d2">
          <div className="hero-mock-front">
            {/* Phone mock with crossfade screens */}
            <div className="phone-mock">
              <div className="phone-mock__screen">
                {prevIndex !== null && (
                  <video
                    src={frontVideos[prevIndex]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-contain hero-video-fade-out"
                  />
                )}
                <video
                  key={frontVideos[currentIndex]}
                  src={frontVideos[currentIndex]}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={handleFrontVideoEnd}
                  className={`absolute inset-0 h-full w-full object-contain ${
                    prevIndex !== null ? "hero-video-fade-in" : ""
                  }`}
                />
              </div>
              <Image
                src="/images/mockups/iphone-17-pro-mockup.png"
                alt=""
                fill
                sizes="380px"
                className="phone-mock__frame"
                priority
              />
            </div>
          </div>
          <div className="hero-mock-back">
            {/* Background gameplay video */}
            <div className="phone-mock">
              <div className="phone-mock__screen">
                <video
                  src={backVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="h-full w-full object-contain"
                />
              </div>
              <Image
                src="/images/mockups/iphone-17-pro-mockup.png"
                alt=""
                fill
                sizes="380px"
                className="phone-mock__frame"
              />
            </div>
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
