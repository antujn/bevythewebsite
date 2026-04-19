"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";

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

const N = features.length;
// Number of fly-off transitions = N - 1. The last card lands on top and stays,
// so scroll progress is divided into (N - 1) equal fly-off slots.
const FLY_SLOTS = N - 1;

// ── Per-card motion-value derivation ─────────────────────────────
// Cards 0..N-2 each own a fly-off slot of scroll progress
// [i/FLY_SLOTS, (i+1)/FLY_SLOTS]. Within that slot, the card translates
// up + rotates + fades out. Before its slot, the card sits in the deck
// with a depth offset. The LAST card (index N-1) never flies off — it
// only eases forward from its depth position as the previous card leaves.
function useCardTransforms(progress: MotionValue<number>, i: number) {
  const isLast = i === N - 1;
  const slotStart = i / FLY_SLOTS;
  const slotEnd = (i + 1) / FLY_SLOTS;

  // translateY: while in slot, go from 0 → -120vh.
  // Last card: pinned at 0 for the entire scroll range.
  const y = useTransform(
    progress,
    isLast ? [0, 1] : [slotStart, slotEnd],
    isLast ? ["0vh", "0vh"] : ["0vh", "-120vh"]
  );

  // rotate: small tilt as it flies off (alternate direction for variety).
  // Last card: no rotation ever.
  const flyRotate = i % 2 === 0 ? -6 : 6;
  const rotate = useTransform(
    progress,
    isLast ? [0, 1] : [slotStart, slotEnd],
    isLast ? [0, 0] : [0, flyRotate]
  );

  // opacity: fade out during the last ~45% of its slot.
  // Last card: stays fully opaque.
  const fadeStart = slotStart + (slotEnd - slotStart) * 0.55;
  const opacity = useTransform(
    progress,
    isLast ? [0, 1] : [slotStart, fadeStart, slotEnd],
    isLast ? [1, 1] : [1, 1, 0]
  );

  // Depth transforms — how the card sits behind the cards on top of it,
  // BEFORE its own "arrival" (i.e. before the previous card flies off).
  // For i=0 (top card from the start): always flat at rest.
  // For i>0: stays pushed back (y: +offset, scale: <1, opacity dimmed)
  // until the (i-1)th card has flown off.
  const prevSlotStart = (i - 1) / FLY_SLOTS;
  const prevSlotEnd = i / FLY_SLOTS;
  const depthY = useTransform(
    progress,
    [0, prevSlotStart, prevSlotEnd],
    i === 0 ? ["0px", "0px", "0px"] : ["28px", "28px", "0px"]
  );
  const depthScale = useTransform(
    progress,
    [0, prevSlotStart, prevSlotEnd],
    i === 0 ? [1, 1, 1] : [0.94, 0.94, 1]
  );
  const depthOpacity = useTransform(
    progress,
    [0, prevSlotStart, prevSlotEnd],
    i === 0 ? [1, 1, 1] : [0.55, 0.55, 1]
  );

  return { y, rotate, opacity, depthY, depthScale, depthOpacity };
}

function FeatureCard({
  feature,
  index,
  progress,
  onTop,
}: {
  feature: (typeof features)[number];
  index: number;
  progress: MotionValue<number>;
  onTop: boolean;
}) {
  const { y, rotate, opacity, depthY, depthScale, depthOpacity } =
    useCardTransforms(progress, index);

  return (
    <motion.div
      className="fd-card fd-card--stacked"
      style={{
        background: feature.bg,
        // Stacked ordering: lower index = on top
        zIndex: N - index,
        y,
        rotate,
        opacity,
        // depth transforms apply via nested translate/scale using CSS vars
        ["--fd-depth-y" as string]: depthY,
        ["--fd-depth-scale" as string]: depthScale,
        ["--fd-depth-opacity" as string]: depthOpacity,
      }}
      aria-hidden={!onTop}
    >
      <div className="fd-card-depth">
        <div className="fd-card-copy">
          <h2 className="fd-card-title">{feature.title}</h2>
          <p className="fd-card-body">{feature.body}</p>
        </div>
        <div className="fd-card-media">
          <Image
            src={feature.imageSrc}
            alt={feature.tab}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="fd-card-illustration"
            priority={index === 0}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function FeatureDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Track scroll progress through the tall section.
  // offset: when the section's top hits the top of the viewport = 0,
  // when the section's bottom hits the bottom of the viewport = 1.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Derive active index from scroll progress for the tabs + progress bar.
  // The "active" card is whichever card is currently on top of the stack.
  // Progress 0      → card 0 on top
  // Progress k/(N-1) → card k on top (for k = 0..N-1)
  // Progress 1      → last card on top
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * FLY_SLOTS + 0.0001)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const handleTabClick = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const sectionStartY = window.scrollY + rect.top;
    const scrollableHeight = el.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    // Scroll to ~20% into the target card's slot — the card is on top
    // and hasn't started flying off yet. For the last card there is no
    // fly-off slot, so land at progress = 1 (its final resting state).
    let targetProgress: number;
    if (i === N - 1) {
      targetProgress = 0.999;
    } else {
      const step = 1 / FLY_SLOTS;
      targetProgress = Math.min(0.999, i * step + step * 0.2);
    }
    const targetY = sectionStartY + scrollableHeight * targetProgress;

    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const progressPct = ((active + 1) / N) * 100;

  return (
    <section
      id="s1"
      ref={sectionRef}
      className="feature-deck-section relative"
    >
      <span
        id="s1-anchor"
        className="section-anchor-mid section-anchor-mid--feature"
        aria-hidden
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
      <div className="fd-sticky-container relative z-10">
        <div
          style={{
            maxWidth: "var(--shell-max)",
            width: "100%",
            marginInline: "auto",
          }}
        >
          <article
            style={{
              maxWidth: 680,
              marginInline: "auto",
              textAlign: "center",
              paddingBottom: 32,
            }}
          >
            <p className="kicker">The Experience</p>
            <h2 className="section-title">
              The best nights aren&rsquo;t planned.
              <br />
              They&rsquo;re felt.
            </h2>
            <div
              className="gold-line mt-4"
              style={{ marginInline: "auto" }}
            />
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

          {/* Card deck — all N cards rendered, each drives its own transforms */}
          <div className="fd-stack fd-stack--deck">
            {features.map((f, i) => (
              <FeatureCard
                key={f.tab}
                feature={f}
                index={i}
                progress={scrollYProgress}
                onTop={i === active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
