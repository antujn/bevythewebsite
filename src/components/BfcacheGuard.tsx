"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NOT_FOUND_RETURN_KEY } from "./NotFoundBeacon";

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

function markAndReload(reason: string) {
  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch {
    // sessionStorage unavailable — proceed anyway; the worst case
    // is a reload loop, which Safari's loop detector catches.
  }
  // Loud diagnostic so the trigger is verifiable in DevTools.
  // eslint-disable-next-line no-console
  console.warn(`[bevy] BfcacheGuard reload: ${reason}`);
  window.location.reload();
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
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // bfcache restore signal
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !reloadedRecently()) {
        markAndReload("pageshow persisted");
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // Browser back/forward always emits popstate.
    // If that lands on / (including /#hero), force one guarded reload.
    const handlePopState = () => {
      if (window.location.pathname === "/" && !reloadedRecently()) {
        markAndReload("popstate -> /");
      }
    };
    window.addEventListener("popstate", handlePopState);

    const cleanup = () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };

    // Next soft navigation from any route -> / may not emit pageshow
    // or back_forward timing. Detect direct route transition via
    // pathname history and reload once.
    const prevPath = prevPathRef.current;
    const transitionedToHome = pathname === "/" && prevPath !== "/";
    prevPathRef.current = pathname;

    if (transitionedToHome && !reloadedRecently()) {
      markAndReload(`transition ${prevPath} -> /`);
      return cleanup;
    }

    // Hard back/forward nav entry type (non-bfcache path)
    try {
      const navEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (
        pathname === "/" &&
        navEntry?.type === "back_forward" &&
        !reloadedRecently()
      ) {
        markAndReload("back_forward navigation type");
        return cleanup;
      }
    } catch {
      // performance API unavailable — skip.
    }

    // Legacy not-found beacon fallback
    if (
      pathname === "/" &&
      safeGet(NOT_FOUND_RETURN_KEY) &&
      !reloadedRecently()
    ) {
      safeRemove(NOT_FOUND_RETURN_KEY);
      markAndReload("legacy not-found beacon");
      return cleanup;
    }

    return cleanup;
  }, [pathname]);

  return null;
}
