"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { RevealIn, RevealGroup, RevealChild } from "./RevealIn";

const gameplaySlides = [
  {
    label: "Finger Game",
    title: "Fast turn picking for real groups.",
    body: "Place fingers on screen and let Bevy select who goes next. Perfect for lively rooms where you want momentum, suspense, and zero setup friction.",
    points: ["Quick start flow", "Supports team energy", "Designed for in-person play"],
    frontVideo: "/videos/finger-mode-significant-other.MP4",
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

  // One ref per slide video so we can play/pause when active changes
  // without remounting the element (which is what causes the flicker).
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const handleFrontVideoEnd = useCallback(() => {
    setActive((prev) => (prev + 1) % gameplaySlides.length);
  }, []);

  // Drive play/pause from `active`. Only the active video plays; others pause.
  // Guard currentTime/play against pre-metadata races: if the video isn't
  // ready yet, queue the play for when it becomes ready. This prevents the
  // "nothing shows" state where play() silently fails on a fresh <video>.
  useEffect(() => {
    const tryPlay = (el: HTMLVideoElement) => {
      // Reset only if metadata is loaded (avoids InvalidStateError).
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
          // If play rejects (e.g. video not ready), retry once metadata is in.
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

    gameplaySlides.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;
      if (i === active) {
        tryPlay(el);
      } else {
        el.pause();
      }
    });
  }, [active]);

  return (
    <section id="gameplay" className="section-space relative overflow-hidden">
      <span id="gameplay-anchor" className="section-anchor-mid" aria-hidden />
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustrations/illustration8.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
      </div>

      <div className="site-shell relative z-10">
        <RevealGroup
          stagger={0.12}
          amount={0.4}
          style={{ maxWidth: 720, marginInline: "auto", textAlign: "center" }}
        >
          <RevealChild>
            <p className="kicker">The Gameplay</p>
          </RevealChild>
          <RevealChild>
            <h2
              id="gameplay-heading"
              className="section-title section-anchor-title"
            >
              An interface designed to feel intuitive and effortless.
            </h2>
          </RevealChild>
          <RevealChild preset="scale">
            <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          </RevealChild>
        </RevealGroup>

        <div className="gameplay-layout">
          <div className="gameplay-copy">
            <RevealGroup stagger={0.05} delay={0.15} className="gameplay-tabs">
              {gameplaySlides.map((slide, i) => (
                <RevealChild key={slide.label}>
                  <motion.button
                    className={`gameplay-tab${i === active ? " gameplay-tab--active" : ""}`}
                    onClick={() => setActive(i)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    {slide.label}
                  </motion.button>
                </RevealChild>
              ))}
            </RevealGroup>

            {/* Text copy: crossfade + slight vertical slide when active changes */}
            <div className="gameplay-copy-stage">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={gameplaySlides[active].label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="gameplay-title">{gameplaySlides[active].title}</h3>
                  <p className="gameplay-body">{gameplaySlides[active].body}</p>
                  <div className="gameplay-points">
                    {gameplaySlides[active].points.map((point) => (
                      <span key={point} className="gameplay-point">
                        {point}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="gameplay-mocks">
            <div className="gameplay-mock-front">
              <RevealIn preset="fade" delay={0.1} duration={0.8}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
              <div className="phone-mock">
                {/*
                  All slide videos are mounted simultaneously. Only the
                  active one is visible (opacity 1) and playing. Others
                  are kept loaded + paused, so switching is a pure
                  GPU-composited opacity crossfade — no unmount, no
                  network re-fetch, no black flash.
                */}
                <div className="phone-mock__screen">
                  {gameplaySlides.map((slide, i) => (
                    <motion.video
                      key={slide.frontVideo}
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      src={slide.frontVideo}
                      // autoPlay only on the initially-active video so its
                      // first frame paints ASAP without waiting for an effect.
                      autoPlay={i === 0}
                      muted
                      playsInline
                      preload="auto"
                      onEnded={i === active ? handleFrontVideoEnd : undefined}
                      className="gameplay-video"
                      initial={false}
                      animate={{
                        opacity: i === active ? 1 : 0,
                        scale: i === active ? 1 : 1.02,
                      }}
                      transition={{
                        opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      }}
                      style={{
                        // Keep inactive videos non-interactive and below the active one
                        pointerEvents: i === active ? "auto" : "none",
                        zIndex: i === active ? 2 : 1,
                      }}
                    />
                  ))}
                </div>
                <Image
                  src="/images/mockups/iphone-17-pro-mockup.png"
                  alt=""
                  fill
                  sizes="380px"
                  className="phone-mock__frame"
                />
              </div>
                </motion.div>
              </RevealIn>
            </div>

            <div className="gameplay-mock-back">
              <RevealIn preset="fade" delay={0.25} duration={0.9}>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
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
                </motion.div>
              </RevealIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
