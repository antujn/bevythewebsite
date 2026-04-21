"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin gold bar pinned to the top of the viewport that fills left to
 * right as the user scrolls through the document. Sits just below the
 * fixed 84px nav so it reads as a reading-progress indicator for
 * whatever page is currently rendered.
 *
 * Uses `useSpring` on top of `scrollYProgress` so the bar tracks the
 * scroll position with a subtle follow-through rather than snapping,
 * making fast scrolls feel fluid instead of jittery.
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX: smoothed }}
      aria-hidden
    />
  );
}
