"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const features = [
  {
    tab: "The Feeling",
    title: "Go further, feel more.",
    body: "Behind every person you know is a conversation you haven\u2019t had yet. Bevy helps you start it.",
    imageSrc: "/images/illustrations/illustration5.png",
    bg: "rgba(164, 129, 82, 0.08)",
  },
  {
    tab: "The Experience",
    title: "Conversations that stay with you.",
    body: "Every card in Bevy is crafted to go beyond the surface. Questions that make you pause. Dares that make you feel alive. Moments that bond you closer to the people around you.",
    imageSrc: "/images/illustrations/illustration6.png",
    bg: "rgba(180, 120, 100, 0.08)",
  },
  {
    tab: "Game Night",
    title: "Elevate the ordinary.",
    body: "House parties, date nights, long weekends away. Bevy turns any gathering into something electric. No awkward silences. No recycled questions. Just the right card at the right moment.",
    imageSrc: "/images/illustrations/illustration2.png",
    bg: "rgba(140, 80, 80, 0.08)",
  },
  {
    tab: "Powered by AI",
    title: "Thoughtfully intelligent.",
    body: "BevyAI learns the room. It adapts to your energy, your comfort level, your dynamic. Every prompt is emotionally considered, socially aware, and designed to land.",
    imageSrc: "/images/illustrations/illustration8.jpeg",
    bg: "rgba(100, 130, 160, 0.08)",
  },
  {
    tab: "Safe & Inclusive",
    title: "Play without hesitation.",
    body: "Every card is thoughtfully crafted to be inclusive and respectful of all players. No cringe. No discomfort. Just honest, socially intelligent prompts designed for real people in real rooms.",
    imageSrc: "/images/illustrations/illustration4.png",
    bg: "rgba(140, 160, 120, 0.08)",
  },
  {
    tab: "The Social Catalyst",
    title: "Made for the moments in between.",
    body: "Ten bundles. Over a thousand cards. From the first date to the twentieth anniversary. From Friday night with strangers to Sunday morning with your person. Bevy meets you wherever you are.",
    imageSrc: "/images/illustrations/illustration1.png",
    bg: "rgba(160, 140, 100, 0.08)",
  },
];

export default function FeatureDeck() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const manualOverride = useRef(false);

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
    manualOverride.current = true;
    setActive(i);
    setTimeout(() => {
      manualOverride.current = false;
    }, 1500);
  };

  // Progress bar within section
  const progressPct = ((active + 1) / features.length) * 100;

  return (
     <section id="s1" ref={sectionRef} className="feature-deck-section">
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
            <p className="section-body" style={{ maxWidth: 520, marginInline: "auto" }}>
              Six ways Bevy transforms any gathering into something real. From the emotional to the electric, every feature is designed to bring people closer.
            </p>
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
                  className="editorial-img"
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
