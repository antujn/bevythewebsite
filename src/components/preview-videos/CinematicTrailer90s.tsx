"use client";

// 90-second cinematic trailer. This is a different shape from the App
// Store previews — it leans on Ken-Burns photography, editorial title
// cards, and the six "pillar" scenes (Feeling / Growth / Extraordinary
// / AI / Safe / Courage) that mirror the brand narrative on the rest
// of the site. The structure here mirrors the original
// claude_design/Bevy Cinematic Trailer 90s.html one-for-one so the
// piece on the website plays the same as the source we sent to design.

import { forwardRef, type ReactNode } from "react";
import {
  Easing,
  interpolate,
  Sprite,
  Stage,
  type StageHandle,
  useSprite,
  useTimeline,
} from "./animations";
import {
  BEVY,
  BEVY_LOGO_SRC,
  BG_SRC,
  Grain,
  KenBurns,
  PhoneFrame,
  RSQUO,
  SANS,
  SERIF,
  Vignette,
} from "./bevyShared";

// Keep video clip references in one place so swapping a clip later (or
// pointing a scene at a different bundle) only has to be done once.
// `aliasModeEarlyDating` doesn't have an "early-dating" version in
// /public/videos yet, so it falls back to the significant-other clip we
// do have. The 90s trailer running on the site uses this fallback; the
// original HTML drafted with a dedicated early-dating cut.
const CLIPS = {
  fingerMode: "/videos/finger-mode-significant-other.mp4",
  aliasMode: "/videos/alias-mode-significant-other.mp4",
  aliasModeEarlyDating: "/videos/alias-mode-significant-other.mp4",
  aiChat: "/videos/ai-chat-significant-other.mp4",
  gameMode: "/videos/game-mode-screen.mp4",
} as const;

// ── Reusable building blocks ───────────────────────────────────────────────

function Headline({
  children,
  italic = false,
  color = BEVY.cream,
  size = 140,
  weight = 500,
  align = "left",
  lineHeight = 0.98,
  delay = 0,
  stagger = 0.08,
  letterSpacing = "-0.025em",
}: {
  children: ReactNode;
  italic?: boolean;
  color?: string;
  size?: number;
  weight?: number;
  align?: "left" | "center";
  lineHeight?: number;
  delay?: number;
  stagger?: number;
  letterSpacing?: string;
}) {
  const { localTime } = useSprite();
  // Flatten ReactNode children to a string. Headlines only ever get
  // plain text, so this is safe and avoids a full traversal helper.
  const text = Array.isArray(children) ? children.join("") : String(children);
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: "0 0.45em",
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing,
        lineHeight,
        textAlign: align,
      }}
    >
      {words.map((w, i) => {
        const t0 = delay + i * stagger;
        const op = interpolate(
          [t0, t0 + 0.35],
          [0, 1],
          Easing.easeOutCubic,
        )(localTime);
        const y = interpolate(
          [t0, t0 + 0.5],
          [28, 0],
          Easing.easeOutCubic,
        )(localTime);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: op,
              transform: `translateY(${y}px)`,
              paddingRight: italic ? "0.08em" : 0,
              willChange: "transform,opacity",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
}

function Eyebrow({
  children,
  color = BEVY.red,
  delay = 0,
}: {
  children: ReactNode;
  color?: string;
  delay?: number;
}) {
  const { localTime } = useSprite();
  const op = interpolate([delay, delay + 0.4], [0, 1], Easing.easeOutCubic)(
    localTime,
  );
  const y = interpolate([delay, delay + 0.5], [16, 0], Easing.easeOutCubic)(
    localTime,
  );
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 26,
        fontWeight: 700,
        color,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        opacity: op,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

function useSceneFade(fadeIn = 0.3, fadeOut = 0.4) {
  const { localTime, duration } = useSprite();
  const inOp = interpolate([0, fadeIn], [0, 1], Easing.easeOutCubic)(localTime);
  const outOp = interpolate(
    [duration - fadeOut, duration],
    [1, 0],
  )(localTime);
  return Math.min(inOp, outOp);
}

// ── Scenes ─────────────────────────────────────────────────────────────────

function SceneColdOpen() {
  const { localTime, duration } = useSprite();
  const fade = useSceneFade(0.4, 0.5);
  const dim = interpolate([0.3, 1.8], [1, 0.55], Easing.easeOutCubic)(
    localTime,
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
      }}
    >
      <KenBurns
        src={BG_SRC(2)}
        from={1.1}
        to={1.3}
        drift={[1, -2]}
        duration={duration}
        filter="saturate(0.9) brightness(0.75)"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,4,6,0.3) 0%, transparent 40%, rgba(10,4,6,0.85) 100%)",
          opacity: dim,
        }}
      />
      <Vignette />
      <Grain opacity={0.14} />

      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 300,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        <Eyebrow delay={0.5}>A film by Bevy</Eyebrow>
        <div style={{ maxWidth: 980 }}>
          <Headline size={160} italic delay={1.0} stagger={0.12}>
            The best nights
          </Headline>
        </div>
      </div>
    </div>
  );
}

function SceneMontage() {
  const { localTime, duration } = useSprite();
  const fade = useSceneFade(0.25, 0.5);

  const beats = [
    {
      src: BG_SRC(1),
      word: `aren${RSQUO}t planned.`,
      tilt: -2,
      scale: [1.1, 1.2] as const,
      italic: true,
    },
    {
      src: BG_SRC(9),
      word: `They${RSQUO}re loud.`,
      tilt: 1.5,
      scale: [1.15, 1.25] as const,
      italic: false,
    },
    {
      src: BG_SRC(4),
      word: "raw.",
      tilt: -1,
      scale: [1.2, 1.3] as const,
      italic: true,
    },
    {
      src: BG_SRC(5),
      word: "real.",
      tilt: 2,
      scale: [1.1, 1.22] as const,
      italic: true,
    },
  ];
  const slot = duration / beats.length;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
        overflow: "hidden",
      }}
    >
      {beats.map((b, i) => {
        const t0 = i * slot;
        const t1 = t0 + slot;
        const cutIn = interpolate([t0, t0 + 0.15], [0, 1])(localTime);
        const cutOut =
          i < beats.length - 1
            ? interpolate([t1 - 0.1, t1], [1, 0])(localTime)
            : interpolate([duration - 0.3, duration], [1, 0])(localTime);
        const op = cutIn * cutOut;
        if (op < 0.01) return null;

        const localP = Math.max(0, Math.min(1, (localTime - t0) / slot));
        const s = b.scale[0] + (b.scale[1] - b.scale[0]) * localP;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: op,
              transform: `rotate(${b.tilt}deg)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -120,
                overflow: "hidden",
                background: "#000",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.src}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${s})`,
                  transformOrigin: "center",
                  filter:
                    "saturate(0.95) brightness(0.8) contrast(1.05)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 35%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 80,
                right: 80,
                bottom: 400,
                fontFamily: SERIF,
                fontStyle: b.italic ? "italic" : "normal",
                fontSize: 170,
                fontWeight: 500,
                color: BEVY.cream,
                letterSpacing: "-0.028em",
                lineHeight: 0.96,
                textShadow: "0 6px 30px rgba(0,0,0,0.8)",
              }}
            >
              {b.word}
            </div>
          </div>
        );
      })}
      <Grain opacity={0.12} />
    </div>
  );
}

function SceneManifesto() {
  const { duration } = useSprite();
  const fade = useSceneFade(0.35, 0.5);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
      }}
    >
      <KenBurns
        src={BG_SRC(8)}
        from={1.1}
        to={1.22}
        drift={[-2, 1]}
        duration={duration}
        filter="saturate(1.1) contrast(1.05) brightness(0.85)"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,4,6,0.2) 0%, transparent 30%, rgba(10,4,6,0.9) 100%)",
        }}
      />
      <Vignette />
      <Grain opacity={0.1} />

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 260,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <Eyebrow delay={0.3} color={BEVY.cream}>
          Introducing
        </Eyebrow>
        <Headline
          size={230}
          italic
          weight={600}
          delay={0.6}
          stagger={0.15}
          letterSpacing="-0.035em"
          lineHeight={0.92}
        >
          Bevy.
        </Headline>
        <div style={{ marginTop: 12 }}>
          <Headline
            size={54}
            weight={400}
            delay={1.5}
            stagger={0.05}
            lineHeight={1.25}
            letterSpacing="-0.015em"
          >
            The modern, meaningful alternative to traditional truth or
            dare games.
          </Headline>
        </div>
      </div>
    </div>
  );
}

function PillarScene({
  number,
  chip,
  headline,
  body,
  bgSrc,
  videoSrc,
  noLoop = false,
  driftX = 1,
  driftY = -1,
  fromZoom = 1.12,
  toZoom = 1.24,
}: {
  number: string;
  chip: string;
  headline: string;
  body: string;
  bgSrc: string;
  videoSrc?: string;
  noLoop?: boolean;
  driftX?: number;
  driftY?: number;
  fromZoom?: number;
  toZoom?: number;
}) {
  const { localTime, duration } = useSprite();
  const fade = useSceneFade(0.35, 0.45);

  const phoneIn = interpolate([0.3, 1.3], [0, 1], Easing.easeOutCubic)(
    localTime,
  );
  const phoneY = (1 - phoneIn) * 120;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <KenBurns
        src={bgSrc}
        from={fromZoom}
        to={toZoom}
        drift={[driftX, driftY]}
        duration={duration}
        filter="saturate(0.88) brightness(0.55) contrast(1.05)"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,4,6,0.55) 0%, rgba(74,10,16,0.45) 50%, rgba(10,4,6,0.95) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            opacity: interpolate([0, 0.5], [0, 1])(localTime),
            display: "flex",
            alignItems: "baseline",
            gap: 22,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 54,
              fontWeight: 500,
              color: BEVY.red,
              letterSpacing: "-0.02em",
            }}
          >
            {number}
          </div>
          <div
            style={{
              width: 60,
              height: 1,
              background: BEVY.red,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              fontFamily: SANS,
              fontSize: 22,
              fontWeight: 700,
              color: BEVY.cream,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {chip}
          </div>
        </div>

        <div style={{ maxWidth: 1020 }}>
          <Headline
            size={108}
            italic
            delay={0.5}
            stagger={0.09}
            letterSpacing="-0.028em"
            lineHeight={1.02}
          >
            {headline}
          </Headline>
        </div>
      </div>

      {videoSrc && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "58%",
            transform: `translate(-50%, calc(-50% + ${phoneY}px))`,
            opacity: phoneIn,
          }}
        >
          <PhoneFrame width={560} videoSrc={videoSrc} noLoop={noLoop} />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 220,
          maxWidth: 980,
        }}
      >
        <Headline
          size={38}
          weight={400}
          delay={1.5}
          stagger={0.04}
          lineHeight={1.35}
          letterSpacing="-0.005em"
        >
          {body}
        </Headline>
      </div>

      <Grain opacity={0.08} />
    </div>
  );
}

function ScenePillarFeeling() {
  return (
    <PillarScene
      number="01"
      chip="The Feeling"
      headline="Go further, feel more."
      body="Every card is emotionally considered, socially aware, and designed to land."
      bgSrc={BG_SRC(1)}
      videoSrc={CLIPS.fingerMode}
    />
  );
}

function ScenePillarGrowth() {
  return (
    <PillarScene
      number="02"
      chip="The Growth"
      headline="Conversations that stay with you."
      body={`The more you play, the more connected you become — with each other and with yourself.`}
      bgSrc={BG_SRC(5)}
      videoSrc={CLIPS.aliasModeEarlyDating}
      noLoop
      driftX={-1}
      driftY={1}
    />
  );
}

function ScenePillarExtraordinary() {
  return (
    <PillarScene
      number="03"
      chip="Be Extraordinary"
      headline="Elevate the ordinary."
      body="Made for the moments in between. No awkward silences. No recycled small talk. Just the right card at the exact right moment."
      bgSrc={BG_SRC(4)}
      videoSrc={CLIPS.gameMode}
      driftX={1}
      driftY={-1}
    />
  );
}

function ScenePillarAI() {
  return (
    <PillarScene
      number="04"
      chip="Powered by AI"
      headline="Thoughtfully intelligent."
      body={`BevyAI adapts to your preferences, energy, and comfort level — and when there${RSQUO}s no group, it steps in as your play partner.`}
      bgSrc={BG_SRC(6)}
      videoSrc={CLIPS.aiChat}
      driftX={-1}
      driftY={-1}
    />
  );
}

function EditorialPillar({
  number,
  chip,
  headline,
  body,
  bgSrc,
  filter,
  grad,
}: {
  number: string;
  chip: string;
  headline: string;
  body: string;
  bgSrc: string;
  filter?: string;
  grad?: string;
}) {
  const { localTime, duration } = useSprite();
  const fade = useSceneFade(0.35, 0.45);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <KenBurns
        src={bgSrc}
        from={1.12}
        to={1.22}
        drift={[1, -1]}
        duration={duration}
        filter={filter || "saturate(0.95) brightness(0.65) contrast(1.05)"}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            grad ||
            "linear-gradient(180deg, rgba(10,4,6,0.3) 0%, transparent 40%, rgba(10,4,6,0.95) 100%)",
        }}
      />
      <Vignette />
      <Grain opacity={0.1} />

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 280,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            opacity: interpolate([0, 0.5], [0, 1])(localTime),
            display: "flex",
            alignItems: "baseline",
            gap: 22,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 54,
              fontWeight: 500,
              color: BEVY.red,
              letterSpacing: "-0.02em",
            }}
          >
            {number}
          </div>
          <div
            style={{
              width: 60,
              height: 1,
              background: BEVY.red,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              fontFamily: SANS,
              fontSize: 22,
              fontWeight: 700,
              color: BEVY.cream,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            {chip}
          </div>
        </div>
        <div style={{ maxWidth: 1020 }}>
          <Headline
            size={140}
            italic
            delay={0.4}
            stagger={0.1}
            letterSpacing="-0.03em"
            lineHeight={0.98}
          >
            {headline}
          </Headline>
        </div>
        <div style={{ marginTop: 10, maxWidth: 960 }}>
          <Headline
            size={42}
            weight={400}
            delay={1.3}
            stagger={0.04}
            lineHeight={1.32}
            letterSpacing="-0.005em"
          >
            {body}
          </Headline>
        </div>
      </div>
    </div>
  );
}

function ScenePillarSafe() {
  return (
    <EditorialPillar
      number="05"
      chip="Safe & Inclusive"
      headline="Play without hesitation."
      body="Inclusive, respectful, easy to say yes to. Honest, socially intelligent prompts designed for real people in real rooms."
      bgSrc={BG_SRC(3)}
    />
  );
}

function ScenePillarCourage() {
  return (
    <EditorialPillar
      number="06"
      chip="Courage Catalyst"
      headline="Permission to make the first move."
      body={`When a moment feels risky, the app carries the weight — so connection feels easier, more natural.`}
      bgSrc={BG_SRC(9)}
    />
  );
}

function SceneCollection() {
  const { localTime, duration } = useSprite();
  const fade = useSceneFade(0.35, 0.4);

  const bundles = [
    "Significant Other",
    "Early Dating",
    "The Office",
    "House Party",
    "No Strings Attached",
    "Date Night",
    "Not Safe For Work",
    "Safe For Work",
    "Baby Making",
    "Point Break",
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: "#000",
        overflow: "hidden",
      }}
    >
      <KenBurns
        src={BG_SRC(7)}
        from={1.1}
        to={1.2}
        drift={[-1, 1]}
        duration={duration}
        filter="saturate(0.9) brightness(0.5) contrast(1.05)"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,4,6,0.7) 0%, rgba(74,10,16,0.3) 50%, rgba(10,4,6,0.95) 100%)",
        }}
      />
      <Vignette />
      <Grain opacity={0.08} />

      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <Eyebrow delay={0.2}>The Collection</Eyebrow>
        <div style={{ maxWidth: 1020 }}>
          <Headline
            size={112}
            italic
            delay={0.5}
            stagger={0.1}
            letterSpacing="-0.028em"
            lineHeight={1.02}
          >
            A different energy for every night.
          </Headline>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 240,
          display: "flex",
          flexWrap: "wrap",
          gap: "18px 14px",
        }}
      >
        {bundles.map((b, i) => {
          const t0 = 1.2 + i * 0.12;
          const op = interpolate(
            [t0, t0 + 0.35],
            [0, 1],
            Easing.easeOutCubic,
          )(localTime);
          const y = interpolate(
            [t0, t0 + 0.5],
            [24, 0],
            Easing.easeOutCubic,
          )(localTime);
          const isBold = [0, 3, 6, 9].includes(i);
          return (
            <div
              key={i}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                padding: "18px 32px",
                background: isBold ? BEVY.red : "rgba(255,255,255,0.07)",
                border: isBold ? "none" : "1px solid rgba(255,255,255,0.18)",
                borderRadius: 999,
                backdropFilter: "blur(14px)",
                fontFamily: SANS,
                fontSize: 30,
                fontWeight: 600,
                color: BEVY.cream,
                letterSpacing: "-0.005em",
              }}
            >
              {b}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneReviewsIntro() {
  const { localTime } = useSprite();
  const fade = useSceneFade(0.35, 0.4);
  const rating = interpolate([0.2, 1.3], [0, 4.7], Easing.easeOutCubic)(
    localTime,
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: `linear-gradient(180deg, ${BEVY.ink} 0%, ${BEVY.oxblood} 100%)`,
        padding: "0 90px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Eyebrow delay={0.1}>Join 25K+ players</Eyebrow>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 50,
          margin: "50px 0 56px",
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
            out of 5 · App Store
          </div>
        </div>
      </div>

      <Headline
        size={92}
        italic
        delay={0.6}
        stagger={0.09}
        letterSpacing="-0.025em"
        lineHeight={1.08}
      >
        From real players and real game nights.
      </Headline>
    </div>
  );
}

function ReviewScreen({
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
        {"\u201C"}
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
            fontSize: 54,
            fontWeight: 500,
            fontStyle: "italic",
            color: BEVY.cream,
            letterSpacing: "-0.015em",
            lineHeight: 1.25,
            marginBottom: 60,
            maxWidth: 1000,
          }}
        >
          {"\u201C"}
          {quote}
          {"\u201D"}
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
              width: 64,
              height: 64,
              borderRadius: 999,
              background: BEVY.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SERIF,
              fontSize: 32,
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
              fontSize: 30,
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

function SceneLogoEnd() {
  const { localTime, progress } = useSprite();
  const fade = useSceneFade(0.35, 0.3);

  const markScale = interpolate([0, 0.35], [0.6, 1.0], Easing.easeOutCubic)(
    progress,
  );
  const markOp = interpolate([0, 0.2], [0, 1])(progress);
  const wordOp = interpolate([0.25, 0.5], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const wordY = interpolate([0.25, 0.5], [40, 0], Easing.easeOutCubic)(
    progress,
  );
  const divOp = interpolate([0.4, 0.6], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const divScale = interpolate([0.4, 0.6], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const ctaOp = interpolate([0.55, 0.8], [0, 1], Easing.easeOutCubic)(
    progress,
  );
  const ctaY = interpolate([0.55, 0.8], [30, 0], Easing.easeOutCubic)(
    progress,
  );

  const shimmerRot = localTime * 20;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: fade,
        background: `radial-gradient(120% 80% at 50% 42%, ${BEVY.oxblood} 0%, ${BEVY.ink} 70%, #000 100%)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -55%) rotate(${shimmerRot}deg)`,
          background:
            "conic-gradient(from 0deg, rgba(201,25,33,0.3) 0%, transparent 28%, rgba(201,25,33,0.2) 55%, transparent 80%)",
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
          opacity: markOp,
          transform: `scale(${markScale})`,
          marginBottom: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BEVY_LOGO_SRC}
          alt="Bevy"
          width={540}
          height={540}
          style={{
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.55))",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          opacity: wordOp,
          transform: `translateY(${wordY}px)`,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 240,
          fontWeight: 500,
          color: BEVY.cream,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
        }}
      >
        Bevy
      </div>

      <div
        style={{
          marginTop: 46,
          opacity: divOp,
          transform: `scaleX(${divScale})`,
          transformOrigin: "center",
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 240,
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
            width: 240,
            height: 1.5,
            background: `linear-gradient(270deg, transparent, ${BEVY.red} 80%, ${BEVY.red})`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 52,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          fontFamily: SANS,
          fontSize: 52,
          fontWeight: 500,
          color: BEVY.cream,
          letterSpacing: "-0.015em",
          textAlign: "center",
          lineHeight: 1.22,
          maxWidth: 1020,
          padding: "0 60px",
        }}
      >
        Turn your next gathering into
        <br />
        <em
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            color: BEVY.red,
            fontWeight: 500,
          }}
        >
          something unforgettable.
        </em>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 260,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
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
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08h.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <span>Download on the App Store</span>
      </div>
    </div>
  );
}

function ChapterMark() {
  const { time } = useTimeline();
  const segments = [
    { start: 0, end: 4.0 },
    { start: 4.0, end: 9.0 },
    { start: 9.0, end: 13.0 },
    { start: 13.0, end: 22.0 },
    { start: 22.0, end: 31.0 },
    { start: 31.0, end: 39.0 },
    { start: 39.0, end: 48.0 },
    { start: 48.0, end: 54.0 },
    { start: 54.0, end: 60.0 },
    { start: 60.0, end: 66.0 },
    { start: 66.0, end: 80.0 },
    { start: 80.0, end: 90.0 },
  ];
  const idx = segments.findIndex((s) => time >= s.start && time < s.end);
  const current = idx < 0 ? segments.length - 1 : idx;

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 100,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {segments.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 36 : 10,
            height: 3,
            background:
              i <= current ? BEVY.cream : "rgba(255,255,255,0.25)",
            borderRadius: 2,
            transition: "width 300ms ease",
          }}
        />
      ))}
    </div>
  );
}

function Master() {
  return (
    <>
      <Sprite start={0} end={4.0}>
        <SceneColdOpen />
      </Sprite>
      <Sprite start={4.0} end={9.0}>
        <SceneMontage />
      </Sprite>
      <Sprite start={9.0} end={13.0}>
        <SceneManifesto />
      </Sprite>
      <Sprite start={13.0} end={22.0}>
        <ScenePillarFeeling />
      </Sprite>
      <Sprite start={22.0} end={31.0}>
        <ScenePillarGrowth />
      </Sprite>
      <Sprite start={31.0} end={39.0}>
        <ScenePillarExtraordinary />
      </Sprite>
      <Sprite start={39.0} end={48.0}>
        <ScenePillarAI />
      </Sprite>
      <Sprite start={48.0} end={54.0}>
        <ScenePillarSafe />
      </Sprite>
      <Sprite start={54.0} end={60.0}>
        <ScenePillarCourage />
      </Sprite>
      <Sprite start={60.0} end={66.0}>
        <SceneCollection />
      </Sprite>
      <Sprite start={66.0} end={69.5}>
        <SceneReviewsIntro />
      </Sprite>
      <Sprite start={69.5} end={73.0}>
        <ReviewScreen
          eyebrow="★ App Store Review"
          quote={`Bevy is so much fun! I${RSQUO}m working at a hostel in Bali and we play every morning. It brings the group together so effortlessly.`}
          author="DukeNeuk"
        />
      </Sprite>
      <Sprite start={73.0} end={76.5}>
        <ReviewScreen
          eyebrow="★ App Store Review"
          quote="A fantastic way to get to know your partner better. Insightful questions into things about your partner you may not know or understand."
          author="AnthonyJane24"
        />
      </Sprite>
      <Sprite start={76.5} end={80.0}>
        <ReviewScreen
          eyebrow="★ App Store Review"
          quote="The questions are unique and help you get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale."
          author="Niece.doll"
        />
      </Sprite>
      <Sprite start={80.0} end={90.0}>
        <SceneLogoEnd />
      </Sprite>
      <ChapterMark />
    </>
  );
}

const CinematicTrailer90s = forwardRef<StageHandle>(function CinematicTrailer90s(
  _,
  ref,
) {
  return (
    <Stage
      ref={ref}
      width={1170}
      height={2532}
      duration={90}
      background={BEVY.ink}
      loop
      autoplay
    >
      <Master />
    </Stage>
  );
});

export default CinematicTrailer90s;
