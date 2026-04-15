"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const bundles = [
  // Truth bundles
  {
    label: "Significant Other",
    type: "truth" as const,
    description:
      "Intimate, affectionate and pragmatic questions to ask in a long-term monogamous relationship to bring you closer to your partner.",
    imageSrc: "/images/bundles/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
    accent: "#610000",
    accentBg: "rgba(97, 0, 0, 0.2)",
  },
  {
    label: "Early Dating",
    type: "truth" as const,
    description:
      "Socially and emotionally intelligent questions to help you develop a great connection with your potential significant other.",
    imageSrc: "/images/bundles/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
    accent: "#001f2a",
    accentBg: "rgba(0, 31, 42, 0.2)",
  },
  {
    label: "The Office",
    type: "truth" as const,
    description:
      "Quirky, entertaining and revealing questions to create laughter, camaraderie, and share secrets and hilarious anecdotes among coworkers.",
    imageSrc: "/images/bundles/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
    accent: "#3c3c00",
    accentBg: "rgba(60, 60, 0, 0.2)",
  },
  {
    label: "House Party",
    type: "truth" as const,
    description:
      "Playful, hilarious and stimulating questions to ask your party-mates. Ideal to make new friends and banter with them.",
    imageSrc: "/images/bundles/bundle-house-party.png",
    imageAlt: "House Party bundle screen",
    accent: "#1a1a1a",
    accentBg: "rgba(26, 26, 26, 0.32)",
  },
  {
    label: "No Strings Attached",
    type: "truth" as const,
    description:
      "Bold questions for casual relationships. Great for sexual partners wanting to share experiences and communicate desires.",
    imageSrc: "/images/bundles/bundle-no-strings.png",
    imageAlt: "No Strings Attached bundle screen",
    accent: "#613500",
    accentBg: "rgba(97, 53, 0, 0.2)",
  },
  // Dare bundles
  {
    label: "Date Night",
    type: "dare" as const,
    description:
      "Elevate your dates with these novel date ideas. Avoid those conversational clich\u00E9s that leave you yawning into your pasta at a local date spot.",
    imageSrc: "/images/bundles/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
    accent: "#00424d",
    accentBg: "rgba(0, 66, 77, 0.2)",
  },
  {
    label: "Not Safe For Work",
    type: "dare" as const,
    description:
      "This bundle is a riot. If you\u2019ve got a lively group of enthusiastic, exciting individuals craving an unforgettable after-party, this bundle is for you!",
    imageSrc: "/images/bundles/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
    accent: "#1a1a1a",
    accentBg: "rgba(26, 26, 26, 0.32)",
  },
  {
    label: "Safe For Work",
    type: "dare" as const,
    description:
      "Hilarious and harmless dares for your next game-night with co-workers or family. No unhygienic or pointless tasks, just pure enjoyment.",
    imageSrc: "/images/bundles/bundle-safe-for-work.png",
    imageAlt: "Safe For Work bundle screen",
    accent: "#1a2530",
    accentBg: "rgba(26, 37, 48, 0.2)",
  },
  {
    label: "Baby Making",
    type: "dare" as const,
    description:
      "Bored with your usual bedroom routine? Pair with a fellow baby maker and test your trust, coordination and add variety to your love making.",
    imageSrc: "/images/bundles/bundle-baby-making.png",
    imageAlt: "Baby Making bundle screen",
    accent: "#00002a",
    accentBg: "rgba(0, 0, 42, 0.22)",
  },
  {
    label: "Point Break",
    type: "dare" as const,
    description:
      "Not for the weak! Made for total daredevils to take on extreme sports challenges across the globe and push their limits to new heights.",
    imageSrc: "/images/bundles/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
    accent: "#002b00",
    accentBg: "rgba(0, 43, 0, 0.22)",
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

  return (
    <section className="section-space relative overflow-hidden" style={{ paddingBottom: 40 }}>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/backgrounds/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/62 via-black/52 to-black/70" />
      </div>
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
            <span className="bt-col-heading bt-col-heading--truth">Question Bundles</span>
            {bundles.filter(b => b.type === "truth").map((b) => {
              const i = bundles.indexOf(b);
              return (
                <button
                  key={b.label}
                  className={`bt-tab${i === active ? " bt-tab--active" : ""}`}
                  style={{
                    borderLeftColor: b.accent,
                    background: i === active ? b.accent : b.accentBg,
                  }}
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
            <div className="bt-phone-sticky">
              <div className="phone-mock phone-mock--compact">
                <div className="phone-mock__screen">
                  {bundles.map((bundle, i) => (
                    <Image
                      key={bundle.imageSrc}
                      src={bundle.imageSrc}
                      alt={bundle.imageAlt}
                      fill
                      sizes="300px"
                      className={`object-contain transition-opacity duration-500 ease-in-out ${
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
                  sizes="300px"
                  className="phone-mock__frame"
                />
              </div>
              <div className="bt-dots">
                {bundles.map((bundle, i) => (
                  <button
                    key={i}
                    className={`bt-dot${i === active ? " bt-dot--active" : ""}`}
                    style={i === active ? { background: bundle.accent } : undefined}
                    onClick={() => handleClick(i)}
                    aria-label={`Go to bundle ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Dares */}
          <div className="bt-col">
            <span className="bt-col-heading bt-col-heading--dare">Challenge Bundles</span>
            {bundles.filter(b => b.type === "dare").map((b) => {
              const i = bundles.indexOf(b);
              return (
                <button
                  key={b.label}
                  className={`bt-tab${i === active ? " bt-tab--active" : ""}`}
                  style={{
                    borderLeftColor: b.accent,
                    background: i === active ? b.accent : b.accentBg,
                  }}
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
