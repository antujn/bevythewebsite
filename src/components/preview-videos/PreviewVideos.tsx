"use client";

// Sub-tab switcher inside the Previews modal's "Videos" tab. Renders one
// of the three full-page preview Stages at a time. We unmount the other
// two so their RAF loops + <video> elements don't burn cycles in the
// background while a single one is on screen.

// The control row also exposes fullscreen so users can record their
// screen with their preferred system/browser recorder.

import { useCallback, useEffect, useRef, useState } from "react";
import AppPreview30s from "./AppPreview30s";
import AppPreview50s from "./AppPreview50s";
import CinematicTrailer90s from "./CinematicTrailer90s";
import type { StageHandle } from "./animations";

export type VideoKey = "30s" | "50s" | "90s";

export const VIDEO_TABS: { key: VideoKey; label: string; sublabel: string }[] = [
  { key: "30s", label: "30s", sublabel: "App Store" },
  { key: "50s", label: "50s", sublabel: "App Store" },
  { key: "90s", label: "90s", sublabel: "Cinematic" },
];

type PreviewVideosProps = {
  active: VideoKey;
  onActiveChange: (next: VideoKey) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  fullscreenToggleSignal?: number;
  showControls?: boolean;
};

export default function PreviewVideos({
  active,
  onActiveChange,
  onFullscreenChange,
  fullscreenToggleSignal,
  showControls = true,
}: PreviewVideosProps) {
  const stageRef = useRef<StageHandle>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const lastToggleSignalRef = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = useCallback(async () => {
    const wrap = stageWrapRef.current;
    if (!wrap) return;

    try {
      if (document.fullscreenElement === wrap) {
        await document.exitFullscreen();
        return;
      }

      if (typeof wrap.requestFullscreen === "function") {
        await wrap.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle failed", err);
    }
  }, []);

  useEffect(() => {
    const syncFullscreenState = () => {
      const el = stageWrapRef.current;
      const next = Boolean(el && document.fullscreenElement === el);
      setIsFullscreen(next);
      onFullscreenChange?.(next);
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, [onFullscreenChange]);

  useEffect(() => {
    if (fullscreenToggleSignal == null) return;
    if (lastToggleSignalRef.current == null) {
      // Seed from initial prop so mounting the Videos tab does not
      // trigger fullscreen automatically.
      lastToggleSignalRef.current = fullscreenToggleSignal;
      return;
    }
    if (lastToggleSignalRef.current === fullscreenToggleSignal) return;
    lastToggleSignalRef.current = fullscreenToggleSignal;
    void handleFullscreenToggle();
  }, [fullscreenToggleSignal, handleFullscreenToggle]);

  return (
    <div className="preview-videos-wrap">
      {showControls && (
        <div className="preview-video-controls">
          <div
            className="preview-video-subtabs"
            role="tablist"
            aria-label="Video duration"
          >
            {VIDEO_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active === t.key}
                className={`preview-video-subtab ${active === t.key ? "is-active" : ""}`}
                onClick={() => onActiveChange(t.key)}
              >
                <span className="preview-video-subtab__label">{t.label}</span>
                <span className="preview-video-subtab__sublabel">
                  {t.sublabel}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="preview-video-fullscreen-btn"
            onClick={handleFullscreenToggle}
            aria-label={
              isFullscreen
                ? "Exit fullscreen preview"
                : "Enter fullscreen preview"
            }
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              aria-hidden="true"
              focusable="false"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9V4h5" />
              <path d="M20 9V4h-5" />
              <path d="M4 15v5h5" />
              <path d="M20 15v5h-5" />
            </svg>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      )}

      <div ref={stageWrapRef} className="preview-video-stage">
        {active === "30s" && <AppPreview30s ref={stageRef} />}
        {active === "50s" && <AppPreview50s ref={stageRef} />}
        {active === "90s" && <CinematicTrailer90s ref={stageRef} />}
      </div>
    </div>
  );
}
