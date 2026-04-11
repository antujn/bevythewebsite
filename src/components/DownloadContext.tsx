"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Image from "next/image";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490";

const DownloadContext = createContext<{ triggerDownload: () => void }>({
  triggerDownload: () => {},
});

export function useDownload() {
  return useContext(DownloadContext);
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function DownloadProvider({ children }: { children: ReactNode }) {
  const [showQR, setShowQR] = useState(false);

  const triggerDownload = useCallback(() => {
    if (isMobileDevice()) {
      window.open(APP_STORE_URL, "_blank");
    } else {
      setShowQR(true);
    }
  }, []);

  return (
    <DownloadContext.Provider value={{ triggerDownload }}>
      {children}

      {/* QR Overlay */}
      {showQR && (
        <div
          className="qr-overlay"
          onClick={() => setShowQR(false)}
        >
          <div
            className="qr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="qr-close"
              onClick={() => setShowQR(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <Image
              src="/images/icons/bevy-logo.png"
              alt="Bevy"
              width={56}
              height={56}
            />
            <h3 className="qr-title">Scan to download Bevy</h3>
            <p className="qr-subtitle">
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
              Or <span className="qr-fallback-link">open in browser</span> &rarr;
            </a>
          </div>
        </div>
      )}
    </DownloadContext.Provider>
  );
}
