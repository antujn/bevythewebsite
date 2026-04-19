"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Wraps the app with framer-motion's `MotionConfig` so every motion
 * component in the tree respects the user's `prefers-reduced-motion`
 * system setting.
 *
 * `reducedMotion="user"` tells framer-motion to:
 *   - skip transform animations (x, y, scale, rotate, rotateX/Y, skew…)
 *   - keep opacity animations (still essential for legibility)
 * when the user has motion disabled at the OS/browser level.
 *
 * That's the right default for this site: users with motion sensitivity
 * still see content fade in naturally, but no parallax, springs,
 * coverflow tilts, ambient floats, or word-staggers play out.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
