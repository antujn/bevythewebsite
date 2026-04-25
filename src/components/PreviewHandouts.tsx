"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Print-ready handouts tab inside the Previews modal.
 *
 * Renders two designs at their target print pixel dimensions:
 *
 *   1. Poster      — A4 portrait, 1240×1754 (good for print at ~75 dpi
 *                    or scaled up for shop windows). Big italic
 *                    "Truth or Dare. Reimagined." headline, huge cream
 *                    QR card in the middle, App Store badge below, plus
 *                    star-rating + handle in the footer.
 *
 *   2. Visiting    — US business-card 1050×600 (3.5″ × 2″ at 300 dpi).
 *      card         Logomark + brand line on the left half, QR card
 *                    with "SCAN TO PLAY" on the right half. Designed
 *                    to be handed across a counter and immediately
 *                    scanned.
 *
 * Both designs render at native pixel size in the DOM, then a parent
 * wrapper applies `transform: scale()` with `transform-origin: top left`
 * to fit the modal viewport while preserving the captured composition.
 *
 * Capture flow mirrors PreviewIcons / slide downloads:
 *   - dynamic import("modern-screenshot") -> domToCanvas at 2× scale
 *   - PNG export so business owners can drop the file straight into
 *     a printer or InDesign
 *   - Per-card "Download" button + parent-driven "Download All" signal
 *     (header button bumps the signal counter)
 *
 * QR encodes the App Store URL by reusing the existing
 * /images/qrs/qr-black-logo.png asset (the same one used by the
 * download modal), so no QR runtime dependency is added.
 */

const POSTER_WIDTH = 1240;
const POSTER_HEIGHT = 1754;
const CARD_WIDTH = 1050;
const CARD_HEIGHT = 600;

const QR_SRC = "/images/qrs/qr-black-logo.png";
const LOGO_SRC = "/images/icons/bevy-logo.png";
const APPSTORE_BADGE_SRC = "/images/icons/appstore-light.png";

const POSTER_FILENAME = "Bevy-Poster-A4.png";
const CARD_FILENAME = "Bevy-Visiting-Card.png";

/**
 * The marketing hook that fronts both designs. Short, declarative, all
 * caps — designed to land from across the room. Editing this single
 * string updates both the poster and visiting card. The brand couplet
 * ("Truth or Dare. Reimagined.") becomes the supporting subtitle.
 *
 * Pulled from the hooks sheet in projectBevy/marketing/planning;
 * "THE DRINKING GAME YOU ALWAYS WANTED" is the chosen variant for
 * bars/parties/hostels — substitute another hook from that sheet
 * (e.g. "THE PARTY GAME YOUR GROUP WILL TEXT ABOUT") if the venue
 * mix shifts toward cafes / co-working spaces / family settings.
 */
const POSTER_HOOK_LINES = [
  "THE DRINKING GAME",
  "YOU ALWAYS WANTED.",
];

/** Same hook stacked tighter for the smaller visiting card. */
const CARD_HOOK_LINES = ["THE DRINKING GAME", "YOU ALWAYS WANTED."];

type PreviewHandoutsProps = {
  /** Bumped by the parent (header) "Download All" button. */
  downloadAllSignal?: number;
  /** Lifted busy state so the parent can disable the trigger. */
  onDownloadStateChange?: (isDownloading: boolean) => void;
};

/**
 * Captures a fully-rendered DOM element to a PNG and triggers a
 * browser download. Mirrors the slide / icon export behaviour but
 * uses PNG (handouts go to print, JPEG would risk visible compression
 * on the cream QR card).
 */
async function downloadElementAsPng(
  element: HTMLElement,
  filename: string,
  width: number,
  height: number,
): Promise<void> {
  const { domToCanvas } = await import("modern-screenshot");

  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Make sure every embedded image (logo, QR, App Store badge) is
  // fully decoded before snapshotting. modern-screenshot inlines
  // images via base64 internally; an undecoded image becomes a
  // transparent box in the snapshot.
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );

  const canvas = await domToCanvas(element, {
    // 2× export multiplier — keeps text crisp on print.
    scale: 2,
    width,
    height,
    // Override the modal's `transform: scale()` so we capture at
    // native pixel size, not the scaled-down modal preview.
    style: {
      transform: "none",
      width: `${width}px`,
      height: `${height}px`,
    },
  });

  await new Promise<void>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        // Defer the revoke so Safari has time to start the download.
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        resolve();
      },
      "image/png",
      1,
    );
  });
}

/**
 * The poster artwork. Renders at exact print pixel dimensions.
 * All sizing is in pixels (not rem) so the screenshot is identical
 * regardless of the user's html font-size.
 */
function PosterArtwork() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background:
          "radial-gradient(120% 80% at 50% 0%, #2a0e10 0%, #100506 60%, #050202 100%)",
        color: "#f4eee5",
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: 80,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subtle ember glow behind the QR */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: 920,
          transform: "translate(-50%, -50%)",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 82, 58, 0.22) 0%, rgba(217, 82, 58, 0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Brand lockup */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_SRC}
          alt=""
          width={92}
          height={92}
          style={{ display: "block" }}
        />
        <span
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 64,
            color: "#f4eee5",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Bevy
        </span>
      </div>

      {/* HOOK — dominant headline, all caps, designed to land from
          across the room. Each line is its own block so the line
          break is intentional, not dependent on container width. */}
      <h1
        style={{
          marginTop: 60,
          margin: 0,
          paddingTop: 60,
          fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 0.96,
          letterSpacing: "-0.018em",
          textTransform: "uppercase",
          color: "#f4eee5",
          // Subtle ember underline accent created by the second line below.
        }}
      >
        {POSTER_HOOK_LINES.map((line, i) => (
          <span
            key={line}
            style={{
              display: "block",
              color: i === POSTER_HOOK_LINES.length - 1 ? "#e86848" : "#f4eee5",
            }}
          >
            {line}
          </span>
        ))}
      </h1>

      {/* Brand couplet demoted to subtitle in Playfair italic. */}
      <p
        style={{
          marginTop: 32,
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 56,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          color: "rgba(244, 238, 229, 0.8)",
          margin: 0,
          paddingTop: 32,
        }}
      >
        Truth or Dare. <span style={{ color: "#e86848" }}>Reimagined.</span>
      </p>

      {/* Sub-tagline — quick benefit beat. */}
      <p
        style={{
          marginTop: 22,
          fontSize: 24,
          fontWeight: 400,
          color: "rgba(244, 238, 229, 0.66)",
          letterSpacing: "0.02em",
          lineHeight: 1.5,
          maxWidth: 900,
        }}
      >
        1,000+ AI-curated cards across 11 themed bundles. Free on the App Store.
      </p>

      {/* QR card */}
      <div
        style={{
          marginTop: 64,
          alignSelf: "center",
          width: 720,
          background: "#f4eee5",
          borderRadius: 36,
          padding: "44px 44px 38px",
          boxShadow:
            "0 28px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={QR_SRC}
          alt=""
          width={560}
          height={560}
          style={{
            display: "block",
            width: 560,
            height: 560,
            imageRendering: "crisp-edges",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "#1a0808",
          }}
        >
          {/* Arrow pointing up to the QR */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a0808"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span
            style={{
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Scan to download
          </span>
        </div>
      </div>

      {/* Footer band — pinned at bottom */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 44,
          borderTop: "1px solid rgba(244, 238, 229, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={APPSTORE_BADGE_SRC}
            alt=""
            height={70}
            style={{ display: "block", height: 70, width: "auto" }}
          />
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 22,
            color: "rgba(244, 238, 229, 0.7)",
            lineHeight: 1.45,
          }}
        >
          <div style={{ color: "#e86848", fontSize: 24, letterSpacing: "0.1em" }}>
            ★★★★★
          </div>
          <div style={{ marginTop: 6, fontWeight: 600, color: "#f4eee5" }}>
            4.7 / 5 · 25,000+ downloads
          </div>
          <div style={{ marginTop: 4, fontSize: 18, color: "rgba(244, 238, 229, 0.55)" }}>
            @bevytheapp · bevythewebsite.vercel.app
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Visiting-card artwork at 1050×600 (US business card at ~300 dpi).
 * Two-column composition: brand on the left, QR on the right.
 */
function VisitingCardArtwork() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background:
          "linear-gradient(135deg, #1a0808 0%, #2a0e10 60%, #4a0f12 100%)",
        color: "#f4eee5",
        fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
      }}
    >
      {/* Subtle ember glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -120,
          top: -120,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 82, 58, 0.32) 0%, rgba(217, 82, 58, 0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT — hook + brand column */}
      <div
        style={{
          padding: "44px 38px 38px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt=""
            width={42}
            height={42}
            style={{ display: "block" }}
          />
          <span
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "#f4eee5",
            }}
          >
            Bevy
          </span>
        </div>

        <div>
          {/* HOOK — dominant headline, mirrors the poster. */}
          <h3
            style={{
              fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 0.96,
              letterSpacing: "-0.012em",
              textTransform: "uppercase",
              color: "#f4eee5",
              margin: 0,
            }}
          >
            {CARD_HOOK_LINES.map((line, i) => (
              <span
                key={line}
                style={{
                  display: "block",
                  color: i === CARD_HOOK_LINES.length - 1 ? "#e86848" : "#f4eee5",
                }}
              >
                {line}
              </span>
            ))}
          </h3>
          <p
            style={{
              marginTop: 14,
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 22,
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
              color: "rgba(244, 238, 229, 0.78)",
              margin: 0,
              paddingTop: 14,
            }}
          >
            Truth or Dare. <span style={{ color: "#e86848" }}>Reimagined.</span>
          </p>
        </div>

        <div
          style={{
            fontSize: 14,
            color: "rgba(244, 238, 229, 0.6)",
            lineHeight: 1.55,
          }}
        >
          <div style={{ color: "#e86848", letterSpacing: "0.12em" }}>★★★★★ 4.7 / 5</div>
          <div style={{ marginTop: 4, color: "rgba(244, 238, 229, 0.78)" }}>
            @bevytheapp · bevythewebsite.vercel.app
          </div>
        </div>
      </div>

      {/* RIGHT — QR column */}
      <div
        style={{
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "#f4eee5",
            borderRadius: 22,
            padding: 20,
            boxShadow:
              "0 18px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={QR_SRC}
            alt=""
            width={300}
            height={300}
            style={{
              display: "block",
              width: 300,
              height: 300,
              imageRendering: "crisp-edges",
            }}
          />
        </div>
        <p
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#f4eee5",
            textAlign: "center",
          }}
        >
          Scan to play
        </p>
      </div>
    </div>
  );
}

export default function PreviewHandouts({
  downloadAllSignal,
  onDownloadStateChange,
}: PreviewHandoutsProps) {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const posterStageRef = useRef<HTMLDivElement | null>(null);
  const cardStageRef = useRef<HTMLDivElement | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const lastDownloadAllSignalRef = useRef<number | null>(null);

  // Drive a CSS scale on the inline art element so it always fits the
  // stage's measured width. This lets the stage be CSS-sized via
  // aspect-ratio + max-width, while the art keeps its native pixel
  // dimensions for a clean modern-screenshot capture.
  useEffect(() => {
    const apply = (
      stage: HTMLDivElement | null,
      art: HTMLDivElement | null,
      naturalWidth: number,
    ) => {
      if (!stage || !art) return;
      const stageWidth = stage.clientWidth;
      if (stageWidth <= 0) return;
      const scale = stageWidth / naturalWidth;
      art.style.transform = `scale(${scale})`;
    };

    const update = () => {
      apply(posterStageRef.current, posterRef.current, POSTER_WIDTH);
      apply(cardStageRef.current, cardRef.current, CARD_WIDTH);
    };

    update();

    const ro = new ResizeObserver(update);
    if (posterStageRef.current) ro.observe(posterStageRef.current);
    if (cardStageRef.current) ro.observe(cardStageRef.current);
    return () => ro.disconnect();
  }, []);

  const reportBusy = useCallback(
    (busy: boolean) => {
      onDownloadStateChange?.(busy);
    },
    [onDownloadStateChange],
  );

  const handleDownloadPoster = useCallback(async () => {
    if (!posterRef.current || downloadingId !== null) return;
    setDownloadingId("poster");
    reportBusy(true);
    try {
      await downloadElementAsPng(
        posterRef.current,
        POSTER_FILENAME,
        POSTER_WIDTH,
        POSTER_HEIGHT,
      );
    } catch (err) {
      console.error("Failed to download poster", err);
    } finally {
      setDownloadingId(null);
      reportBusy(false);
    }
  }, [downloadingId, reportBusy]);

  const handleDownloadCard = useCallback(async () => {
    if (!cardRef.current || downloadingId !== null) return;
    setDownloadingId("card");
    reportBusy(true);
    try {
      await downloadElementAsPng(
        cardRef.current,
        CARD_FILENAME,
        CARD_WIDTH,
        CARD_HEIGHT,
      );
    } catch (err) {
      console.error("Failed to download visiting card", err);
    } finally {
      setDownloadingId(null);
      reportBusy(false);
    }
  }, [downloadingId, reportBusy]);

  const handleDownloadAll = useCallback(async () => {
    if (!posterRef.current || !cardRef.current || isDownloadingAll) return;
    setIsDownloadingAll(true);
    reportBusy(true);
    try {
      await downloadElementAsPng(
        posterRef.current,
        POSTER_FILENAME,
        POSTER_WIDTH,
        POSTER_HEIGHT,
      );
      // Small pause helps Safari surface the second download instead
      // of merging both into a single permission prompt.
      await new Promise((resolve) => setTimeout(resolve, 220));
      await downloadElementAsPng(
        cardRef.current,
        CARD_FILENAME,
        CARD_WIDTH,
        CARD_HEIGHT,
      );
    } catch (err) {
      console.error("Failed to download handouts", err);
    } finally {
      setIsDownloadingAll(false);
      reportBusy(false);
    }
  }, [isDownloadingAll, reportBusy]);

  // React to the parent's "Download All" button.
  useEffect(() => {
    if (downloadAllSignal == null) return;
    if (lastDownloadAllSignalRef.current === null) {
      lastDownloadAllSignalRef.current = downloadAllSignal;
      return;
    }
    if (lastDownloadAllSignalRef.current === downloadAllSignal) return;
    lastDownloadAllSignalRef.current = downloadAllSignal;
    void handleDownloadAll();
  }, [downloadAllSignal, handleDownloadAll]);

  const isBusy = downloadingId !== null || isDownloadingAll;

  return (
    <div className="preview-handouts-wrap">
      <div className="preview-handouts-grid">
        {/* POSTER */}
        <figure className="preview-handout-card">
          <div
            ref={posterStageRef}
            className="preview-handout-stage preview-handout-stage--poster"
          >
            <div
              ref={posterRef}
              className="preview-handout-art"
              style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
            >
              <PosterArtwork />
            </div>
          </div>
          <figcaption className="preview-handout-meta">
            <div className="preview-handout-meta__info">
              <p className="preview-handout-meta__title">Poster</p>
              <p className="preview-handout-meta__detail">
                A4 portrait · for shop windows, walls, counters
              </p>
            </div>
            <button
              type="button"
              className="preview-handout-download-btn"
              onClick={handleDownloadPoster}
              disabled={isBusy}
              aria-label="Download poster as PNG"
            >
              {downloadingId === "poster" ? "..." : "Download"}
            </button>
          </figcaption>
        </figure>

        {/* VISITING CARD */}
        <figure className="preview-handout-card">
          <div
            ref={cardStageRef}
            className="preview-handout-stage preview-handout-stage--vcard"
          >
            <div
              ref={cardRef}
              className="preview-handout-art"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <VisitingCardArtwork />
            </div>
          </div>
          <figcaption className="preview-handout-meta">
            <div className="preview-handout-meta__info">
              <p className="preview-handout-meta__title">Visiting card</p>
              <p className="preview-handout-meta__detail">
                3.5″ × 2″ · hand to customers, leave at counters
              </p>
            </div>
            <button
              type="button"
              className="preview-handout-download-btn"
              onClick={handleDownloadCard}
              disabled={isBusy}
              aria-label="Download visiting card as PNG"
            >
              {downloadingId === "card" ? "..." : "Download"}
            </button>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
