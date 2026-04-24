"use client";

import { useEffect } from "react";

/**
 * Defends the homepage against Safari / Chrome's back-forward cache
 * (bfcache) restoring a stale paint with frozen motion state.
 *
 * Problem:
 *   User scrolls through the homepage (motion hooks active). They
 *   navigate to a 404 / bundle / external link, then hit the browser
 *   back button. Modern browsers aggressively restore the prior page
 *   from bfcache — the DOM is resurrected wholesale, but JavaScript
 *   execution was frozen at the exact moment the user navigated away.
 *   useScroll trackers, IntersectionObservers, Framer Motion gesture
 *   listeners, and GSAP ticker loops all stay paused indefinitely.
 *   The result: page looks right but nothing animates — reads as
 *   "motion is broken."
 *
 * Solution:
 *   Listen for `pageshow` with `event.persisted === true`. That's the
 *   browser's explicit signal "I just restored this page from bfcache
 *   instead of rendering it fresh." In response, reload the page so
 *   every hook reinitialises from scratch.
 *
 * Trade-off:
 *   A full reload is heavier than a soft remount, but Bevy's site
 *   holds no form state, scroll position, or session data the user
 *   would lose. For a marketing site the guaranteed correctness is
 *   worth the brief flash.
 *
 * Drop this component near the root so it's mounted for every route.
 */
export default function BfcacheGuard() {
  useEffect(() => {
    const handler = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache. Reload to reinitialise
        // all client-side machinery (motion hooks, scroll trackers,
        // Intersection Observers, event listeners).
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);

  return null;
}
