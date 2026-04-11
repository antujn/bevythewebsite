"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import DownloadButton from "./DownloadButton";

// All images in hero_mock folder
const heroImages = [
  "/images/screens/hero_mock/hero-screen.png",
  "/images/screens/hero_mock/bundle-early-dating-1.png",
  "/images/screens/hero_mock/bundle-early-dating-2.png",
  "/images/screens/hero_mock/bundle-early-dating-3.png",
  "/images/screens/hero_mock/bundle-house-party-1.png",
  "/images/screens/hero_mock/bundle-house-party-2.png",
  "/images/screens/hero_mock/bundle-house-party-3.png",
  "/images/screens/hero_mock/bundle-nsfw-1.png",
  "/images/screens/hero_mock/bundle-nsfw-2.png",
  "/images/screens/hero_mock/bundle-nsfw-3.png",
  "/images/screens/hero_mock/bundle-significant-other-1.png",
  "/images/screens/hero_mock/bundle-significant-other-2.png",
  "/images/screens/hero_mock/bundle-significant-other-3.png",
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const promises = heroImages.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });
      await Promise.all(promises);
      setIsLoaded(true);
    };
    preloadImages();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, [isLoaded, nextImage]);

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/background/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-26"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/48 via-black/58 to-black/74" />
      </div>

      <div className="site-shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left — Hero text */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="hero-proof fade-in">
            <span className="hero-proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="hero-proof-text">4.7 &middot; 26 ratings on the App Store</span>
          </div>

          <h1
            style={{ marginTop: 20 }}
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
                {heroImages.map((src, index) => (
                  <Image
                    key={src}
                    src={src}
                    alt="Bevy app screen"
                    fill
                    sizes="380px"
                    className={`object-contain transition-opacity duration-500 ease-in-out ${
                      index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                    priority={index === 0}
                  />
                ))}
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
            {/* Static splash screen */}
            <div className="phone-mock">
              <div className="phone-mock__screen">
                <Image
                  src="/images/screens/hero_mock/splash.png"
                  alt="Bevy splash screen"
                  fill
                  sizes="380px"
                  className="object-contain"
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
