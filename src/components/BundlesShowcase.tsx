"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "motion/react";

// Mirrors the `BundleType` enum in bevytheapp's CardBundle model:
//   .truth  → stock question deck  (ember-accented pill label)
//   .dare   → stock challenge deck (rose-accented pill label)
//   .both   → user-authored deck   (neutral cream pill label)
type BundleType = "truth" | "dare" | "both";

type Bundle = {
  label: string;
  type: BundleType;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accent: string;
};

/**
 * Bundle palette — synced 1:1 with the in-app color catalog in
 * `bevytheapp/Shared/Assets.xcassets/bundleColors/`. Each accent below
 * mirrors the `theme` assigned to that bundle in `BundleViewModel.swift`
 * (see `darkred.colorset`, `darkteal.colorset`, etc.) so the marketing
 * landing page and the in-app bundle chrome read as the same product.
 *
 * The previous website-side theory (strict truth=warm / dare=cool split)
 * has been relaxed to match the app: each bundle now owns whichever dark
 * cinematic color best expresses its mood, regardless of category. Warm
 * reds still dominate the "intimate / fiery" bundles; cool tones still
 * dominate the "private / after-dark" bundles; but truth and dare can
 * now share hues where the story calls for it.
 *
 * Every accent still reads as cinematic-dark (low lightness, saturated)
 * so the whole dial stays inside the Devil-Wears-Prada / "Best Nights"
 * wine-black atmosphere — no pastel or neutral-grey interlopers.
 *
 * When you change a color here, also update:
 *   1. `bevytheapp/Shared/Assets.xcassets/bundleColors/<theme>.colorset`
 *   2. `bevytheapp/Shared/Widget/Assets.xcassets/bundleColors/<theme>.colorset`
 *   3. The `theme:` line in `bevytheapp/Shared/Core/ViewModels/BundleViewModel.swift`
 * …so the site and the app stay in lock-step.
 */
const bundles: Bundle[] = [
  // ── TRUTH bundles ───────────────────────────────────────────
  {
    label: "Significant Other",
    type: "truth",
    description:
      "Intimate, affectionate and pragmatic questions to ask in a long-term monogamous relationship to bring you closer to your partner.",
    imageSrc: "/images/bundles/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
    // darkred — deep classic crimson, the brand anchor red for
    // "canonical long-term love."  (prev diversified pass: #6B0F10)
    accent: "#610000",
  },
  {
    label: "Early Dating",
    type: "truth",
    description:
      "Socially and emotionally intelligent questions to help you develop a great connection with your potential significant other.",
    imageSrc: "/images/bundles/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
    // darkteal — deep teal-steel, "cool first-date nerves / the
    // quiet suspense before a spark." The app shifted this from a
    // warm berry to a cooler teal so it reads calmer than the more
    // established relationships.  (prev diversified pass: #8C1F43)
    accent: "#1A3A3D",
  },
  {
    label: "The Office",
    type: "truth",
    description:
      "Quirky, entertaining and revealing questions to create laughter, camaraderie, and share secrets and hilarious anecdotes among coworkers.",
    imageSrc: "/images/bundles/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
    // darkroyal — deep navy blue, "boardroom-suit, printer-ink,
    // after-hours coworker energy." Cool and composed.
    // (prev diversified pass: #8D3E1C)
    accent: "#001F2A",
  },
  {
    label: "House Party",
    type: "truth",
    description:
      "Playful, hilarious and stimulating questions to ask your party-mates. Ideal to make new friends and banter with them.",
    imageSrc: "/images/bundles/bundle-house-party.png",
    imageAlt: "House Party bundle screen",
    // darkblack — pure black, "lights-off, speaker-stack, red-cup
    // silhouettes." The most neutral-dark slot in the dial.
    // (prev diversified pass: #3A0D1C)
    accent: "#000000",
  },
  {
    label: "No Strings Attached",
    type: "truth",
    description:
      "Bold questions for casual relationships. Great for sexual partners wanting to share experiences and communicate desires.",
    imageSrc: "/images/bundles/bundle-no-strings.png",
    imageAlt: "No Strings Attached bundle screen",
    // darkorange — bright ember/rust, "passionate heat, flame,
    // bold confidence." The brightest warm card in the dial.
    // (matches diversified pass: #B3371C — unchanged)
    accent: "#B3371C",
  },

  // ── DARE bundles ────────────────────────────────────────────
  {
    label: "Date Night",
    type: "dare",
    description:
      "Elevate your dates with these novel date ideas. Avoid those conversational clich\u00E9s that leave you yawning into your pasta at a local date spot.",
    imageSrc: "/images/bundles/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
    // darkplum — deep plum-wine, "candlelight, dessert-wine,
    // late-dinner intimacy." Warmest dare in the set.
    // (prev diversified pass: #260C30)
    accent: "#3A0D1C",
  },
  {
    label: "Not Safe For Work",
    type: "dare",
    description:
      "This bundle is a riot. If you\u2019ve got a lively group of enthusiastic, exciting individuals craving an unforgettable after-party, this bundle is for you!",
    imageSrc: "/images/bundles/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
    // darknight — cool charcoal-black, "midnight mystery, the light
    // off, secret." Darkest cool in the set.
    // (matches diversified pass: #0D0D18 — unchanged)
    accent: "#0D0D18",
  },
  {
    label: "Safe For Work",
    type: "dare",
    description:
      "Hilarious and harmless dares for your next game-night with co-workers or family. No unhygienic or pointless tasks, just pure enjoyment.",
    imageSrc: "/images/bundles/bundle-safe-for-work.png",
    imageAlt: "Safe For Work bundle screen",
    // darkpink — magenta-berry wine, "playful flirt, game-night
    // blush." Pink-leaning warm pulled into the dare side to offset
    // the otherwise all-cool challenge family.
    // (prev diversified pass: #0B1E33)
    accent: "#8C1F43",
  },
  {
    label: "Baby Making",
    type: "dare",
    description:
      "Bored with your usual bedroom routine? Pair with a fellow baby maker and test your trust, coordination and add variety to your love making.",
    imageSrc: "/images/bundles/bundle-baby-making.png",
    imageAlt: "Baby Making bundle screen",
    // darknavy — deepest midnight navy, "silk-sheets, private-
    // bedroom, boudoir." Near-black with just enough blue to read
    // cool.  (prev diversified pass: #1A1B55)
    accent: "#00002A",
  },
  {
    label: "Point Break",
    type: "dare",
    description:
      "Not for the weak! Made for total daredevils to take on extreme sports challenges across the globe and push their limits to new heights.",
    imageSrc: "/images/bundles/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
    // darkgreen — deep forest green, "cliff-ledge, wet-kelp,
    // adrenaline-surge on the coast." The one true green in the
    // palette, reserved for the extreme-sports bundle.
    // (prev diversified pass: #1A3A3D)
    accent: "#002B00",
  },

  // ── CUSTOM / USER-AUTHORED bundle ───────────────────────────
  {
    label: "Write Your Own",
    type: "both",
    description:
      "Leverage the intuitive and versatile interface provided by Bevy to write and play your own questions and challenges.",
    imageSrc: "/images/bundles/bevy-write-your-own.png",
    imageAlt: "Write Your Own bundle screen",
    // darksilver — neutral mid-grey, intentionally sitting outside the
    // warm/cool split so user-authored content reads as "yours, not
    // ours." Matches BevyWriteYourOwn.theme in the app.
    accent: "#444444",
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
        <div className="section-overlay absolute inset-0" />
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
          {/* Couplet headline — see .title-accent in globals.css. */}
          <h2 id="bundles-heading" className="section-title section-anchor-title">
            A different energy
            <br />
            <span className="title-accent">for every night.</span>
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
    <div className="dial dial--text">
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
              // No aria-label — the visible type pill + title text
              // naturally become the accessible name. An aria-label like
              // "Select X" would mismatch the visible text and violate
              // WCAG 2.5.3 (Label in Name).
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
              {/*
                Type pill sits on top of the bundle's accent color.
                  truth → ember (warm, question energy)
                  dare  → rose  (editorial red, challenge energy)
                  both  → cream (neutral, "your deck, not ours")
                The "both" case covers the user-authored "Write Your
                Own" bundle; its neutral cream label signals that this
                tile is meta/custom rather than a stock game mode.
              */}
              <span
                className="dial-type"
                style={{
                  color:
                    bundle.type === "truth"
                      ? "var(--ember-soft)"
                      : bundle.type === "dare"
                        ? "var(--rose)"
                        : "var(--text-sub)",
                }}
              >
                {bundle.type === "truth"
                  ? "Question Bundle"
                  : bundle.type === "dare"
                    ? "Challenge Bundle"
                    : "Custom Bundle"}
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

      {/*
        Dot indicators — rendered as a vertical column on the right
        edge of the text (description) dial, which places them at
        the far-right of the overall bundles layout on desktop. See
        `.dial-dots` + `.dial--text` in globals.css. Each button is
        a 24×24 hit target (meets WCAG touch-target min) with a 10px
        visible dot so the column reads tight and compact.
      */}
      <div className="dial-dots">
        {bundles.map((b, i) => (
          <button
            key={b.label}
            type="button"
            className={`dial-dot${i === active ? " dial-dot--active" : ""}`}
            onClick={() => onSelect(i)}
            aria-label={`Go to ${b.label}`}
            aria-pressed={i === active}
          >
            <span
              className="dial-dot-mark"
              style={i === active ? { background: b.accent } : undefined}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}
