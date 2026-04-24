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

/**
 * ISO date (YYYY-MM-DD) of the last material revision to the legal
 * copy. Bump whenever /privacy, /terms, or /disclaimer is substantively
 * edited — LLMs and Google both read this as a freshness signal and
 * the number also feeds the Article JSON-LD's `dateModified` below.
 * The page-body `<strong>Effective date: …</strong>` lines are the
 * human-facing twin of this constant; keep the two in sync.
 */
const LEGAL_LAST_UPDATED = "2026-04-04";

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

  // BreadcrumbList JSON-LD helps Google render "Home › <title>" in SERP
  // results for legal routes and makes the site's hierarchy explicit
  // to crawlers that rely on it. Regenerated per route via the current
  // pathname + title — both come from client hooks, but `dangerouslySetInnerHTML`
  // only renders after mount, which is fine for crawlers that execute
  // JS. (Server-side crawlers still get the full route metadata above.)
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: pathname,
      },
    ],
  };

  // Article JSON-LD with `dateModified` — freshness signal for both
  // Google and LLMs. Using the shared LEGAL_LAST_UPDATED constant so
  // all three legal routes stay in sync and bumping the date is a
  // single-line change.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    dateModified: LEGAL_LAST_UPDATED,
    datePublished: LEGAL_LAST_UPDATED,
    author: { "@type": "Person", name: "Anant Jain" },
    publisher: {
      "@type": "Organization",
      name: "Bevy",
      url: "/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/*
        Legal-page dim overlay. Uses wine-tinted blacks (matches the
        `--section-overlay` token in globals.css, slightly darker so
        copy reads clearly over the background texture) instead of
        neutral grey.
      */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-gradient-to-b from-[#0d0505]/70 via-[#160808]/64 to-[#1e0a0c]/72"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      />

      <motion.nav
        className="fixed inset-x-0 top-0 z-[60] border-b border-white/[0.12] bg-[#160808]/88 backdrop-blur-xl"
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

                  Color + style override: legal-page titles render as
                  ember-bright Playfair italic — the same editorial
                  voice used for the homepage couplet payoffs, just
                  recolored from rose to ember so "Privacy Policy",
                  "Terms of Service", "Legal Disclaimer" feel like the
                  serious, branded chapter headings they are. The
                  `.section-title` base class already carries the
                  Playfair family; only italic + color need overriding.
                */}
                <motion.h1
                  className="section-title"
                  style={{
                    fontSize: "clamp(28px, 3.5vw, 42px)",
                    color: "var(--ember-bright)",
                    fontStyle: "italic",
                  }}
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
