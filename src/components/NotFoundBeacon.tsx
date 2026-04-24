"use client";

import { useEffect } from "react";

/**
 * Tiny client component dropped inside not-found.tsx. On mount it
 * writes a sessionStorage flag so the next page the user lands on
 * knows "the user just came back from a 404 — reload me to flush
 * any stale motion hooks inherited from the cached previous page."
 *
 * <BfcacheGuard /> (mounted at the root of every route) reads this
 * flag on mount and, if set, calls window.location.reload() once to
 * reinitialise all motion, scroll trackers, and IntersectionObservers.
 *
 * Why this exists:
 *   The generic bfcache handler in BfcacheGuard catches Safari's
 *   "pageshow with event.persisted === true" case. But when the user
 *   types a non-existent URL, Next.js renders the 404 via a soft
 *   transition — no bfcache involved. Pressing back returns to the
 *   homepage through Next.js's router cache, which restores the
 *   previous React tree without cleanly remounting motion hooks.
 *   This beacon + guard pair is the explicit hand-off: 404 sets the
 *   flag; next mount sees it and reloads.
 *
 * The beacon is wrapped in try/catch because sessionStorage throws
 * on private-browsing Safari and locked-down Firefox profiles.
 * Silent failure is fine — the user may still see broken motion,
 * but the site otherwise works.
 */
export const NOT_FOUND_RETURN_KEY = "bevy_returning_from_404";

export default function NotFoundBeacon() {
  useEffect(() => {
    try {
      sessionStorage.setItem(NOT_FOUND_RETURN_KEY, "1");
    } catch {
      // sessionStorage unavailable (private-browsing Safari). Nothing
      // we can do here — the reload-on-return heuristic is disabled
      // for this session.
    }
  }, []);

  return null;
}
