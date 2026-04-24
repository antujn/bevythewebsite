"use client";

import { useEffect } from "react";
import { NOT_FOUND_RETURN_KEY } from "./NotFoundBeacon";

/**
 * Defends every route against back-navigation leaving motion hooks
 * in a frozen / stale state. Covers three failure modes:
 *
 *   1. Safari / Chrome bfcache — the browser restores the previous
 *      page's DOM + paused JS execution wholesale. `pageshow` fires
 *      with `event.persisted === true` as an explicit signal. We
 *      reload so useScroll / IntersectionObserver / Framer Motion
 *      can re-initialise cleanly.
 *
 *   2. Hard back-forward browser navigation (no bfcache) — the
 *      browser does a fresh paint but sets
 *      `PerformanceNavigationTiming.type === 'back_forward'` on
 *      mount. If we detect that, we reload once (guarded by a
 *      short sessionStorage cooldown so the reload itself — type
 *      'reload' — doesn't loop).
 *
 *   3. Next.js soft back-navigation from the 404 page — Next's
 *      client router restores the previous React tree from its
 *      route cache without either bfcache or performance.type
 *      flagging. The 404 page drops a sessionStorage beacon on
 *      mount (<NotFoundBeacon />); this guard reads that beacon
 *      on every mount and reloads if present. Scoped narrowly so
 *      only back-from-404 reloads — other back-navs stay smooth.
 *
 * For a marketing site with no form state / scroll position worth
 * preserving, the brief reload flash is an acceptable trade-off
 * for guaranteed-working motion.
 */
const RELOAD_GUARD_KEY = "bevy_last_reload_ts";
const RELOAD_COOLDOWN_MS = 2000;

function reloadedRecently(): boolean {
  try {
    const last = sessionStorage.getItem(RELOAD_GUARD_KEY);
    if (!last) return false;
    return Date.now() - parseInt(last, 10) < RELOAD_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markAndReload() {
  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable — proceed anyway; the worst case
    // is a reload loop, which Safari's loop detector catches.
  }
  window.location.reload();
}

export default function BfcacheGuard() {
  useEffect(() => {
    // ── Mode 1: bfcache restoration ─────────────────────────────
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !reloadedRecently()) {
        markAndReload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // ── Mode 2: hard back-forward nav (non-bfcache) ─────────────
    // Also catches bfcache on browsers where persisted isn't set.
    try {
      const navEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (navEntry?.type === "back_forward" && !reloadedRecently()) {
        markAndReload();
        return () => window.removeEventListener("pageshow", handlePageShow);
      }
    } catch {
      // performance API unavailable — skip.
    }

    // ── Mode 3: soft back from /404 ─────────────────────────────
    // The 404 page sets NOT_FOUND_RETURN_KEY in sessionStorage; if
    // we see that marker on mount, the user just bounced back.
    try {
      if (
        sessionStorage.getItem(NOT_FOUND_RETURN_KEY) &&
        !reloadedRecently()
      ) {
        sessionStorage.removeItem(NOT_FOUND_RETURN_KEY);
        markAndReload();
      }
    } catch {
      // sessionStorage unavailable — skip.
    }

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}
