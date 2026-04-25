"use client";

// Shared visual primitives reused across the App Store preview "videos"
// (30s + 50s) and the longer cinematic trailer. Centralizing the brand
// palette + the phone frame here keeps the per-preview files focused on
// scene composition and prevents the trio drifting apart visually.

import { type ReactNode, useEffect, useRef } from "react";
import { useSprite, useTimeline } from "./animations";

export const BEVY = {
  red: "#C91921",
  redDeep: "#7A1520",
  oxblood: "#4A0A10",
  ink: "#0A0406",
  cream: "#F1EFEB",
  white: "#FFFFFF",
  dim: "#C8B8BB",
} as const;

export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS = "'Plus Jakarta Sans', system-ui, sans-serif";

// Real curly quote / typographic glyphs — declared once so scene copy
// stays exactly what the original HTML drafts had.
export const LDQUO = "\u201C";
export const RDQUO = "\u201D";
export const RSQUO = "\u2019";
export const BULLET = "\u00B7";

// Asset paths inside /public. The original HTML referenced
// claude_design/uploads/* — these point at the existing site assets so
// the previews keep working after that scratch folder is deleted.
export const BEVY_LOGO_SRC = "/images/icons/bevy-logo.png";
export const IPHONE_MOCKUP_SRC = "/images/mockups/iphone-17-pro-mockup.png";
export const BG_SRC = (n: number) =>
  `/images/previews/backgrounds/background${n}.jpeg`;

// ── Logo ───────────────────────────────────────────────────────────────────
export function BevyLogo({
  size = 200,
  drop = true,
}: {
  size?: number;
  drop?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={BEVY_LOGO_SRC}
      alt="Bevy"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        display: "block",
        filter: drop
          ? "drop-shadow(0 12px 30px rgba(0,0,0,0.55))"
          : "none",
      }}
    />
  );
}

// ── iPhone frame using the Pro mockup PNG ──────────────────────────────────
// Children fill the screen area; the PNG bezel sits on top to expose the
// notch/dynamic-island silhouette. Width controls the visible size; height
// is derived from the iPhone Pro 19.5:9 aspect ratio.
export function IPhoneFrame({
  width = 760,
  children,
}: {
  width?: number;
  children?: ReactNode;
}) {
  const height = width * 2.17;
  const inset = width * 0.04;
  const radius = width * 0.12;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        filter:
          "drop-shadow(0 40px 80px rgba(0,0,0,0.6)) drop-shadow(0 12px 24px rgba(0,0,0,0.35))",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: inset,
          right: inset,
          top: inset,
          bottom: inset,
          borderRadius: radius,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {children}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IPHONE_MOCKUP_SRC}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}

// ── Minimal CSS-only phone frame ───────────────────────────────────────────
// Used by the cinematic trailer where we want a generic-looking phone
// without the iPhone-specific bezel, so any aspect-ratio video sits cleanly
// inside it. The video element is driven by the timeline so scrubbing the
// stage also scrubs the embedded clip.
export function PhoneFrame({
  width = 720,
  videoSrc,
  noLoop = false,
  children,
}: {
  width?: number;
  videoSrc?: string;
  noLoop?: boolean;
  children?: ReactNode;
}) {
  const height = width * 2.17;
  const bezel = width * 0.028;
  const radius = width * 0.11;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { localTime } = useSprite();
  const { time, recording } = useTimeline();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    if (!recording) void v.play().catch(() => {});
    return () => {
      v.pause();
    };
    // Run on mount only; the recording-aware sync effect below handles
    // subsequent state. videoRef is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause the embedded clip when the recorder takes over so the only
  // thing advancing currentTime is our explicit per-frame seeks.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (recording) {
      v.pause();
    } else {
      void v.play().catch(() => {});
    }
  }, [recording]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const target = noLoop
      ? Math.min(localTime, v.duration - 0.05)
      : localTime % v.duration;
    // During recording we need a sub-frame seek every step (the
    // recorder advances time by 1/60s, well below the normal 0.4s
    // tolerance). Without this the video would freeze for ~24 frames
    // at a stretch in the encoded output.
    const threshold = recording ? 0 : 0.4;
    if (Math.abs(v.currentTime - target) > threshold) {
      v.currentTime = target;
    }
  }, [time, localTime, noLoop, recording]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        padding: bezel,
        background:
          "linear-gradient(145deg, #2a1b1e 0%, #0a0608 40%, #1a0f12 100%)",
        borderRadius: radius + bezel,
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      >
        {videoSrc && (
          <video
            ref={videoRef}
            muted
            playsInline
            {...(noLoop ? {} : { loop: true })}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        {children}
        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: width * 0.018,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.33,
            height: width * 0.048,
            background: "#000",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

// ── Cinematic-trailer-only effects (Ken Burns + grain + vignette) ──────────
// These were defined inline in the 90s HTML; lifting them out lets us
// keep the per-scene file focused on layout + copy.
export function KenBurns({
  src,
  from = 1.1,
  to = 1.22,
  drift = [0, 0],
  duration,
  filter,
}: {
  src: string;
  from?: number;
  to?: number;
  drift?: [number, number];
  duration?: number;
  filter?: string;
}) {
  const { localTime } = useSprite();
  const d = duration || 5;
  const p = Math.min(1, localTime / d);
  const scale = from + (to - from) * p;
  const dx = drift[0] * p;
  const dy = drift[1] * p;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${dx}%, ${dy}%)`,
          transformOrigin: "center",
          filter: filter || "none",
          willChange: "transform",
        }}
      />
    </div>
  );
}

export function Grain({ opacity = 0.12 }: { opacity?: number }) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
      }}
    >
      <filter id="bevy-grain-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 0 0.9  0 0 0 1 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#bevy-grain-noise)" />
    </svg>
  );
}

export function Vignette() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(120% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%), linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 18%, transparent 75%, rgba(0,0,0,0.5) 100%)`,
      }}
    />
  );
}
