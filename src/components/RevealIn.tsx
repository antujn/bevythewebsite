"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

/** Standard ease-out curve used across the site. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Preset = "fadeUp" | "fade" | "slideLeft" | "slideRight" | "scale";

const PRESETS: Record<Preset, { hidden: Record<string, number>; show: Record<string, number> }> = {
  fadeUp: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  slideLeft: { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
};

type BaseProps = {
  children: ReactNode;
  /** Entrance motion preset. */
  preset?: Preset;
  /** Delay before animation starts (seconds). */
  delay?: number;
  /** Duration in seconds. */
  duration?: number;
  /** Only animate on first enter (default true). */
  once?: boolean;
  /** Viewport threshold (0-1) before animation triggers (default 0.25). */
  amount?: number;
  className?: string;
};

/**
 * Scroll-triggered reveal wrapper. Fades + translates in once the element
 * enters the viewport. Pair with `<RevealGroup>` for staggered children.
 */
export function RevealIn({
  children,
  preset = "fadeUp",
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.25,
  className,
  ...rest
}: BaseProps & Omit<HTMLMotionProps<"div">, keyof BaseProps>) {
  const { hidden, show } = PRESETS[preset];
  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={show}
      viewport={{ once, amount }}
      transition={{ duration, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reveals its direct children as a staggered sequence once the group
 * enters view. Each child must be a `<RevealChild>` (or any motion element
 * that accepts the `child` variant name).
 */
export function RevealGroup({
  children,
  stagger = 0.1,
  delay = 0,
  once = true,
  amount = 0.25,
  className,
  ...rest
}: {
  children: ReactNode;
  /** Delay between each child (seconds). */
  stagger?: number;
  /** Delay before the first child (seconds). */
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "variants" | "initial" | "animate">) {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * A child inside a `<RevealGroup>`. Consumes the parent's `show` variant
 * with its own fade+slide. Each child only needs to declare how it looks;
 * timing comes from the parent.
 */
export function RevealChild({
  children,
  preset = "fadeUp",
  duration = 0.6,
  className,
  ...rest
}: {
  children: ReactNode;
  preset?: Preset;
  duration?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "variants">) {
  const { hidden, show } = PRESETS[preset];
  const variants: Variants = {
    hidden,
    show: {
      ...show,
      transition: { duration, ease: EASE_OUT },
    },
  };
  return (
    <motion.div className={className} variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
