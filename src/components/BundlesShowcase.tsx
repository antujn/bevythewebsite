"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "motion/react";

type BundleType = "truth" | "dare";

type Bundle = {
  label: string;
  type: BundleType;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
  accentBg: string;
};

const bundles: Bundle[] = [
  // Truth bundles
  {
    label: "Significant Other",
    type: "truth",
    description:
      "Intimate, affectionate and pragmatic questions to ask in a long-term monogamous relationship to bring you closer to your partner.",
    imageSrc: "/images/bundles/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
    accent: "#610000",
    accentBg: "rgba(97, 0, 0, 0.2)",
  },
  {
    label: "Early Dating",
    type: "truth",
    description:
      "Socially and emotionally intelligent questions to help you develop a great connection with your potential significant other.",
    imageSrc: "/images/bundles/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
    accent: "#001f2a",
    accentBg: "rgba(0, 31, 42, 0.2)",
  },
  {
    label: "The Office",
    type: "truth",
    description:
      "Quirky, entertaining and revealing questions to create laughter, camaraderie, and share secrets and hilarious anecdotes among coworkers.",
    imageSrc: "/images/bundles/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
    accent: "#3c3c00",
    accentBg: "rgba(60, 60, 0, 0.2)",
  },
  {
    label: "House Party",
    type: "truth",
    description:
      "Playful, hilarious and stimulating questions to ask your party-mates. Ideal to make new friends and banter with them.",
    imageSrc: "/images/bundles/bundle-house-party.png",
    imageAlt: "House Party bundle screen",
    accent: "#1a1a1a",
    accentBg: "rgba(26, 26, 26, 0.32)",
  },
  {
    label: "No Strings Attached",
    type: "truth",
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
    type: "dare",
    description:
      "Elevate your dates with these novel date ideas. Avoid those conversational clich\u00E9s that leave you yawning into your pasta at a local date spot.",
    imageSrc: "/images/bundles/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
    accent: "#00424d",
    accentBg: "rgba(0, 66, 77, 0.2)",
  },
  {
    label: "Not Safe For Work",
    type: "dare",
    description:
      "This bundle is a riot. If you\u2019ve got a lively group of enthusiastic, exciting individuals craving an unforgettable after-party, this bundle is for you!",
    imageSrc: "/images/bundles/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
    accent: "#1a1a1a",
    accentBg: "rgba(26, 26, 26, 0.32)",
  },
  {
    label: "Safe For Work",
    type: "dare",
    description:
      "Hilarious and harmless dares for your next game-night with co-workers or family. No unhygienic or pointless tasks, just pure enjoyment.",
    imageSrc: "/images/bundles/bundle-safe-for-work.png",
    imageAlt: "Safe For Work bundle screen",
    accent: "#1a2530",
    accentBg: "rgba(26, 37, 48, 0.2)",
  },
  {
    label: "Baby Making",
    type: "dare",
    description:
      "Bored with your usual bedroom routine? Pair with a fellow baby maker and test your trust, coordination and add variety to your love making.",
    imageSrc: "/images/bundles/bundle-baby-making.png",
    imageAlt: "Baby Making bundle screen",
    accent: "#00002a",
    accentBg: "rgba(0, 0, 42, 0.22)",
  },
  {
    label: "Point Break",
    type: "dare",
    description:
      "Not for the weak! Made for total daredevils to take on extreme sports challenges across the globe and push their limits to new heights.",
    imageSrc: "/images/bundles/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
    accent: "#002b00",
    accentBg: "rgba(0, 43, 0, 0.22)",
  },
];

const AUTO_ROTATE_MS = 5000;
const RESUME_AFTER_INTERACTION_MS = 10000;

// Dial geometry — tuned for a 3D "round" dial effect. Items at the
// center sit flat facing the viewer; adjacent items translate sideways,
// recede in depth, and rotate around the dial's axis like a coverflow.
const MOCK_SLOT_SPACING = 170; // horizontal distance between mock slots (px)
const MOCK_ROTATE_PER_STEP = 30; // degrees rotateY per step away from center
const MOCK_Z_PER_STEP = 120; // px translateZ (away from viewer) per step
const TEXT_SLOT_SPACING = 110; // vertical distance between text slots (px)
const TEXT_ROTATE_PER_STEP = 16; // degrees rotateX per step
const TEXT_Z_PER_STEP = 80; // px translateZ per step for text dial
const VISIBLE_DIAL_WINDOW = 2; // how many items on each side stay faintly visible
const DRAG_THRESHOLD = 70; // px needed for a drag to trigger next/prev

const SPRING = {
  type: "spring" as const,
  stiffness: 220,
  damping: 30,
  mass: 0.8,
};

export default function BundlesShowcase() {
  const [active, setActive] = useState(0);
  const rotateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRotate = () => {
    if (rotateTimerRef.current) {
      clearInterval(rotateTimerRef.current);
      rotateTimerRef.current = null;
    }
  };

  const startRotate = useCallback(() => {
    clearRotate();
    rotateTimerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % bundles.length);
    }, AUTO_ROTATE_MS);
  }, []);

  // Pause auto-rotate on interaction, then resume after a quiet period so
  // the user can read without the selection changing under them.
  const handleInteraction = useCallback(() => {
    clearRotate();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      startRotate();
    }, RESUME_AFTER_INTERACTION_MS);
  }, [startRotate]);

  useEffect(() => {
    startRotate();
    return () => {
      clearRotate();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [startRotate]);

  const selectBundle = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(bundles.length - 1, i));
      setActive(clamped);
      handleInteraction();
    },
    [handleInteraction],
  );

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % bundles.length);
    handleInteraction();
  }, [handleInteraction]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + bundles.length) % bundles.length);
    handleInteraction();
  }, [handleInteraction]);

  // Keyboard nav when any part of the section has focus.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next();
    }
  };

  const activeBundle = bundles[active];

  return (
    <section
      id="bundles"
      className="section-space relative overflow-hidden"
      style={{ paddingBottom: 40 }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <span id="bundles-anchor" className="section-anchor-mid" aria-hidden />
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
      </div>

      <div className="site-shell relative z-10">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
            paddingBottom: 40,
          }}
        >
          <p className="kicker">The Collection</p>
          <h2 id="bundles-heading" className="section-title section-anchor-title">
            A different energy for every night.
          </h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          <p className="section-body" style={{ maxWidth: 560, marginInline: "auto" }}>
            From soft truths to bold dares, each Bevy bundle sets its own tone
            so the game fits your people, your mood, and your moment.
          </p>
        </article>

        {/* 2-column dial layout */}
        <div className="dial-layout">
          <MockDial
            bundles={bundles}
            active={active}
            onSelect={selectBundle}
            onNext={next}
            onPrev={prev}
          />
          <TextDial
            bundles={bundles}
            active={active}
            onSelect={selectBundle}
            onNext={next}
            onPrev={prev}
          />
        </div>

        {/* Live region announcing the active bundle for screen readers */}
        <div className="sr-only" aria-live="polite">
          {activeBundle.type === "truth" ? "Question Bundle" : "Challenge Bundle"}
          {": "}
          {activeBundle.label}
        </div>
      </div>
    </section>
  );
}

/* ─── Horizontal phone-mock dial ────────────────────────────────────── */

function MockDial({
  bundles,
  active,
  onSelect,
  onNext,
  onPrev,
}: {
  bundles: Bundle[];
  active: number;
  onSelect: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  // Interpret a horizontal drag as a swipe: drag past DRAG_THRESHOLD → step
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) onNext();
    else if (info.offset.x > DRAG_THRESHOLD) onPrev();
  };

  return (
    <div className="dial dial--mock">
      <motion.div
        className="dial-track"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {bundles.map((bundle, i) => {
          const d = i - active;
          const ad = Math.abs(d);
          const visible = ad <= VISIBLE_DIAL_WINDOW;
          // Scale: active is full size, near items are shrunk
          const scale = ad === 0 ? 1 : ad === 1 ? 0.82 : 0.66;
          // Opacity falls off with distance
          const opacity = ad > VISIBLE_DIAL_WINDOW ? 0 : 1 - ad * 0.35;
          // Coverflow: items to the right rotate LEFT (show their left edge),
          // items to the left rotate RIGHT (show their right edge). Sign of
          // rotateY = negative sign of distance.
          const rotateY = -d * MOCK_ROTATE_PER_STEP;
          // Recede in depth with distance (negative z = away from camera)
          const z = -ad * MOCK_Z_PER_STEP;

          return (
            <motion.div
              key={bundle.label}
              className="dial-item dial-item--mock"
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={`Select ${bundle.label}`}
              aria-pressed={ad === 0}
              // onTap distinguishes a real tap from a drag — it only fires
              // when the pointer was released without triggering the parent
              // track's pan. onClick would fire in both cases on desktop.
              onTap={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
              initial={false}
              animate={{
                // calc keeps the -50% centering while applying the px offset
                // for this item's distance from active.
                x: `calc(-50% + ${d * MOCK_SLOT_SPACING}px)`,
                y: "-50%",
                scale,
                opacity,
                rotateY,
                z,
              }}
              transition={SPRING}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: 10 - ad,
                pointerEvents: visible ? "auto" : "none",
                cursor: "grab",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="phone-mock phone-mock--compact">
                <div className="phone-mock__screen">
                  <Image
                    src={bundle.imageSrc}
                    alt={bundle.imageAlt}
                    fill
                    sizes="300px"
                    className="object-contain"
                    priority={i === 0}
                    draggable={false}
                  />
                </div>
                <Image
                  src="/images/mockups/iphone-17-pro-mockup.png"
                  alt=""
                  fill
                  sizes="300px"
                  className="phone-mock__frame"
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dot indicators */}
      <div className="dial-dots">
        {bundles.map((b, i) => (
          <button
            key={b.label}
            className={`dial-dot${i === active ? " dial-dot--active" : ""}`}
            style={i === active ? { background: b.accent } : undefined}
            onClick={() => onSelect(i)}
            aria-label={`Go to ${b.label}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Vertical text dial ────────────────────────────────────────────── */

function TextDial({
  bundles,
  active,
  onSelect,
  onNext,
  onPrev,
}: {
  bundles: Bundle[];
  active: number;
  onSelect: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y < -DRAG_THRESHOLD) onNext();
    else if (info.offset.y > DRAG_THRESHOLD) onPrev();
  };

  return (
    <div className="dial">
      <motion.div
        className="dial-track"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        {bundles.map((bundle, i) => {
          const d = i - active;
          const ad = Math.abs(d);
          const visible = ad <= VISIBLE_DIAL_WINDOW;
          const scale = ad === 0 ? 1 : ad === 1 ? 0.84 : 0.72;
          const opacity = ad > VISIBLE_DIAL_WINDOW ? 0 : 1 - ad * 0.45;
          // Items above curve back (top going away); below curve forward.
          // Positive rotateX tilts top away from viewer; so above items
          // get positive rotateX, below items get negative. Sign matches
          // sign of distance (d<0 above → rotateX>0).
          const rotateX = -d * TEXT_ROTATE_PER_STEP;
          const z = -ad * TEXT_Z_PER_STEP;
          const isActive = ad === 0;

          return (
            <motion.div
              key={bundle.label}
              className={`dial-item dial-item--text${isActive ? " dial-item--text-active" : ""}`}
              role="button"
              tabIndex={visible ? 0 : -1}
              aria-label={`Select ${bundle.label}`}
              aria-pressed={isActive}
              onTap={() => onSelect(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
              initial={false}
              animate={{
                x: "-50%",
                y: `calc(-50% + ${d * TEXT_SLOT_SPACING}px)`,
                scale,
                opacity,
                rotateX,
                z,
              }}
              transition={SPRING}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                zIndex: 10 - ad,
                pointerEvents: visible ? "auto" : "none",
                cursor: "grab",
                transformStyle: "preserve-3d",
                // Card background in the bundle's accent color with a
                // subtle top-left sheen for depth. Border uses the accent
                // slightly brighter so the card edge reads clearly.
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 55%), ${bundle.accent}`,
                borderColor: `${bundle.accent}`,
              }}
            >
              <span
                className="dial-type"
                style={{
                  color:
                    bundle.type === "truth"
                      ? "var(--gold-soft)"
                      : "rgba(219, 146, 125, 0.95)",
                }}
              >
                {bundle.type === "truth" ? "Question Bundle" : "Challenge Bundle"}
              </span>
              <h3 className="dial-title">{bundle.label}</h3>
              {/* Description only shown for the active item — side items
                  carry just type + title so the dial stays legible. */}
              <p className="dial-desc" aria-hidden={!isActive}>
                {bundle.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
