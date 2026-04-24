"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import DownloadButton from "./DownloadButton";

// Base paths without extension — each video is served as both .webm
// (VP9, smaller, modern browsers) and .mp4 (H.264, universal fallback)
// via <source> children below, so the browser picks what it supports.
//
// Hero cycles through one sample of each major gameplay mode so the
// first-fold viewer sees the full range of the app (alias turn picking,
// tap-to-pick finger mode, AI chat). Previously this cycled through
// three alias-mode variants, but the nsfw + early-dating clips were
// retired when those per-bundle recordings were dropped.
const frontVideos = [
  "/videos/alias-mode-significant-other",
  "/videos/finger-mode-significant-other",
  "/videos/ai-chat-significant-other",
];

const backVideo = "/videos/hero-screen";

// How long to linger on the current video after it has ended before
// advancing to the next one (keeps the final frame visible briefly).
const LINGER_AFTER_END_MS = 2000;

// Shared easing — a soft quartic-out that settles confidently.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Entrance timings (seconds). Tuned for a ~1.4s total choreography.
const DELAY = {
  proof: 0.25,
  headlineWord: 0.4, // base; each word adds + 0.1
  reimagined: 0.78,
  description: 0.95,
  button: 1.05,
  mockBack: 0.55,
  mockFront: 0.7,
  ambientStart: 1.9, // delay before ambient float loops kick in
  discover: 1.2,
} as const;

const HEADLINE_WORDS = ["Truth", "or", "Dare."];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  // ── Video auto-cycle (unchanged behaviour) ──────────────────
  const advancingRef = useRef(false);
  const advanceTimeoutRef = useRef<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const handleFrontVideoEnd = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
    }

    advanceTimeoutRef.current = window.setTimeout(() => {
      setActive((prev) => (prev + 1) % frontVideos.length);
      advancingRef.current = false;
      advanceTimeoutRef.current = null;
    }, LINGER_AFTER_END_MS);
  }, []);

  useEffect(() => {
    const tryPlay = (el: HTMLVideoElement) => {
      if (el.readyState >= 1) {
        try {
          el.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          const onReady = () => {
            el.removeEventListener("loadedmetadata", onReady);
            el.removeEventListener("canplay", onReady);
            el.play().catch(() => {});
          };
          el.addEventListener("loadedmetadata", onReady, { once: true });
          el.addEventListener("canplay", onReady, { once: true });
        });
      }
    };

    frontVideos.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      if (i === active) tryPlay(el);
      else el.pause();
    });
  }, [active]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  // ── Scroll-linked parallax ────────────────────────────────
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // As the user scrolls past the hero, its content translates up + fades,
  // and the background scales up slightly for a subtle parallax.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.2]);
  const discoverOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // ── Mouse-move 3D tilt on the mocks ───────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mxSpring = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 0.5 });
  const mySpring = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 0.5 });
  const frontTiltX = useTransform(mySpring, [-200, 200], [6, -6]);
  const frontTiltY = useTransform(mxSpring, [-200, 200], [-6, 6]);
  const backTiltX = useTransform(mySpring, [-200, 200], [4, -4]);
  const backTiltY = useTransform(mxSpring, [-200, 200], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* Background — scroll-linked scale + opacity */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: bgScale, opacity: bgOpacity }}
      >
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img"
          priority
        />
        {/* Section dim overlay — wine-tinted to match the unified
            palette (replaces the old neutral black overlay). Mirrors
            the --section-overlay token in globals.css. */}
        <div className="section-overlay absolute inset-0" />
      </motion.div>

      {/* Hero content — scroll-linked translate + fade */}
      <motion.div
        className="site-shell relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Left — Headline + copy + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.div
            className="hero-proof"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 18,
              delay: DELAY.proof,
            }}
          >
            <span className="hero-proof-stars">
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </span>
            <span className="hero-proof-text">
              4.7 &middot; 25K+ downloads on the App Store
            </span>
          </motion.div>

          <h1
            style={{ marginTop: 20 }}
            className="font-display text-[clamp(40px,6.5vw,78px)] font-normal leading-[1.05] text-white/92"
          >
            {HEADLINE_WORDS.map((w, i) => (
              <motion.span
                key={w}
                style={{ display: "inline-block", marginRight: "0.25em" }}
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.7,
                  ease: EASE_OUT,
                  delay: DELAY.headlineWord + i * 0.1,
                }}
              >
                {w}
              </motion.span>
            ))}
            <br />
            {/* "Reimagined." — the couplet payoff. Rendered via the
                shared .title-accent utility (rose italic, see globals.css)
                so it matches every other couplet headline on the site
                and mirrors the italic treatment in the reference
                imagery. */}
            <motion.span
              className="title-accent font-bold"
              style={{ display: "inline-block" }}
              initial={{ opacity: 0, y: 30, scale: 0.92, rotate: -3 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.95,
                ease: EASE_OUT,
                delay: DELAY.reimagined,
              }}
            >
              Reimagined.
            </motion.span>
          </h1>

          <motion.p
            style={{ marginTop: 20 }}
            className="max-w-[420px] text-[15px] font-light leading-[1.75] text-white/44"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: EASE_OUT,
              delay: DELAY.description,
            }}
          >
            The modern, meaningful alternative to traditional truth or dare
            games. 1000+ carefully crafted cards.
          </motion.p>

          <motion.div
            style={{ marginTop: 24 }}
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
              delay: DELAY.button,
            }}
          >
            <DownloadButton width={188} height={63} />
          </motion.div>
        </div>

        {/* Right — Two phone mocks with 3D tilt + ambient float + entrance */}
        <div
          className="hero-mocks"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1400 }}
        >
          {/* Front mock — rendered first so the back mock's CSS
              `margin-left: -60px` pulls it over the front, creating the
              classic "duo" overlap. z-index on the classes keeps the
              front visually on top regardless of DOM order. */}
          <motion.div
            className="hero-mock-front"
            initial={{ opacity: 0, x: 120, scale: 0.9, rotate: -6 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
            transition={{
              duration: 1.1,
              ease: EASE_OUT,
              delay: DELAY.mockFront,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: DELAY.ambientStart,
              }}
              style={{
                rotateX: frontTiltX,
                rotateY: frontTiltY,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="phone-mock">
                <div className="phone-mock__screen">
                  {frontVideos.map((base, i) => (
                    <motion.video
                      key={base}
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      autoPlay={i === 0}
                      muted
                      playsInline
                      // Fully preload all slides so crossfades are instant
                      // and never wait on network when the active video
                      // hands off to the next.
                      preload="auto"
                      onEnded={i === active ? handleFrontVideoEnd : undefined}
                      className="gameplay-video"
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 1.02,
                      }}
                      transition={{
                        opacity: { duration: 0.6, ease: EASE_OUT },
                        scale: { duration: 0.7, ease: EASE_OUT },
                      }}
                      style={{
                        pointerEvents: i === active ? "auto" : "none",
                        zIndex: i === active ? 2 : 1,
                      }}
                    >
                      <source src={`${base}.webm`} type="video/webm" />
                      <source src={`${base}.mp4`} type="video/mp4" />
                    </motion.video>
                  ))}
                </div>
                <Image
                  src="/images/mockups/iphone-17-pro-mockup.png"
                  alt=""
                  fill
                  sizes="380px"
                  className="phone-mock__frame"
                  priority
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Back mock — rendered second; its CSS margin-left: -60px
              pulls it over the front (but z-index keeps it behind). */}
          <motion.div
            className="hero-mock-back"
            initial={{ opacity: 0, x: -50, scale: 0.92, rotate: 4 }}
            animate={{ opacity: 0.78, x: 0, scale: 1, rotate: 0 }}
            transition={{
              duration: 1.2,
              ease: EASE_OUT,
              delay: DELAY.mockBack,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: DELAY.ambientStart + 0.2,
              }}
              style={{
                rotateX: backTiltX,
                rotateY: backTiltY,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="phone-mock">
                <div className="phone-mock__screen">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="h-full w-full object-contain"
                  >
                    <source src={`${backVideo}.webm`} type="video/webm" />
                    <source src={`${backVideo}.mp4`} type="video/mp4" />
                  </video>
                </div>
                <Image
                  src="/images/mockups/iphone-17-pro-mockup.png"
                  alt=""
                  fill
                  sizes="380px"
                  className="phone-mock__frame"
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Discover scroll indicator — one-time fade-in, then scroll-linked fade */}
      <motion.div
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: EASE_OUT,
          delay: DELAY.discover,
        }}
      >
        <motion.a
          href="#s1"
          className="flex flex-col items-center gap-2 text-white/34 transition-colors hover:text-white/62"
          style={{ opacity: discoverOpacity }}
        >
          <span className="text-[10px] tracking-[0.25em] uppercase">
            Discover
          </span>
          <motion.svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </motion.svg>
        </motion.a>
      </motion.div>
    </section>
  );
}
