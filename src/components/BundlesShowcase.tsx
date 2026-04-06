"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import PhoneMock from "./PhoneMock";

const bundles = [
  // Truth bundles
  {
    label: "Significant Other",
    type: "truth" as const,
    description:
      "Intimate, affectionate and pragmatic questions to ask in a long-term monogamous relationship to bring you closer to your partner.",
    imageSrc: "/images/screens/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
  },
  {
    label: "Early Dating",
    type: "truth" as const,
    description:
      "Socially and emotionally intelligent questions to help you develop a great connection with your potential significant other.",
    imageSrc: "/images/screens/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
  },
  {
    label: "The Office",
    type: "truth" as const,
    description:
      "Quirky, entertaining and revealing questions to create laughter, camaraderie, and share secrets and hilarious anecdotes among coworkers.",
    imageSrc: "/images/screens/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
  },
  {
    label: "House Party",
    type: "truth" as const,
    description:
      "Playful, hilarious and stimulating questions to ask your party-mates. Ideal to make new friends and banter with them.",
    imageSrc: "/images/screens/bundle-house-party.png",
    imageAlt: "House Party bundle screen",
  },
  {
    label: "No Strings Attached",
    type: "truth" as const,
    description:
      "Bold questions for casual relationships. Great for sexual partners wanting to share experiences and communicate desires.",
    imageSrc: "/images/screens/bundle-no-strings.png",
    imageAlt: "No Strings Attached bundle screen",
  },
  // Dare bundles
  {
    label: "Date Night",
    type: "dare" as const,
    description:
      "Elevate your dates with these novel date ideas. Avoid those conversational clich\u00E9s that leave you yawning into your pasta at a local date spot.",
    imageSrc: "/images/screens/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
  },
  {
    label: "Not Safe For Work",
    type: "dare" as const,
    description:
      "This bundle is a riot. If you\u2019ve got a lively group of enthusiastic, exciting individuals craving an unforgettable after-party, this bundle is for you!",
    imageSrc: "/images/screens/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
  },
  {
    label: "Safe For Work",
    type: "dare" as const,
    description:
      "Hilarious and harmless dares for your next game-night with co-workers or family. No unhygienic or pointless tasks, just pure enjoyment.",
    imageSrc: "/images/screens/bundle-safe-for-work.png",
    imageAlt: "Safe For Work bundle screen",
  },
  {
    label: "Baby Making",
    type: "dare" as const,
    description:
      "Bored with your usual bedroom routine? Pair with a fellow baby maker and test your trust, coordination and add variety to your love making.",
    imageSrc: "/images/screens/bundle-baby-making.png",
    imageAlt: "Baby Making bundle screen",
  },
  {
    label: "Point Break",
    type: "dare" as const,
    description:
      "Not for the weak! Made for total daredevils to take on extreme sports challenges across the globe and push their limits to new heights.",
    imageSrc: "/images/screens/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
  },
];

const AUTO_ROTATE_MS = 5000;

export default function BundlesShowcase() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoRotate = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % bundles.length);
    }, AUTO_ROTATE_MS);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoRotate]);

  const handleClick = (i: number) => {
    setActive(i);
    startAutoRotate(); // Reset timer on manual click
  };

  const current = bundles[active];

  return (
    <section className="section-space" style={{ paddingBottom: 40 }}>
      <div className="site-shell">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
            paddingBottom: 48,
          }}
        >
          <p className="kicker">The Collection</p>
          <h2 className="section-title">
            A different energy for every night.
          </h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          <p
            className="section-body"
            style={{ maxWidth: 560, marginInline: "auto" }}
          >
            From soft truths to bold dares, each Bevy bundle sets its own tone
            so the game fits your people, your mood, and your moment.
          </p>
        </article>

        {/* Phone mock center, two columns flanking */}
        <div className="bt-layout">
          {/* Left column: Truths */}
          <div className="bt-col">
            <span className="bt-col-heading">Truths</span>
            {bundles.filter(b => b.type === "truth").map((b) => {
              const i = bundles.indexOf(b);
              return (
                <button
                  key={b.label}
                  className={`bt-tab${i === active ? " bt-tab--active" : ""}`}
                  onClick={() => handleClick(i)}
                >
                  <span className="bt-tab-label">{b.label}</span>
                  <p className="bt-tab-desc">{b.description}</p>
                </button>
              );
            })}
          </div>

          {/* Center: Phone mock */}
          <div className="bt-phone">
            <PhoneMock
              compact
              screenSrc={current.imageSrc}
              screenAlt={current.imageAlt}
            />
            <div className="bt-dots">
              {bundles.map((_, i) => (
                <button
                  key={i}
                  className={`bt-dot${i === active ? " bt-dot--active" : ""}`}
                  onClick={() => handleClick(i)}
                  aria-label={`Go to bundle ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right column: Dares */}
          <div className="bt-col">
            <span className="bt-col-heading">Dares</span>
            {bundles.filter(b => b.type === "dare").map((b) => {
              const i = bundles.indexOf(b);
              return (
                <button
                  key={b.label}
                  className={`bt-tab${i === active ? " bt-tab--active" : ""}`}
                  onClick={() => handleClick(i)}
                >
                  <span className="bt-tab-label">{b.label}</span>
                  <p className="bt-tab-desc">{b.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
