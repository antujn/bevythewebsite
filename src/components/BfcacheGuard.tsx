"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { NOT_FOUND_RETURN_KEY } from "./NotFoundBeacon";

/**
 * Defends every route against back-navigation leaving motion hooks
 * in a frozen / stale state. Covers four failure modes:
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
 *   3. Next.js soft back-navigation from any sub-route to the
 *      homepage — Next's client router restores the homepage's
 *      previous React tree from the route cache without bfcache or
 *      performance.type flagging the navigation. The homepage's
 *      motion hooks (useScroll, whileInView, useMotionValueEvent,
 *      IntersectionObserver) come back attached to a stale window
 *      / scroll position state and report broken animations.
 *
 *      Fix: every sub-route mount writes a sessionStorage beacon
 *      ("I'm not the homepage; if the next mount IS the homepage,
 *      it's a back-nav from me — reload."). When the homepage
 *      remounts, this guard reads the beacon and reloads once.
 *
 *   4. Soft back-navigation from /404 specifically — same root cause
 *      as Mode 3, but the 404 page is a Server Component intentionally,
 *      so the legacy <NotFoundBeacon /> writes its own dedicated
 *      sessionStorage flag (NOT_FOUND_RETURN_KEY) and we still honour
 *      it for backwards compatibility / defence-in-depth.
 *
 * For a marketing site with no form state / scroll position worth
 * preserving, the brief reload flash is an acceptable trade-off
 * for guaranteed-working motion.
 */
const RELOAD_GUARD_KEY = "bevy_last_reload_ts";
const RELOAD_COOLDOWN_MS = 2000;

/**
 * Generic "user just navigated away from home" beacon. Set by every
 * sub-route mount, cleared by the homepage on remount after a reload
 * or when the homepage mounts cleanly without a previous reload.
 */
const SUBROUTE_VISIT_KEY = "bevy_visited_subroute";

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

function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage unavailable (private-browsing Safari etc.). The
    // reload-on-back heuristic is disabled for this session.
  }
}

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // sessionStorage unavailable — nothing to clean up.
  }
}

export default function BfcacheGuard() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    // ── Mode 3: returning to home from any sub-route ────────────
    //
    // Run *before* the bfcache / back-forward checks so the
    // sub-route beacon doesn't get clobbered by an unrelated reload
    // path. If the user is on the homepage and we recorded a
    // sub-route visit since the last clean homepage mount, that's a
    // back-nav from a sub-route — reload to flush stale motion.
    if (isHome) {
      if (safeGet(SUBROUTE_VISIT_KEY) && !reloadedRecently()) {
        safeRemove(SUBROUTE_VISIT_KEY);
        markAndReload();
        return;
      }
      // Fresh homepage mount with no pending sub-route visit. Clear
      // the flag (defensive; should already be empty here) so a
      // future sub-route visit starts from a clean state.
      safeRemove(SUBROUTE_VISIT_KEY);
    } else {
      // On any sub-route: drop the beacon. The next homepage mount
      // (regardless of how the user gets there — back button, link,
      // typed URL) will see this and reload.
      safeSet(SUBROUTE_VISIT_KEY, pathname ?? "1");
    }

    // ── Mode 1: bfcache restoration ─────────────────────────────
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !reloadedRecently()) {
        markAndReload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // ── Mode 2: hard back-forward nav (non-bfcache) ─────────────
    // Also catches bfcache on browsers where `persisted` isn't set.
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

    // ── Mode 4: legacy 404 beacon ───────────────────────────────
    // Belt-and-suspenders: the generic Mode 3 path above covers /404
    // too (since /404 is a sub-route), but keeping this honours any
    // older deployments that wrote the flag before this version
    // shipped, and protects against any race where /404 wrote its
    // beacon but didn't get a chance to write SUBROUTE_VISIT_KEY.
    if (safeGet(NOT_FOUND_RETURN_KEY) && !reloadedRecently()) {
      safeRemove(NOT_FOUND_RETURN_KEY);
      markAndReload();
    }

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [isHome, pathname]);

  return null;
}
