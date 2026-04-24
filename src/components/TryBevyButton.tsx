"use client";

import { motion } from "motion/react";
import { useDownload } from "./DownloadContext";

type Size = "sm" | "md";

/**
 * Ember-gradient "Try Bevy" CTA pill.
 *
 * A text-based, editorial alternative to the App Store badge
 * <DownloadButton />. Used inline inside body sections and feature
 * cards where the full App Store button would feel too heavy. On
 * click it routes through the same DownloadContext flow (opens
 * the QR / iPhone-only modal) as every other CTA on the site, so
 * there's no duplicated download logic.
 *
 * Sizes:
 *   - "sm" — compact, for feature-deck cards where horizontal space
 *            is shared with the illustration.
 *   - "md" — default, for section headers (Experience, Gameplay).
 *
 * All styling lives in `.try-bevy-btn` / `.try-bevy-btn--sm` in
 * globals.css so the palette can be retuned from one place if the
 * ember brand color shifts.
 */
export default function TryBevyButton({
  label = "Try Bevy",
  size = "md",
  className = "",
}: {
  label?: string;
  size?: Size;
  className?: string;
}) {
  const { triggerDownload } = useDownload();

  return (
    <motion.button
      type="button"
      onClick={triggerDownload}
      className={`try-bevy-btn${size === "sm" ? " try-bevy-btn--sm" : ""} ${className}`.trim()}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      {label}
    </motion.button>
  );
}
