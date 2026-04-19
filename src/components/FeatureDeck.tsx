"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const features = [
  {
    tab: "The Feeling",
    title: "Go further, feel more.",
    body: "Every card is emotionally considered, socially aware, and designed to land. Questions that bring out different feelings in you and in each other. Dares that get you moving, laughing, and fully in the moment. Moments that bond you closer to the people around you.",
    imageSrc: "/images/illustrations/illustration1.jpg",
    bg: "#1f1811",
  },
  {
    tab: "The Growth",
    title: "Conversations that stay with you.",
    body: "The more you play, the more connected you become, with each other and with yourself. You notice new parts of who you are, and new sides of the people around you. You learn how to show up with different energies, in ways that feel socially aware and emotionally true. Bevy turns those moments into growth you can feel.",
    imageSrc: "/images/illustrations/illustration2.jpg",
    bg: "#221613",
  },
  {
    tab: "Be Extraordinary",
    title: "Elevate the ordinary.",
    body: "Made for the moments in between. Bevy turns ordinary moments into meaningful ones, then meaningful ones into unforgettable nights. No awkward silences. No recycled small talk. Just the right card at the exact right moment.",
    imageSrc: "/images/illustrations/illustration3.jpg",
    bg: "#1c1313",
  },
  {
    tab: "Powered by AI",
    title: "Thoughtfully intelligent.",
    body: "BevyAI adapts the game to your preferences, energy, and comfort level so every session feels right for your group. And when there is no group, it steps in as your play partner for solo reflection and discovery.",
    imageSrc: "/images/illustrations/illustration4.jpg",
    bg: "#131a21",
  },
  {
    tab: "Safe & Inclusive",
    title: "Play without hesitation.",
    body: "Every card is thoughtfully crafted to be inclusive, respectful, and easy to say yes to. No cringe. No pressure. No moments that leave anyone behind. Just honest, socially intelligent prompts designed for real people in real rooms.",
    imageSrc: "/images/illustrations/illustration5.jpg",
    bg: "#182014",
  },
  {
    tab: "Courage Catalyst",
    title: "Permission to make the first move.",
    body: "Bevy helps the room shift. It gives people permission to ask the deeper question, take the bolder dare, and open up without overthinking it. When a moment feels risky, the app carries the weight, so connection feels easier and more natural.",
    imageSrc: "/images/illustrations/illustration6.jpg",
    bg: "#1f1a12",
  },
];

export default function FeatureDeck() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const manualOverride = useRef(false);

  const ghostOne = features[(active + 1) % features.length];
  const ghostTwo = features[(active + 2) % features.length];

  useEffect(() => {
    const onScroll = () => {
      if (manualOverride.current) return;
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const sectionTop = -rect.top;
      const scrollableHeight = el.offsetHeight - window.innerHeight;

      if (sectionTop < 0 || scrollableHeight <= 0) {
        setActive(0);
        return;
      }

      const progress = Math.max(0, Math.min(1, sectionTop / scrollableHeight));
      const idx = Math.min(
        features.length - 1,
        Math.floor(progress * features.length)
      );
      setActive(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTabClick = (i: number) => {
    const el = sectionRef.current;

    manualOverride.current = true;
    setActive(i);

    if (el) {
      const rect = el.getBoundingClientRect();
      const sectionStartY = window.scrollY + rect.top;
      const scrollableHeight = el.offsetHeight - window.innerHeight;

      if (scrollableHeight > 0) {
        const step = 1 / features.length;
        const targetProgress = Math.min(0.999, i * step + step * 0.5);
        const targetY = sectionStartY + scrollableHeight * targetProgress;

        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }

    setTimeout(() => {
      manualOverride.current = false;
    }, 600);
  };

  // Progress bar within section
  const progressPct = ((active + 1) / features.length) * 100;

  return (
     <section id="s1" ref={sectionRef} className="feature-deck-section relative">
      <span id="s1-anchor" className="section-anchor-mid section-anchor-mid--feature" aria-hidden />
      <div className="fd-sticky-container">
        <div style={{ maxWidth: "var(--shell-max)", width: "100%", marginInline: "auto" }}>
          <article style={{ maxWidth: 680, marginInline: "auto", textAlign: "center", paddingBottom: 32 }}>
            <p className="kicker">The Experience</p>
            <h2 className="section-title">
              The best nights aren&rsquo;t planned.
              <br />
              They&rsquo;re felt.
            </h2>
            <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          </article>

          {/* Tab pills */}
          <div className="fd-tabs">
            {features.map((f, i) => (
              <button
                key={f.tab}
                className={`fd-tab${i === active ? " fd-tab--active" : ""}`}
                onClick={() => handleTabClick(i)}
              >
                {f.tab}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="fd-progress">
            <div
              className="fd-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Card */}
          <div className="fd-stack">
            <div
              aria-hidden="true"
              className="fd-card fd-card--ghost fd-card--ghost-2"
              style={{ background: ghostTwo.bg }}
            />
            <div
              aria-hidden="true"
              className="fd-card fd-card--ghost fd-card--ghost-1"
              style={{ background: ghostOne.bg }}
            />
            <div
              className="fd-card fd-card--base"
              style={{ background: features[active].bg }}
            >
              <div className="fd-card-copy">
                <h2 className="fd-card-title">{features[active].title}</h2>
                <p className="fd-card-body">{features[active].body}</p>
              </div>
              <div className="fd-card-media">
                <Image
                  src={features[active].imageSrc}
                  alt={features[active].tab}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="fd-card-illustration"
                  priority={active === 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
