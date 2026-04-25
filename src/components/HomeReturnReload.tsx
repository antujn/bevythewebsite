"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LAST_PATH_KEY = "bevy_last_pathname";
const RELOAD_GUARD_KEY = "bevy_last_reload_ts";
const RELOAD_COOLDOWN_MS = 2000;

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage unavailable; fallback guards continue to run.
  }
}

function reloadedRecently(): boolean {
  try {
    const last = sessionStorage.getItem(RELOAD_GUARD_KEY);
    if (!last) return false;
    return Date.now() - parseInt(last, 10) < RELOAD_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markAndReload(reason: string, target?: string) {
  try {
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()));
  } catch {
    // Ignore; reload is still valid without a cooldown marker.
  }
  // Loud diagnostic so it's verifiable in DevTools without a debugger.
  // eslint-disable-next-line no-console
  console.warn(`[bevy] forcing hard navigation: ${reason}`, target ?? "");
  if (target) {
    window.location.assign(target);
  } else {
    window.location.reload();
  }
}

/**
 * Mounted from app/template.tsx so it remounts on every route
 * transition. Combines two safeguards against Next.js restoring a
 * cached homepage tree with stale motion hooks:
 *
 * 1. Detect non-home -> home transitions in `useEffect` and reload
 *    after the navigation completes.
 *
 * 2. Intercept clicks on anchors targeting `/` (or `/#anything`)
 *    while on a sub-route, and force a full-page navigation so
 *    Next's client-side router cache is bypassed entirely.
 */
export default function HomeReturnReload() {
  const pathname = usePathname();

  useEffect(() => {
    const currentPath = pathname || "/";
    const previousPath = safeGet(LAST_PATH_KEY);

    safeSet(LAST_PATH_KEY, currentPath);

    if (
      currentPath === "/" &&
      previousPath !== null &&
      previousPath !== "/" &&
      !reloadedRecently()
    ) {
      markAndReload(`route transition ${previousPath} -> /`);
    }
  }, [pathname]);

  // Click interceptor: while on a sub-route, force hard navigation when
  // the user clicks any anchor pointing to "/" or a homepage hash.
  useEffect(() => {
    if (pathname === "/") return;

    const onClick = (event: MouseEvent) => {
      // Honour modifier keys and non-primary buttons (let the browser
      // open in a new tab, etc.)
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      // Skip if anchor opens elsewhere (new tab / external)
      const explicitTarget = anchor.getAttribute("target");
      if (explicitTarget && explicitTarget !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept "/" or "/#anything" (homepage and homepage hash).
      const isHomeHref =
        href === "/" || href.startsWith("/#");
      if (!isHomeHref) return;

      event.preventDefault();
      markAndReload(`anchor click on sub-route -> ${href}`, href);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [pathname]);

  return null;
}
