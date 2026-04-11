"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const gameplaySlides = [
  {
    label: "Finger Game",
    title: "Fast turn picking for real groups.",
    body: "Place fingers on screen and let Bevy select who goes next. Perfect for lively rooms where you want momentum, suspense, and zero setup friction.",
    points: ["Quick start flow", "Supports team energy", "Designed for in-person play"],
    frontSrc: "/images/screens/play-screen.png",
  },
  {
    label: "Alias Game",
    title: "Play in character with score tracking.",
    body: "Give everyone a fun alias, rotate turns through cards, and let the built-in scoreboard carry the game night arc from warm-up to final winner.",
    points: ["Alias identity setup", "Built-in scoreboard", "Great for parties and dates"],
    frontSrc: "/images/screens/play-screen.png",
  },
  {
    label: "BevyAI Play",
    title: "A play partner when no group is around.",
    body: "BevyAI adapts to your preferences and comfort level, then serves meaningful prompts for solo sessions, reflection, or low-pressure practice.",
    points: ["Adaptive prompt flow", "Comfort-aware pacing", "Great for solo introspection"],
    frontSrc: "/images/screens/play-screen.png",
  },
  {
    label: "Achievements",
    title: "Progress that keeps the game alive.",
    body: "Unlock milestones across bundles and game styles. Achievements reward consistency, creativity, and bold gameplay, giving players reasons to return.",
    points: ["Milestone unlocks", "Bundle progression", "Long-term replay loop"],
    frontSrc: "/images/screens/play-screen.png",
  },
];

const gameModeScreen = "/images/screens/play-screen.png";

export default function GameplaySection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % gameplaySlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-space relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/background/illustration8.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/52 to-black/70" />
      </div>

      <div className="site-shell">
        <article style={{ maxWidth: 720, marginInline: "auto", textAlign: "center" }}>
          <p className="kicker">The Play</p>
          <h2 className="section-title">An interface designed to feel intuitive and effortless.</h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
        </article>

        <div className="gameplay-layout">
          <div className="gameplay-copy">
            <div className="gameplay-tabs">
              {gameplaySlides.map((slide, i) => (
                <button
                  key={slide.label}
                  className={`gameplay-tab${i === active ? " gameplay-tab--active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  {slide.label}
                </button>
              ))}
            </div>

            <h3 className="gameplay-title">{gameplaySlides[active].title}</h3>
            <p className="gameplay-body">{gameplaySlides[active].body}</p>

            <div className="gameplay-points">
              {gameplaySlides[active].points.map((point) => (
                <span key={point} className="gameplay-point">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="gameplay-mocks">
            <div className="gameplay-mock-front">
              <div className="phone-mock">
                <div className="phone-mock__screen">
                  {gameplaySlides.map((slide, i) => (
                    <Image
                      key={`front-${slide.label}`}
                      src={slide.frontSrc}
                      alt={`${slide.label} gameplay`}
                      fill
                      sizes="380px"
                      className={`object-contain transition-opacity duration-900 ease-in-out ${
                        i === active ? "opacity-100" : "opacity-0"
                      }`}
                      priority={i === 0}
                    />
                  ))}
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

            <div className="gameplay-mock-back">
              <div className="phone-mock">
                <div className="phone-mock__screen">
                  <Image
                    src={gameModeScreen}
                    alt="Game mode selection screen"
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
      </div>
    </section>
  );
}
