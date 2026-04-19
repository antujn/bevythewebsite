"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

const gameplaySlides = [
  {
    label: "Finger Game",
    title: "Fast turn picking for real groups.",
    body: "Place fingers on screen and let Bevy select who goes next. Perfect for lively rooms where you want momentum, suspense, and zero setup friction.",
    points: ["Quick start flow", "Supports team energy", "Designed for in-person play"],
    frontVideo: "/videos/finger-mode-early-dating.mov",
  },
  {
    label: "Alias Game",
    title: "Play in character with score tracking.",
    body: "Give everyone a fun alias, rotate turns through cards, and let the built-in scoreboard carry the game night arc from warm-up to final winner.",
    points: ["Alias identity setup", "Built-in scoreboard", "Great for parties and dates"],
    frontVideo: "/videos/alias-mode-significant-other.mov",
  },
  {
    label: "BevyAI Play",
    title: "A play partner when no group is around.",
    body: "BevyAI adapts to your preferences and comfort level, then serves meaningful prompts for solo sessions, reflection, or low-pressure practice.",
    points: ["Adaptive prompt flow", "Comfort-aware pacing", "Great for solo introspection"],
    frontVideo: "/videos/ai-chat-early-dating.mov",
  },
  {
    label: "Achievements",
    title: "Progress that keeps the game alive.",
    body: "Unlock milestones across bundles and game styles. Achievements reward consistency, creativity, and bold gameplay, giving players reasons to return.",
    points: ["Milestone unlocks", "Bundle progression", "Long-term replay loop"],
    frontVideo: "/videos/settings-achievements.mov",
  },
];

const gameModeScreen = "/videos/game-mode-screen.mov";

export default function GameplaySection() {
  const [active, setActive] = useState(0);

  const handleFrontVideoEnd = useCallback(() => {
    setActive((prev) => (prev + 1) % gameplaySlides.length);
  }, []);

  return (
    <section id="gameplay" className="section-space relative overflow-hidden">
      <span id="gameplay-anchor" className="section-anchor-mid" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/65 to-black/78" />

      <div className="site-shell">
        <article style={{ maxWidth: 720, marginInline: "auto", textAlign: "center" }}>
          <p className="kicker">The Gameplay</p>
          <h2 id="gameplay-heading" className="section-title section-anchor-title">An interface designed to feel intuitive and effortless.</h2>
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
                  <video
                    key={gameplaySlides[active].frontVideo}
                    src={gameplaySlides[active].frontVideo}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleFrontVideoEnd}
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

            <div className="gameplay-mock-back">
              <div className="phone-mock">
                <div className="phone-mock__screen">
                  <video
                    src={gameModeScreen}
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
      </div>
    </section>
  );
}
