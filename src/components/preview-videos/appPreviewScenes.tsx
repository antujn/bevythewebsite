"use client";

// Scenes shared between the 30s and 50s App Store previews. Both files
// open with a logo reveal, share the same "best nights" headline beat,
// then run identical Finger / Alias / AI chat showcases. They diverge
// at the proof + CTA tail (50s adds review screens and a download
// pill), which is captured here via opt-in props rather than two
// near-identical scene files.

import { type ReactNode, useEffect, useRef } from "react";
import {
  Easing,
  interpolate,
  Sprite,
  useSprite,
  useTimeline,
} from "./animations";
import {
  BEVY,
  BEVY_LOGO_SRC,
  BULLET,
  BevyLogo,
  IPhoneFrame,
  LDQUO,
  RDQUO,
  RSQUO,
  SANS,
  SERIF,
} from "./bevyShared";

// ── Scene 1 — Logo reveal ──────────────────────────────────────────────────
// `showReviewChip` matches the 50s variant which surfaces App Store
// social proof (★★★★★ 4.7 · 25K+ downloads) at the bottom of the logo
// scene. The 30s variant doesn't show this row.
export function SceneLogo({
  showReviewChip = false,
}: {
  showReviewChip?: boolean;
}) {
  const { progress, localTime } = useSprite();

  const markScale = interpolate([0, 0.25], [0.55, 1.0], Easing.easeOutCubic)(
    progress,
  );
  const markOp = interpolate([0, 0.15], [0, 1], Easing.linear)(progress);

  const wordOp = interpolate([0.18, 0.35], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const wordY = interpolate([0.18, 0.35], [40, 0], Easing.easeOutCubic)(
    progress,
  );

  const dividerScale = interpolate(
    [0.3, 0.45],
    [0, 1],
    Easing.easeOutCubic,
  )(progress);
  const dividerOp = interpolate(
    [0.3, 0.45],
    [0, 1],
    Easing.easeOutCubic,
  )(progress);

  const tagOp = interpolate([0.38, 0.55], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const tagY = interpolate([0.38, 0.55], [30, 0], Easing.easeOutCubic)(
    progress,
  );

  const proofOp = interpolate([0.5, 0.68], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const proofY = interpolate([0.5, 0.68], [20, 0], Easing.easeOutCubic)(
    progress,
  );

  const sceneOp = interpolate(
    [0, 0.06, 0.95, 1],
    [0, 1, 1, 0],
    Easing.linear,
  )(progress);
  const shimmerRot = localTime * 22;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(120% 80% at 50% 42%, ${BEVY.oxblood} 0%, ${BEVY.ink} 70%, #000 100%)`,
        opacity: sceneOp,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -58%) rotate(${shimmerRot}deg)`,
          background: `conic-gradient(from 0deg, rgba(201,25,33,0.28) 0%, transparent 25%, rgba(201,25,33,0.18) 55%, transparent 80%)`,
          filter: "blur(80px)",
          opacity: markOp * 0.9,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -58%)",
          background: `radial-gradient(circle, ${BEVY.red}55 0%, transparent 55%)`,
          filter: "blur(60px)",
          opacity: markOp * 0.6,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          transform: `scale(${markScale})`,
          transformOrigin: "center",
          opacity: markOp,
          marginBottom: 60,
        }}
      >
        <BevyLogo size={520} />
      </div>

      <div
        style={{
          opacity: wordOp,
          transform: `translateY(${wordY}px)`,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 220,
          fontWeight: 500,
          color: BEVY.cream,
          letterSpacing: "-0.025em",
          lineHeight: 0.95,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        Bevy
      </div>

      <div
        style={{
          marginTop: 46,
          display: "flex",
          alignItems: "center",
          gap: 24,
          transform: `scaleX(${dividerScale})`,
          transformOrigin: "center",
          opacity: dividerOp,
        }}
      >
        <div
          style={{
            width: 220,
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${BEVY.red} 80%, ${BEVY.red})`,
          }}
        />
        <div
          style={{
            width: 14,
            height: 14,
            background: BEVY.red,
            transform: "rotate(45deg)",
            boxShadow: `0 0 20px ${BEVY.red}`,
          }}
        />
        <div
          style={{
            width: 220,
            height: 1.5,
            background: `linear-gradient(270deg, transparent, ${BEVY.red} 80%, ${BEVY.red})`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 52,
          opacity: tagOp,
          transform: `translateY(${tagY}px)`,
          fontFamily: SANS,
          fontSize: 54,
          fontWeight: 400,
          color: BEVY.cream,
          letterSpacing: "-0.015em",
          textAlign: "center",
          lineHeight: 1.22,
          maxWidth: 1020,
          padding: "0 60px",
        }}
      >
        The modern, meaningful alternative
        <br />
        to traditional{" "}
        <em
          style={{
            color: BEVY.red,
            fontFamily: SERIF,
            fontWeight: 500,
          }}
        >
          truth or dare
        </em>{" "}
        games.
      </div>

      {showReviewChip && (
        <div
          style={{
            position: "absolute",
            bottom: 260,
            opacity: proofOp,
            transform: `translateY(${proofY}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 34px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 999,
            backdropFilter: "blur(14px)",
          }}
        >
          <span
            style={{
              color: BEVY.red,
              fontSize: 28,
              letterSpacing: "0.1em",
            }}
          >
            ★★★★★
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 28,
              fontWeight: 700,
              color: BEVY.cream,
              letterSpacing: "-0.005em",
            }}
          >
            4.7
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: BEVY.dim,
              opacity: 0.6,
            }}
          />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 24,
              fontWeight: 500,
              color: BEVY.dim,
              letterSpacing: "0.02em",
            }}
          >
            25K+ downloads on the App Store
          </span>
        </div>
      )}
    </div>
  );
}

// ── Scene 2 — Headline (word-by-word reveal) ──────────────────────────────
export function SceneHeadline() {
  const { localTime, duration } = useSprite();

  const line1 = ["The", "best", "nights"];
  const line2 = [`aren${RSQUO}t`, "planned."];
  const line3 = [`They${RSQUO}re`, "felt."];
  const wordStagger = 0.12;

  const words = [
    ...line1.map((w) => ({ w, line: 0, highlight: false })),
    ...line2.map((w) => ({ w, line: 1, highlight: false })),
    ...line3.map((w) => ({ w, line: 2, highlight: true })),
  ];

  const exitStart = duration - 0.5;
  const exitOp =
    localTime > exitStart
      ? interpolate([exitStart, duration], [1, 0])(localTime)
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${BEVY.ink} 0%, ${BEVY.oxblood} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        opacity: exitOp,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 148,
          fontWeight: 500,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          textAlign: "center",
          color: BEVY.cream,
        }}
      >
        {[0, 1, 2].map((lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0 32px",
              marginTop: lineIdx === 0 ? 0 : 10,
            }}
          >
            {words
              .filter((x) => x.line === lineIdx)
              .map((x, i) => {
                const globalIdx = words.findIndex((y) => y === x);
                const start = globalIdx * wordStagger;
                const op = interpolate(
                  [start, start + 0.3],
                  [0, 1],
                  Easing.easeOutCubic,
                )(localTime);
                const y = interpolate(
                  [start, start + 0.4],
                  [24, 0],
                  Easing.easeOutCubic,
                )(localTime);
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      opacity: op,
                      transform: `translateY(${y}px)`,
                      color: x.highlight ? BEVY.red : BEVY.cream,
                      fontStyle: x.highlight ? "italic" : "normal",
                      paddingRight: x.highlight ? 12 : 0,
                    }}
                  >
                    {x.w}
                  </span>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Generic video showcase used for Finger / Alias / AI Chat ──────────────
type CalloutSpec = {
  start: number;
  end: number;
  kind: "top" | "bottom";
  eyebrow: string;
  label: string;
};

type VideoSource = { src: string; type: string };

function VideoShowcase({
  chip,
  videoSources,
  callouts,
  footer,
  noLoop = false,
}: {
  chip: string;
  videoSources: VideoSource[];
  callouts: CalloutSpec[];
  footer?: string;
  noLoop?: boolean;
}) {
  const { localTime, duration } = useSprite();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { time, recording } = useTimeline();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    if (!recording) void v.play().catch(() => {});
    return () => {
      v.pause();
    };
    // Mount-only; the recording-aware effect below handles play/pause.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While recording, the recorder is the only thing that should
  // advance currentTime. Pause natural playback so it doesn't race
  // our per-frame seeks.
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
    // Recording demands a frame-accurate seek every 1/60s; the normal
    // 0.4s tolerance is built for rAF playback where micro-jitter on
    // currentTime would cause stutter.
    const threshold = recording ? 0 : 0.4;
    if (noLoop) {
      const last = Math.max(0, v.duration - 0.05);
      const target = Math.min(localTime, last);
      if (Math.abs(v.currentTime - target) > threshold) v.currentTime = target;
    } else {
      const target = localTime % v.duration;
      if (Math.abs(v.currentTime - target) > threshold) v.currentTime = target;
    }
  }, [time, localTime, noLoop, recording]);

  const phoneIn = interpolate([0, 1.1], [0, 1], Easing.easeOutCubic)(
    localTime,
  );
  const phoneY = (1 - phoneIn) * 180;

  const exitStart = duration - 0.6;
  const exitT =
    localTime > exitStart
      ? interpolate([exitStart, duration], [0, 1])(localTime)
      : 0;
  const exitScale = 1 - exitT * 0.06;
  const exitOp = 1 - exitT;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(140% 100% at 50% 0%, ${BEVY.oxblood} 0%, ${BEVY.ink} 55%, #000 100%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -160,
          top: -140,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BEVY_LOGO_SRC}
          alt=""
          style={{ width: 780, height: 780 }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 150,
          left: "50%",
          transform: `translateX(-50%) translateY(${(1 - phoneIn) * -40}px)`,
          opacity: phoneIn * exitOp,
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 34px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999,
          backdropFilter: "blur(14px)",
          fontFamily: SANS,
          fontSize: 28,
          fontWeight: 700,
          color: BEVY.cream,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            background: BEVY.red,
            boxShadow: `0 0 20px ${BEVY.red}`,
          }}
        />
        {chip}
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${phoneY}px)) scale(${exitScale})`,
          opacity: phoneIn * exitOp,
        }}
      >
        <IPhoneFrame width={820}>
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
            {videoSources.map((s, i) => (
              <source key={i} src={s.src} type={s.type} />
            ))}
          </video>
        </IPhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 480,
          background:
            "linear-gradient(180deg, rgba(10,3,5,0.92) 0%, rgba(10,3,5,0.55) 55%, rgba(10,3,5,0) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 560,
          background:
            "linear-gradient(0deg, rgba(10,3,5,0.95) 0%, rgba(10,3,5,0.7) 45%, rgba(10,3,5,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {callouts.map((c, i) => (
        <Callout key={i} {...c} />
      ))}

      {footer && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 180,
            textAlign: "center",
            opacity: phoneIn * exitOp,
            fontFamily: SANS,
            fontSize: 24,
            fontWeight: 600,
            color: BEVY.cream,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "0 60px",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function Callout({ start, end, kind, eyebrow, label }: CalloutSpec) {
  const { localTime } = useSprite();
  if (localTime < start - 0.1 || localTime > end + 0.1) return null;

  const t = localTime - start;
  const dur = end - start;
  const entry = Math.min(1, t / 0.45);
  const exit = Math.max(0, (t - (dur - 0.45)) / 0.45);
  const e = Easing.easeOutCubic(entry);
  const op = Math.min(1, entry) * (1 - Math.min(1, exit));
  const y = (1 - e) * (kind === "top" ? -30 : 30);

  const pos =
    kind === "top"
      ? { top: 260, alignItems: "center" as const, textAlign: "center" as const }
      : { bottom: 280, alignItems: "center" as const, textAlign: "center" as const };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        ...pos,
        opacity: op,
        transform: `translateY(${y}px)`,
        willChange: "transform,opacity",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 26,
          fontWeight: 700,
          color: BEVY.red,
          letterSpacing: "0.28em",
          marginBottom: 22,
          textTransform: "uppercase",
          textShadow: "0 2px 20px rgba(0,0,0,0.8)",
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 76,
          fontWeight: 500,
          color: BEVY.cream,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          whiteSpace: "pre-line",
          textShadow: "0 4px 30px rgba(0,0,0,0.85)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── Concrete showcase scenes ───────────────────────────────────────────────
// Each one wires the generic VideoShowcase to a specific clip + callouts.
// MP4 is listed first because Safari ignores the WebM fallback when both
// are present, and MP4 is the format we ship in /public/videos.

export function SceneFingerGame() {
  return (
    <VideoShowcase
      chip="Finger Game"
      videoSources={[
        {
          src: "/videos/finger-mode-significant-other.mp4",
          type: "video/mp4",
        },
        {
          src: "/videos/finger-mode-significant-other.webm",
          type: "video/webm",
        },
      ]}
      callouts={[
        {
          start: 1.5,
          end: 5.0,
          kind: "top",
          eyebrow: "PLACE YOUR FINGERS",
          label: `Bevy picks who${RSQUO}s next.`,
        },
        {
          start: 5.3,
          end: 8.3,
          kind: "bottom",
          eyebrow: "MADE FOR THE ROOM",
          label: "Momentum, suspense,\nzero setup.",
        },
        {
          start: 8.5,
          end: 10.7,
          kind: "bottom",
          eyebrow: "FOR REAL GROUPS",
          label: "Designed for\nin-person play.",
        },
      ]}
      footer={`Quick start ${BULLET} Team energy ${BULLET} In-person play`}
    />
  );
}

export function SceneAliasMode() {
  return (
    <VideoShowcase
      chip="Alias Mode"
      noLoop
      videoSources={[
        {
          src: "/videos/alias-mode-significant-other.mp4",
          type: "video/mp4",
        },
        {
          src: "/videos/alias-mode-significant-other.webm",
          type: "video/webm",
        },
      ]}
      callouts={[
        {
          start: 1.2,
          end: 4.6,
          kind: "top",
          eyebrow: "TEN CURATED BUNDLES",
          label: "A different energy\nfor every night.",
        },
        {
          start: 4.9,
          end: 7.7,
          kind: "bottom",
          eyebrow: "HAND-WRITTEN CARDS",
          label: "1000+ prompts.\nZero recycled clich\u00E9s.",
        },
      ]}
      footer={`Significant Other ${BULLET} Early Dating ${BULLET} NSFW`}
    />
  );
}

export function SceneAIChat() {
  return (
    <VideoShowcase
      chip="BevyAI Chat"
      videoSources={[
        {
          src: "/videos/ai-chat-significant-other.mp4",
          type: "video/mp4",
        },
        {
          src: "/videos/ai-chat-significant-other.webm",
          type: "video/webm",
        },
      ]}
      callouts={[
        {
          start: 1.2,
          end: 4.4,
          kind: "top",
          eyebrow: "POWERED BY BEVYAI",
          label: "Thoughtful answers,\none tap away.",
        },
        {
          start: 4.7,
          end: 7.5,
          kind: "bottom",
          eyebrow: "PLAY SOLO OR TOGETHER",
          label: "Your partner\nwhen nobody else is.",
        },
      ]}
      footer={`No signup ${BULLET} Private by default`}
    />
  );
}

// ── Scene — Social proof grid (used by 30s) ────────────────────────────────
export function SceneProof() {
  const { localTime, duration } = useSprite();

  const titleOp = interpolate(
    [0, 0.4, duration - 0.4, duration],
    [0, 1, 1, 0],
    Easing.easeOutCubic,
  )(localTime);
  const titleY = interpolate([0, 0.5], [30, 0], Easing.easeOutCubic)(
    localTime,
  );

  const rating = interpolate([0.2, 1.2], [0, 4.7], Easing.easeOutCubic)(
    localTime,
  );

  const reviews = [
    {
      author: "DukeNeuk",
      text: "The prompts are hilarious and really help to break the ice in a crowd.",
    },
    {
      author: "AnthonyJane24",
      text: "A fantastic way to get to know your partner better.",
    },
    {
      author: "Niece.doll",
      text: "The questions are unique and help you get more than one-word answers.",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${BEVY.ink} 0%, ${BEVY.oxblood} 100%)`,
        padding: "180px 90px 160px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 24,
            fontWeight: 700,
            color: BEVY.red,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          Join 25K+ players
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 44,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 280,
              fontWeight: 600,
              color: BEVY.cream,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rating.toFixed(1)}
          </div>
          <div style={{ paddingBottom: 44 }}>
            <div
              style={{
                color: BEVY.red,
                fontSize: 56,
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              ★★★★★
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 28,
                fontWeight: 500,
                color: BEVY.dim,
                marginTop: 18,
                lineHeight: 1.35,
              }}
            >
              out of 5 {BULLET} App Store
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontSize: 76,
            fontWeight: 500,
            fontStyle: "italic",
            color: BEVY.cream,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 70,
            maxWidth: 900,
          }}
        >
          From real players
          <br />
          and real game nights.
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", gap: 28 }}
      >
        {reviews.map((r, i) => {
          const fs = 0.7 + i * 0.18;
          const op = interpolate(
            [fs, fs + 0.4],
            [0, 1],
            Easing.easeOutCubic,
          )(localTime);
          const y = interpolate(
            [fs, fs + 0.5],
            [30, 0],
            Easing.easeOutCubic,
          )(localTime);
          const exit = interpolate(
            [duration - 0.4, duration],
            [1, 0],
          )(localTime);
          return (
            <div
              key={i}
              style={{
                opacity: op * exit,
                transform: `translateY(${y}px)`,
                padding: "34px 38px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 26,
              }}
            >
              <div
                style={{
                  color: BEVY.red,
                  fontSize: 22,
                  letterSpacing: "0.08em",
                  marginBottom: 14,
                }}
              >
                ★★★★★
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 34,
                  fontWeight: 500,
                  color: BEVY.cream,
                  lineHeight: 1.3,
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                {LDQUO}
                {r.text}
                {RDQUO}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 20,
                  fontWeight: 600,
                  color: BEVY.dim,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                — {r.author}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reviews split (used by 50s) ────────────────────────────────────────────
// 50s replaces the 30s "review grid" with a big editorial intro and three
// individual review screens. We expose them as separate scenes so the 50s
// Master can place them on its own timing.

export function SceneProofIntro() {
  const { localTime, duration } = useSprite();
  const titleOp = interpolate(
    [0, 0.4, duration - 0.3, duration],
    [0, 1, 1, 0],
    Easing.easeOutCubic,
  )(localTime);
  const titleY = interpolate([0, 0.5], [30, 0], Easing.easeOutCubic)(
    localTime,
  );
  const rating = interpolate([0.2, 1.3], [0, 4.7], Easing.easeOutCubic)(
    localTime,
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${BEVY.ink} 0%, ${BEVY.oxblood} 100%)`,
        padding: "0 90px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        opacity: titleOp,
      }}
    >
      <div style={{ transform: `translateY(${titleY}px)` }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
            fontWeight: 700,
            color: BEVY.red,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Join 25K+ players
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 50,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 340,
              fontWeight: 600,
              color: BEVY.cream,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {rating.toFixed(1)}
          </div>
          <div style={{ paddingBottom: 50 }}>
            <div
              style={{
                color: BEVY.red,
                fontSize: 64,
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              ★★★★★
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 30,
                fontWeight: 500,
                color: BEVY.dim,
                marginTop: 22,
                lineHeight: 1.35,
              }}
            >
              out of 5 {BULLET} App Store
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontSize: 88,
            fontWeight: 500,
            fontStyle: "italic",
            color: BEVY.cream,
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            maxWidth: 950,
          }}
        >
          From real players
          <br />
          and real game nights.
        </div>
      </div>
    </div>
  );
}

export function ReviewScreen({
  eyebrow,
  quote,
  author,
}: {
  eyebrow: string;
  quote: string;
  author: string;
}) {
  const { localTime, duration } = useSprite();
  const inE = interpolate([0, 0.55], [0, 1], Easing.easeOutCubic)(localTime);
  const outE =
    localTime > duration - 0.45
      ? interpolate([duration - 0.45, duration], [1, 0])(localTime)
      : 1;
  const y = (1 - inE) * 40;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${BEVY.ink} 0%, ${BEVY.oxblood} 100%)`,
        padding: "0 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        opacity: inE * outE,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 90,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 520,
          lineHeight: 0.7,
          color: BEVY.red,
          opacity: 0.22,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {LDQUO}
      </div>

      <div
        style={{
          transform: `translateY(${y}px)`,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: BEVY.red,
            fontSize: 40,
            letterSpacing: "0.12em",
            marginBottom: 30,
          }}
        >
          ★★★★★
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
            fontWeight: 700,
            color: BEVY.red,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 64,
            fontWeight: 500,
            fontStyle: "italic",
            color: BEVY.cream,
            letterSpacing: "-0.018em",
            lineHeight: 1.22,
            marginBottom: 60,
            maxWidth: 980,
          }}
        >
          {LDQUO}
          {quote}
          {RDQUO}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 999,
              background: BEVY.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SERIF,
              fontSize: 30,
              fontWeight: 700,
              color: BEVY.cream,
              fontStyle: "italic",
            }}
          >
            {author.charAt(0)}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 28,
              fontWeight: 700,
              color: BEVY.cream,
              letterSpacing: "0.06em",
            }}
          >
            {author}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Final CTA ──────────────────────────────────────────────────────────────
// 30s ends with the wordmark + tagline only. 50s adds an App Store
// download pill below the tagline. `showDownloadPill` toggles between
// the two endings.
export function SceneCTA({
  showDownloadPill = false,
}: {
  showDownloadPill?: boolean;
}) {
  const { localTime, duration } = useSprite();
  const markScale = interpolate([0, 0.7], [0.55, 1], Easing.easeOutBack)(
    localTime,
  );
  const markOp = interpolate([0, 0.5], [0, 1], Easing.easeOutCubic)(
    localTime,
  );
  const textOp = interpolate([0.3, 0.95], [0, 1], Easing.easeOutCubic)(
    localTime,
  );
  const textY = interpolate([0.3, 0.95], [30, 0], Easing.easeOutCubic)(
    localTime,
  );

  const exitStart = duration - 0.4;
  const exit =
    localTime > exitStart
      ? interpolate([exitStart, duration], [1, 0])(localTime)
      : 1;
  const glowRot = localTime * 35;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 100% at 50% 50%, ${BEVY.oxblood} 0%, ${BEVY.ink} 60%, #000 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exit,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          transform: `rotate(${glowRot}deg)`,
          background: `conic-gradient(from 0deg, rgba(201,25,33,0.30), transparent 30%, rgba(201,25,33,0.22) 60%, transparent 85%)`,
          filter: "blur(70px)",
          opacity: markOp * 0.85,
        }}
      />

      <div
        style={{
          transform: `scale(${markScale})`,
          opacity: markOp,
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
        }}
      >
        <BevyLogo size={280} />
      </div>

      <div
        style={{
          marginTop: 64,
          opacity: textOp,
          transform: `translateY(${textY}px)`,
          fontFamily: SERIF,
          fontSize: 148,
          fontWeight: 500,
          color: BEVY.cream,
          letterSpacing: "-0.025em",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        Try Bevy
        <br />
        <span style={{ fontStyle: "italic", color: BEVY.red }}>
          for free.
        </span>
      </div>

      <div
        style={{
          marginTop: 56,
          opacity: textOp * 0.92,
          transform: `translateY(${textY}px)`,
          fontFamily: SANS,
          fontSize: 52,
          fontWeight: 500,
          color: BEVY.dim,
          textAlign: "center",
          maxWidth: 1000,
          lineHeight: 1.25,
          padding: "0 70px",
        }}
      >
        Turn your next gathering into
        <br />
        something unforgettable.
      </div>

      {showDownloadPill && (
        <div
          style={{
            marginTop: 74,
            opacity: textOp,
            transform: `translateY(${textY}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 22,
            padding: "28px 56px",
            background: BEVY.cream,
            color: BEVY.ink,
            borderRadius: 999,
            fontFamily: SANS,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.005em",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08h.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span>Download on the App Store</span>
        </div>
      )}
    </div>
  );
}

// ── Progress pips (App Store style horizontal segments) ────────────────────
// Generic strip used by both 30s and 50s. Each segment shows progress as
// a fill that grows while its time range is active.
export function ProgressPips({
  segments,
}: {
  segments: { start: number; end: number }[];
}) {
  const { time } = useTimeline();
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom: 54,
        display: "flex",
        gap: 10,
        zIndex: 20,
      }}
    >
      {segments.map((s, i) => {
        const active = time >= s.start && time <= s.end;
        const done = time > s.end;
        const local = active
          ? Math.max(0, Math.min(1, (time - s.start) / (s.end - s.start)))
          : done
            ? 1
            : 0;
        return (
          <div
            key={i}
            style={{
              flex: s.end - s.start,
              height: 4,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${local * 100}%`,
                height: "100%",
                background: BEVY.cream,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Light wrapper to avoid importing Sprite + this file from each preview.
export function PreviewSprite(props: {
  start: number;
  end: number;
  children: ReactNode;
}) {
  return <Sprite {...props} />;
}
