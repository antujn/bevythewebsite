"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Decides what to do when the user taps "Try for free":
 *   - "direct"      → iPhone / iPod, which can install directly
 *   - "qr"          → desktop or iPad — user scans a QR with an iPhone
 *   - "unsupported" → Android — no QR to scan, show an iPhone-only note
 */
type DownloadAction = "direct" | "qr" | "unsupported";

type DownloadContextValue = { triggerDownload: () => void };

const DownloadContext = createContext<DownloadContextValue>({
  triggerDownload: () => {},
});

export function useDownload() {
  return useContext(DownloadContext);
}

function getDownloadAction(): DownloadAction {
  if (typeof navigator === "undefined") return "qr";
  const ua = navigator.userAgent;

  // iPhone / iPod can install Bevy straight from the App Store.
  if (/iPhone|iPod/i.test(ua)) return "direct";

  // Android can't install Bevy and scanning a QR to the App Store
  // won't help either, so show a clear "iPhone only" note.
  if (/Android/i.test(ua)) return "unsupported";

  // Everything else — desktop, iPad, iPadOS Safari masquerading as
  // Mac — gets the QR code to scan with a nearby iPhone.
  return "qr";
}

type ModalKind = null | "qr" | "unsupported";

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalKind>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setModal(null), []);

  const triggerDownload = useCallback(() => {
    // Remember the element that opened the modal so focus can return
    // there when it closes.
    triggerRef.current =
      (document.activeElement as HTMLElement | null) ?? null;

    const action = getDownloadAction();
    if (action === "direct") {
      window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setModal(action === "unsupported" ? "unsupported" : "qr");
  }, []);

  // Lock body scroll + handle Escape + focus trap while a modal is open.
  useEffect(() => {
    if (modal === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Defer so the element is mounted before we move focus to it.
    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    const FOCUSABLE =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const items = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !modalRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [modal, close]);

  return (
    <DownloadContext.Provider value={{ triggerDownload }}>
      {children}

      <AnimatePresence>
        {modal !== null && (
          <motion.div
            className="qr-overlay"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="presentation"
          >
            <motion.div
              ref={modalRef}
              className="qr-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-modal-title"
              aria-describedby="download-modal-subtitle"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
            >
              <button
                ref={closeBtnRef}
                className="qr-close"
                onClick={close}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>

              <Image
                src="/images/icons/bevy-logo.png"
                alt="Bevy"
                width={56}
                height={56}
                priority
              />

              {modal === "qr" ? (
                <>
                  <h3 id="download-modal-title" className="qr-title">
                    Scan to download Bevy
                  </h3>
                  <p
                    id="download-modal-subtitle"
                    className="qr-subtitle"
                  >
                    Point your phone camera at the QR code to open the App Store.
                  </p>
                  <div className="qr-code">
                    <Image
                      src="/images/qrs/qr-black.png"
                      alt="QR code to download Bevy"
                      width={200}
                      height={200}
                    />
                  </div>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qr-fallback"
                  >
                    Or{" "}
                    <span className="qr-fallback-link">open in browser</span>{" "}
                    &rarr;
                  </a>
                </>
              ) : (
                <>
                  <h3 id="download-modal-title" className="qr-title">
                    iPhone only, for now.
                  </h3>
                  <p
                    id="download-modal-subtitle"
                    className="qr-subtitle"
                  >
                    Bevy is currently only available on iPhone. If you have
                    one nearby, grab it from the App Store below.
                  </p>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="qr-fallback qr-fallback--primary"
                  >
                    Open the{" "}
                    <span className="qr-fallback-link">App Store listing</span>{" "}
                    &rarr;
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DownloadContext.Provider>
  );
}
