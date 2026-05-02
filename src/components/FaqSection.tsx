"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RevealChild, RevealGroup } from "./RevealIn";

import { APP_STORE_URL } from "@/lib/appStore";
import { faqItems, buildFaqPageJsonLd, type FaqItem } from "@/lib/faq";

// All FAQ cards share the crimson brand anchor — the same value used
// by the Significant Other bundle and the --crimson design token in
// globals.css. Kept as a single constant so the red can be swapped
// (e.g. to a bundle-per-card palette) in one edit. If this value
// changes, also update `--crimson` in `src/app/globals.css`.
const CARD_ACCENT = "#6b0f10";

/**
 * Per-question rich JSX overrides for the homepage card rail. The
 * plain-text `a` field in the shared catalog is canonical (and used
 * by FAQPage JSON-LD, /faq, /llms-full.txt); this map just enriches
 * specific answers inline with links / non-breaking hyphens / etc.
 * If a question isn't in this map, the plain `a` string is rendered
 * as-is.
 */
const FAQ_RENDER_OVERRIDES: Record<string, ReactNode> = {
  "Is it free?": (
    <>
      The core app is free, with a starter bundle and a 7&#8209;day trial of
      Bevy Premium Edition on first install. Subscribe to Premium for access
      to every bundle and extra daily BevyAI tokens. Tokens are a separate
      currency used for BevyAI replies and can be purchased in packs.
      Purchased tokens never expire. No ads, ever. Check the{" "}
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="faq-link"
      >
        App Store listing
      </a>{" "}
      for the latest pricing and plans.
    </>
  ),
};

/** Consumed by the rail; pairs shared items with any rich overrides. */
type FaqCardItem = FaqItem & { render?: ReactNode };
const FAQ_ITEMS: FaqCardItem[] = faqItems.map((item) => ({
  ...item,
  render: FAQ_RENDER_OVERRIDES[item.q],
}));

const FLIP_SPRING = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

// Schema.org FAQPage built from the shared catalog. Homepage emits it
// here and /faq emits its own copy — duplicate emission is fine per
// Google's guidance because the `mainEntity` content is identical.
const jsonLd = buildFaqPageJsonLd();

export default function FaqSection() {
  return (
    <section id="faq" className="section-space relative overflow-hidden">
      <span id="faq-anchor" className="section-anchor-mid" aria-hidden />
      <div aria-hidden className="section-overlay absolute inset-0 z-0" />

      <div className="relative z-10">
        <RevealGroup
          stagger={0.1}
          amount={0.35}
          style={{ maxWidth: 680, marginInline: "auto", textAlign: "center" }}
          className="site-shell"
        >
          <RevealChild>
            <p className="kicker">Frequently Asked Questions</p>
          </RevealChild>
          <RevealChild>
            {/* Couplet headline — inline variant (short enough to fit
                on one line on most screens). See .title-accent in
                globals.css. */}
            <h2 id="faq-heading" className="section-title section-anchor-title">
              A deck of{" "}
              <span className="title-accent font-bold">answers.</span>
            </h2>
          </RevealChild>
          <RevealChild preset="scale">
            <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          </RevealChild>
          <RevealChild>
            <p
              className="section-body"
              style={{ maxWidth: 520, marginInline: "auto" }}
            >
              Tap any card to flip it. Swipe the rail to browse.
            </p>
          </RevealChild>
        </RevealGroup>

        <FaqRail />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

// ── Rail with scroll-affordance arrows ─────────────────────────────
//
// The horizontal card rail wears two overlay buttons — left and right
// chevrons — whose visibility is driven by the viewport's current
// scroll position. Left appears once the user has scrolled past the
// start; right disappears once the user reaches the end. This is the
// same affordance Netflix / Apple TV+ rails use and is purely a
// discoverability nudge — touch users still swipe, the arrows just
// reinforce that more content lives in either direction.
//
// `proximity` scroll-snap means scrollLeft can settle at fractional
// pixel values — we treat anything within 4px of the bounds as "at
// the edge" so the arrows don't flicker on the last sub-pixel of
// momentum.
const SCROLL_EDGE_TOLERANCE = 4;

function FaqRail() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Pulled out so the same logic runs on scroll, on resize, and on
  // mount. Each call reads scrollLeft / clientWidth / scrollWidth and
  // flips the two flags. Wrapped in useCallback so it's stable for
  // the effect's dep list.
  const recomputeScrollFlags = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanScrollLeft(scrollLeft > SCROLL_EDGE_TOLERANCE);
    setCanScrollRight(
      scrollLeft + clientWidth < scrollWidth - SCROLL_EDGE_TOLERANCE,
    );
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    recomputeScrollFlags();

    el.addEventListener("scroll", recomputeScrollFlags, { passive: true });
    // Resize matters because both the viewport's clientWidth and the
    // total scrollWidth (cards re-layout on container width changes
    // via clamp()-driven slot widths) shift independently. A single
    // ResizeObserver on the viewport catches both.
    const ro = new ResizeObserver(recomputeScrollFlags);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", recomputeScrollFlags);
      ro.disconnect();
    };
  }, [recomputeScrollFlags]);

  const scrollByCard = useCallback((direction: "left" | "right") => {
    const el = viewportRef.current;
    if (!el) return;
    // Scroll by ~85% of the viewport width so a "page" reveals the
    // next batch of cards while keeping the trailing card from the
    // previous batch partly visible as a continuity anchor.
    const delta = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -delta : delta,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="faq-rail-wrapper">
      <div className="faq-rail-viewport" ref={viewportRef}>
        <div className="faq-rail">
          {FAQ_ITEMS.map((item, i) => (
            <FaqCard
              key={item.q}
              item={item}
              index={i}
              total={FAQ_ITEMS.length}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {canScrollLeft ? (
          <motion.button
            key="faq-arrow-left"
            type="button"
            className="faq-rail-arrow faq-rail-arrow--left"
            onClick={() => scrollByCard("left")}
            aria-label="Scroll FAQ cards left"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <RailArrowGlyph direction="left" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {canScrollRight ? (
          <motion.button
            key="faq-arrow-right"
            type="button"
            className="faq-rail-arrow faq-rail-arrow--right"
            onClick={() => scrollByCard("right")}
            aria-label="Scroll FAQ cards right"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <RailArrowGlyph direction="right" />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/// Continuously bouncing arrow glyph that mirrors the language of
/// the hero's "Discover" scroll indicator — same stem-and-head SVG
/// path, same 2s easeInOut loop, just rotated and translated along
/// the X axis so each side pokes outward toward the off-screen
/// content. The hero's arrow points down via path geometry; we
/// rotate via an inner `<g>` (rather than a CSS transform on the
/// `<svg>`) so Motion's outer `x` animation isn't fighting a static
/// CSS transform on the same element.
function RailArrowGlyph({ direction }: { direction: "left" | "right" }) {
  // Bounce delta — the arrow glyph translates 6px in its pointing
  // direction, then back. Matches hero's `y: [0, 6, 0]` amplitude
  // exactly so the rail and hero indicators feel like siblings.
  const bounceX = direction === "left" ? [0, -6, 0] : [0, 6, 0];
  // Rotation pivot is the viewbox center (12, 12). Rotating around
  // 0,0 would translate the path off-screen.
  const rotateDeg = direction === "left" ? 90 : -90;

  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
      animate={{ x: bounceX }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <g transform={`rotate(${rotateDeg} 12 12)`}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
        />
      </g>
    </motion.svg>
  );
}

const HINT_PULSE = {
  opacity: [0.48, 0.92, 0.48],
};

function FaqCard({
  item,
  index,
  total,
}: {
  item: FaqCardItem;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardNum = String(index + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");

  // Alternate a tiny tilt on entrance so the stagger reads like dealing
  // a hand rather than identical cards marching in.
  const enterRotate = index % 2 === 0 ? -2.5 : 2.5;

  return (
    <motion.div
      className="faq-card-slot"
      initial={{ opacity: 0, y: 56, rotateZ: enterRotate }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
    >
      <motion.button
        type="button"
        className="faq-card"
        onClick={() => setFlipped((v) => !v)}
        aria-expanded={flipped}
        aria-label={
          flipped
            ? `Answer to: ${item.q}. Tap to flip back.`
            : `${item.q} Tap to reveal the answer.`
        }
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={FLIP_SPRING}
        whileHover={{ y: -6, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — the question */}
        <div
          className="faq-card-face faq-card-front"
          style={{ background: CARD_ACCENT }}
        >
          <div className="faq-card-top">
            <span className="faq-card-chip">Truth</span>
            <span className="faq-card-index">
              {cardNum} / {totalNum}
            </span>
          </div>
          <h3 className="faq-card-q">{item.q}</h3>
          <div className="faq-card-foot">
            <motion.span
              className="faq-card-hint"
              animate={HINT_PULSE}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                // Offset per card so the rail's hints breathe out of
                // sync — much more alive than a uniform pulse.
                delay: index * 0.24,
              }}
            >
              Tap to reveal
            </motion.span>
            <motion.span
              className="faq-card-arrow"
              aria-hidden
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.24,
              }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Back — the answer */}
        <div className="faq-card-face faq-card-back">
          <div className="faq-card-top">
            <span className="faq-card-chip faq-card-chip--answer">Answer</span>
            <span className="faq-card-index">
              {cardNum} / {totalNum}
            </span>
          </div>
          <p className="faq-card-a">{item.render ?? item.a}</p>
          <div className="faq-card-foot">
            <span className="faq-card-hint">Tap to flip back</span>
            <span className="faq-card-arrow" aria-hidden>
              ↺
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
