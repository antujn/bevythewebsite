"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Footer from "@/components/Footer";

const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const SEGMENT_TITLES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  disclaimer: "Legal Disclaimer",
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Shared layout for /privacy, /terms, /disclaimer. Because it lives at the
 * route level (inside a (legal) route group), Next.js keeps it mounted
 * across navigations between the three pages — so entrance animations
 * run once on first load and don't replay when users click between
 * legal pages.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const title = (segment && SEGMENT_TITLES[segment]) ?? "Legal";

  // Next.js's default scroll-to-view for shared layouts targets the
  // newly-rendered children (the page body), which lands the viewport
  // on the first <p> inside .legal-copy and hides the layout's own
  // "Legal" kicker + title block above it. Explicitly pin scroll to 0
  // on each legal-route change so the user always lands at the page's
  // true top, just below the fixed nav.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-gradient-to-b from-black/62 via-black/58 to-black/66"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      />

      <motion.nav
        className="fixed inset-x-0 top-0 z-[60] border-b border-white/[0.12] bg-[#090909]/88 backdrop-blur-xl"
        initial={{ y: -84, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 }}
      >
        <div className="site-shell flex h-[84px] items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
          >
            <Link href="/" prefetch={false} className="flex items-center gap-3">
              <Image
                src="/images/icons/bevy-logo.png"
                alt="Bevy"
                width={44}
                height={44}
                priority
              />
              <span className="hidden text-[12px] font-semibold uppercase tracking-[0.2em] text-white/52 sm:block">
                Bevy
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
          >
            <motion.span
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              style={{ display: "inline-block" }}
            >
              <Link
                href="/"
                prefetch={false}
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56 transition-colors duration-300 hover:text-white/90"
              >
                &larr; Back Home
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </motion.nav>

      <div className="relative z-10">
        <main
          id="main"
          tabIndex={-1}
          style={{ paddingTop: 132, paddingBottom: 100 }}
        >
          <div className="site-shell">
            <article className="mx-auto max-w-[720px]">
              <header style={{ marginBottom: 48 }}>
                <motion.p
                  className="kicker"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.65,
                    ease: EASE_OUT,
                    delay: 0.35,
                  }}
                >
                  Legal
                </motion.p>
                {/*
                  Outer h1 handles the one-time entrance on layout mount
                  (with the sequenced delay). The inner keyed span
                  handles the title text swap when switching between
                  legal tabs, so text changes fade instead of snapping.
                */}
                <motion.h1
                  className="section-title"
                  style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    ease: EASE_OUT,
                    delay: 0.45,
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      style={{ display: "inline-block" }}
                    >
                      {title}
                    </motion.span>
                  </AnimatePresence>
                </motion.h1>
                <motion.div
                  className="gold-line mt-4"
                  style={{ marginInline: 0 }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_OUT,
                    delay: 0.7,
                  }}
                />
              </header>

              <motion.nav
                className="flex flex-wrap gap-x-6 gap-y-2"
                style={{
                  marginBottom: 40,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.06,
                      delayChildren: 0.8,
                    },
                  },
                }}
              >
                {legalNav.map((item) => (
                  <motion.span
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: EASE_OUT },
                      },
                    }}
                    whileHover={{ y: -2 }}
                    style={{ display: "inline-block" }}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30 transition-colors hover:text-white/60"
                    >
                      {item.label}
                    </Link>
                  </motion.span>
                ))}
              </motion.nav>

              {/*
                Body container is keyed by pathname so each page
                transition triggers a fresh fade-up. React remounts this
                subtree when the key changes, which plays the motion
                initial → animate cycle and smooths what would otherwise
                be an instant content swap.
              */}
              <motion.div
                key={pathname}
                className="legal-copy"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                {children}
              </motion.div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
