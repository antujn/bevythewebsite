"use client";

// Ports the small Stage / Sprite animation system that powers the
// claude_design HTML preview files into a real React module. Each
// preview "video" runs as a portrait <Stage> at 1170×2532 and uses
// requestAnimationFrame to drive a global playhead that scenes read
// via useTimeline()/useSprite(). The primitives intentionally mirror
// the original animations.jsx API one-to-one so scene code copied out
// of the HTML files keeps working with no behavioral changes.

import {
  createContext,
  forwardRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

// External handle exposed by <Stage> via forwardRef. Lets the recorder
// drive the timeline frame-by-frame: pause the rAF loop, jump to a
// specific time, force-sync embedded <video> elements via the
// `recording` flag, and grab the canvas DOM root to rasterize each
// frame into a <canvas> for the WebCodecs pipeline.
export interface StageHandle {
  setTime: (t: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  /**
   * When true, scenes that contain <video> elements seek their
   * currentTime exactly (no 0.4s tolerance) and pause natural
   * playback. This is the difference between a smooth real-time
   * preview and a frame-accurate render.
   */
  setRecording: (recording: boolean) => void;
  getDuration: () => number;
  getCanvasElement: () => HTMLDivElement | null;
}

// ── Easing functions ───────────────────────────────────────────────────────
export const Easing = {
  linear: (t: number) => t,

  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => {
    const u = t - 1;
    return u * u * u + 1;
  },
  easeInOutCubic: (t: number) =>
    t < 0.5
      ? 4 * t * t * t
      : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => {
    const u = t - 1;
    return 1 - u * u * u * u;
  },

  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),

  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
} as const;

export type EaseFn = (t: number) => number;

// ── Helpers ────────────────────────────────────────────────────────────────
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// Popmotion-style multi-keyframe interpolator. Mirrors the original
// signature so scene code that does `interpolate([0, 1], [0, 100])(t)`
// continues to work unchanged.
export function interpolate(
  input: number[],
  output: number[],
  ease: EaseFn | EaseFn[] = Easing.linear,
): (t: number) => number {
  return (t: number) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i += 1) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease)
          ? ease[i] || Easing.linear
          : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

export function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic,
}: {
  from?: number;
  to?: number;
  start?: number;
  end?: number;
  ease?: EaseFn;
}) {
  return (t: number) => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline / Sprite contexts ─────────────────────────────────────────────
type TimelineValue = {
  time: number;
  duration: number;
  playing: boolean;
  /**
   * Set by the recorder while frames are being captured. Scene code
   * that drives external state (notably <video> currentTime) must
   * sync exactly when this is on, instead of debouncing for normal
   * rAF playback.
   */
  recording: boolean;
};

const TimelineContext = createContext<TimelineValue>({
  time: 0,
  duration: 10,
  playing: false,
  recording: false,
});

export const useTime = () => useContext(TimelineContext).time;
export const useTimeline = () => useContext(TimelineContext);

type SpriteValue = {
  localTime: number;
  progress: number;
  duration: number;
  visible: boolean;
};

const SpriteContext = createContext<SpriteValue>({
  localTime: 0,
  progress: 0,
  duration: 0,
  visible: false,
});

export const useSprite = () => useContext(SpriteContext);

type SpriteRenderArg = SpriteValue;
type SpriteChildren =
  | ReactNode
  | ((arg: SpriteRenderArg) => ReactNode);

export function Sprite({
  start = 0,
  end = Infinity,
  keepMounted = false,
  children,
}: {
  start?: number;
  end?: number;
  keepMounted?: boolean;
  children: SpriteChildren;
}) {
  const { time } = useTimeline();
  const visible = time >= start && time <= end;
  if (!visible && !keepMounted) return null;

  const duration = end - start;
  const localTime = Math.max(0, time - start);
  const progress =
    duration > 0 && Number.isFinite(duration)
      ? clamp(localTime / duration, 0, 1)
      : 0;

  const value: SpriteValue = { localTime, progress, duration, visible };

  return (
    <SpriteContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </SpriteContext.Provider>
  );
}

// ── Stage ──────────────────────────────────────────────────────────────────
// Renders a fixed-size canvas that auto-scales to fit its parent. Emits
// a TimelineContext that drives every Sprite inside. Includes a small
// playback bar beneath the canvas for scrub/pause — same affordances as
// the original HTML files so the modal behaves like a true preview tool.

type StageProps = {
  width?: number;
  height?: number;
  duration?: number;
  background?: string;
  loop?: boolean;
  autoplay?: boolean;
  showControls?: boolean;
  children: ReactNode;
};

export const Stage = forwardRef<StageHandle, StageProps>(function Stage(
  {
    width = 1170,
    height = 2532,
    duration = 30,
    background = "#0a0608",
    loop = true,
    autoplay = true,
    showControls = true,
    children,
  },
  ref,
) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [recording, setRecording] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  // Imperative handle for the recorder. The recorder pauses the rAF
  // loop, flips `recording` on so video sync is exact, then steps
  // through time programmatically before reading frames off the
  // canvas DOM via getCanvasElement().
  useImperativeHandle(
    ref,
    () => ({
      setTime: (t: number) => setTime(clamp(t, 0, duration)),
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      reset: () => setTime(0),
      setRecording: (r: boolean) => setRecording(r),
      getDuration: () => duration,
      getCanvasElement: () => canvasRef.current,
    }),
    [duration],
  );

  // Auto-scale to fit parent. We measure the parent and pick the
  // largest scale that lets `width × height + control-bar height` fit
  // without overflowing.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const barH = showControls ? 44 : 0;
      const s = Math.min(
        el.clientWidth / width,
        Math.max(0.05, (el.clientHeight - barH) / height),
      );
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [width, height, showControls]);

  // Animation loop. We deliberately re-create the rAF on play toggle
  // so the lastTs reference resets cleanly when we pause/resume.
  useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime((t) => {
        let next = t + dt;
        if (next >= duration) {
          if (loop) {
            next %= duration;
          } else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loop]);

  // Keyboard controls scoped to the stage element so we don't fight
  // with focus elsewhere in the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === "ArrowLeft") {
        setTime((t) => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === "ArrowRight") {
        setTime((t) => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === "0" || e.code === "Home") {
        setTime(0);
      }
    };
    const el = stageRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
    };
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;

  const ctxValue = useMemo<TimelineValue>(
    () => ({ time: displayTime, duration, playing, recording }),
    [displayTime, duration, playing, recording],
  );

  return (
    <div
      ref={stageRef}
      tabIndex={-1}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "transparent",
        outline: "none",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div
          ref={canvasRef}
          style={{
            width,
            height,
            background,
            position: "relative",
            transform: `scale(${scale})`,
            transformOrigin: "center",
            flexShrink: 0,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            borderRadius: 36,
            overflow: "hidden",
          }}
        >
          <TimelineContext.Provider value={ctxValue}>
            {children}
          </TimelineContext.Provider>
        </div>
      </div>

      {showControls && (
        <PlaybackBar
          time={displayTime}
          duration={duration}
          playing={playing}
          onPlayPause={() => setPlaying((p) => !p)}
          onReset={() => setTime(0)}
          onSeek={(t) => setTime(t)}
          onHover={(t) => setHoverTime(t)}
        />
      )}
    </div>
  );
});

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover,
}: {
  time: number;
  duration: number;
  playing: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSeek: (t: number) => void;
  onHover: (t: number | null) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const timeFromEvent = useCallback(
    (e: { clientX: number }) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return 0;
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      return x * duration;
    },
    [duration],
  );

  useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      onSeek(timeFromEvent(e));
    };
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);

  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = (t: number) => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const mono = "JetBrains Mono, ui-monospace, SFMono-Regular, monospace";
  const btnStyle: CSSProperties = {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    color: "#f4eee5",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div
      data-playback-bar="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 14px",
        marginTop: 8,
        background: "rgba(20, 8, 10, 0.7)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        width: "100%",
        maxWidth: 560,
        alignSelf: "center",
        color: "#f6f4ef",
        fontFamily: "Inter, system-ui, sans-serif",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onReset}
        title="Return to start"
        aria-label="Return to start"
        style={btnStyle}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 2v10M12 2L5 7l7 5V2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={onPlayPause}
        title={playing ? "Pause" : "Play"}
        aria-label={playing ? "Pause" : "Play"}
        style={btnStyle}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="2" width="3" height="10" fill="currentColor" />
            <rect x="8" y="2" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 2l9 5-9 5V2z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
          width: 38,
          textAlign: "right",
          color: "#f4eee5",
        }}
      >
        {fmt(time)}
      </div>

      <div
        ref={trackRef}
        onMouseMove={(e) => {
          if (!trackRef.current) return;
          if (dragging) onSeek(timeFromEvent(e));
          else onHover(timeFromEvent(e));
        }}
        onMouseLeave={() => {
          if (!dragging) onHover(null);
        }}
        onMouseDown={(e) => {
          setDragging(true);
          onSeek(timeFromEvent(e));
          onHover(null);
        }}
        style={{
          flex: 1,
          height: 22,
          position: "relative",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 4,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            height: 4,
            background: "rgba(217,82,58,0.85)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            top: "50%",
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      <div
        style={{
          fontFamily: mono,
          fontSize: 12,
          fontVariantNumeric: "tabular-nums",
          width: 38,
          textAlign: "left",
          color: "rgba(244,238,229,0.55)",
        }}
      >
        {fmt(duration)}
      </div>
    </div>
  );
}
