/**
 * Single source of truth for Bevy's iOS App Store presence.
 *
 * Used by:
 *   - `layout.tsx`            JSON-LD `MobileApplication.downloadUrl`
 *                             + the Apple Smart Banner meta tag
 *   - `DownloadContext.tsx`   QR modal + iPhone-only modal CTAs
 *   - `FaqSection.tsx`        inline links inside FAQ answers
 *   - `Footer.tsx`            legal-links row ("App Store" entry)
 *
 * If this value ever changes (new bundle id, different store URL
 * format, regional prefix, campaign tag, etc.), edit here and every
 * downstream reference picks it up.
 */

/** Apple's internal numeric app identifier (a.k.a. "iTunes item id"). */
export const APP_STORE_ID = "1553693490";

/** Public App Store web listing. Safe for <a href>, <meta>, JSON-LD. */
export const APP_STORE_URL = `https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id${APP_STORE_ID}`;

/** App Store Connect bundle name used for analytics / copy. */
export const APP_NAME = "Bevy";

/** Long-form brand name used in titles and schema `alternateName`. */
export const APP_FULL_NAME = "Bevy — Truth or Dare. Reimagined.";
