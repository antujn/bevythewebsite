"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { RevealIn, RevealGroup, RevealChild } from "./RevealIn";
import TryBevyButton from "./TryBevyButton";

// Base paths without extension — each video is served as both .webm
// and .mp4 (see <source> tags below) so the browser picks what it
// can decode. See P2 conversion notes: sizes dropped ~70% vs .mov.
//
// Slide order intentionally walks the user through the in-app tab
// flow as they'd encounter it in a typical session: open the app
// → Explore the deck → pick a game mode (Finger or Alias) → if
// solo, hop into BevyAI Chat → if you want personal cards, write
// them in Custom Mode. Same narrative the FAQ and homepage Feature
// Deck use, just more screen-by-screen.
const gameplaySlides = [
  {
    label: "Browse the cards before playing",
    title: "Browse the deck. Build the night.",
    body: "Open the Explore tab to flick through every bundle, every prompt, every dare. Search for a vibe, save the cards you'll want later, exclude the ones that don't fit your room. Your deck, curated long before the first card lands on the table.",
    points: ["Full prompt library", "Save and exclude cards", "Search across every bundle"],
    frontVideo: "/videos/explore-tab",
  },
  {
    label: "Let fingers decide whose turn it is",
    title: "Lay your fingers down. Let chance pick the next move.",
    body: "Everyone places a finger on the screen and Bevy picks who goes next. Pure momentum \u2014 no waiting, no debating, no awkward \u201cwhose turn is it\u201d. The cards keep flowing and the room stays in motion.",
    points: ["Touch-driven turn picker", "Solo, duo, or full party", "Designed for in-person play"],
    frontVideo: "/videos/finger-mode-significant-other",
  },
  {
    label: "Become someone else",
    title: "Slip into a name. Carry the night to its finish.",
    body: "Everyone picks a fun alias, takes turns through the cards, and the built-in scoreboard tracks who's winning. Great for date nights, dinner parties, or any group that wants the arc of a real game from warm-up to last call.",
    points: ["Alias setup per player", "Live scoreboard", "Saves and resumes between sessions"],
    frontVideo: "/videos/alias-mode-significant-other",
  },
  {
    label: "When no one\u2019s free tonight",
    title: "No group around? Bevy plays back.",
    body: "Open BevyAI and tap any card to get a thoughtful reply, voiced as if a friend is answering across the table. Great for solo reflection, new-relationship calibration, or warming up your own answers before you bring the game to a group.",
    points: ["AI replies to any prompt", "One token per reply", "Works with every bundle"],
    frontVideo: "/videos/ai-chat-significant-other",
  },
  {
    label: "Write your own cards",
    title: "Write the cards your crew would actually play.",
    body: "Compose prompts that fit your inside jokes, your relationships, your mood. Save them, mix them in with the stock bundles, and pull them up whenever the moment calls. The cards stay on your device \u2014 private to your group, not uploaded to a server.",
    points: ["Custom prompt builder", "Mixes with every bundle", "Stored locally, never uploaded"],
    frontVideo: "/videos/custom-mode",
  },
];

const gameModeScreen = "/videos/game-mode-screen";

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
          alt="Atmospheric illustration behind the Bevy gameplay showcase — mood setting for the five tabs walked through below: Explore, Finger Game, Alias Game, BevyAI Chat, Custom Mode"
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
        />
        <div className="section-overlay absolute inset-0" />
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
            {/* Couplet headline — see .title-accent in globals.css. */}
            <h2
              id="gameplay-heading"
              className="section-title section-anchor-title"
            >
              An interface designed to feel
              <br />
              <span className="title-accent">intuitive and effortless.</span>
            </h2>
          </RevealChild>
          <RevealChild preset="scale">
            <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          </RevealChild>
        </RevealGroup>

        <div className="gameplay-layout">
          <div className="gameplay-copy">
            <RevealGroup stagger={0.05} delay={0.15} className="gameplay-tabs">
              {gameplaySlides.map((slide, i) => {
                const isActive = i === active;
                return (
                  <RevealChild key={slide.label}>
                    <button
                      type="button"
                      className={`gameplay-tab${isActive ? " gameplay-tab--active" : ""}`}
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                    >
                      {slide.label}
                    </button>
                  </RevealChild>
                );
              })}
            </RevealGroup>

            {/*
              Text copy crossfade. To keep the surrounding layout
              from jumping when a longer slide replaces a shorter
              one, every slide is rendered simultaneously and they
              all share the same CSS grid cell (`grid-area: 1 / 1`
              via `.gameplay-copy-slide`). The grid cell sizes to
              the tallest slide's natural footprint and holds that
              height regardless of which slide is currently
              visible. Only the active slide is opacity 1 + pointer-
              events on; the others sit at opacity 0 underneath but
              still anchor the grid's height.
            */}
            <div className="gameplay-copy-stage">
              {gameplaySlides.map((slide, i) => {
                const isActive = i === active;
                return (
                  <motion.div
                    key={slide.label}
                    className="gameplay-copy-slide"
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 6,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    aria-hidden={!isActive}
                    style={{
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <h3 className="gameplay-title">{slide.title}</h3>
                    <p className="gameplay-body">{slide.body}</p>
                    <div className="gameplay-points">
                      {slide.points.map((point) => (
                        <span key={point} className="gameplay-point">
                          {point}
                        </span>
                      ))}
                    </div>
                    {/* Inline "Try Bevy" CTA below each tab's
                        description. Lives inside each per-slide
                        wrapper so the button rides the same
                        opacity crossfade as the title, body, and
                        chips when the active tab changes. */}
                    <div style={{ marginTop: "1.4rem" }}>
                      <TryBevyButton />
                    </div>
                  </motion.div>
                );
              })}
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
                    >
                      <source src={`${slide.frontVideo}.webm`} type="video/webm" />
                      <source src={`${slide.frontVideo}.mp4`} type="video/mp4" />
                    </motion.video>
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
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="h-full w-full object-contain"
                  >
                    <source src={`${gameModeScreen}.webm`} type="video/webm" />
                    <source src={`${gameModeScreen}.mp4`} type="video/mp4" />
                  </video>
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
