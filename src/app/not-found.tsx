// Intentionally a Server Component (no `"use client"`). Per the
// Next.js 16 docs: "By default, `not-found` is a Server Component."
//
// Previously this file was marked `"use client"` even though it uses
// only <Image>, <Link>, and static data — all Server-Component-safe.
// That stray directive pushed the 404 route into the client router
// cache. When the user hit the browser back button from this page
// back to the homepage, Next.js's router-cache restoration path got
// confused and the homepage's motion hooks (useScroll, whileInView,
// useTransform, framer-motion's internal trackers) failed to
// re-initialize cleanly — reading as "all motion broken" on return.
//
// Keeping this a Server Component makes back-navigation a clean
// full-swap of children, the homepage's client components mount
// fresh, and motion works again.

import Image from "next/image";
import Link from "next/link";
import NotFoundBeacon from "@/components/NotFoundBeacon";

type RouteCard = {
  chip: string;
  title: string;
  href: string;
  cta: string;
  tone: "red" | "charcoal";
};

const BASE_CARDS: RouteCard[] = [
  {
    chip: "Truth",
    title: "This route is not in the deck.",
    href: "/#hero",
    cta: "Go Home",
    tone: "red",
  },
  {
    chip: "Dare",
    title: "Pick a fresh card and keep the game moving.",
    href: "/#bundles-heading",
    cta: "Open Collection",
    tone: "charcoal",
  },
  {
    chip: "Bevy",
    title: "Wrong turn, still the right app.",
    href: "/#gameplay-heading",
    cta: "See Gameplay",
    tone: "red",
  },
  {
    chip: "Review",
    title: "See what players say before your next round.",
    href: "/#reviews-top",
    cta: "Jump to Reviews",
    tone: "charcoal",
  },
  {
    chip: "FAQ",
    title: "Need quick answers? We stacked them for you.",
    href: "/#faq-heading",
    cta: "Open FAQ",
    tone: "red",
  },
  {
    chip: "Restart",
    title: "Reset the vibe in one tap.",
    href: "/#hero",
    cta: "Back to Top",
    tone: "charcoal",
  },
];

const RAIL_OFFSETS = [0, 2, 4, 1] as const;

function buildRailCards(offset: number): RouteCard[] {
  return Array.from({ length: 8 }, (_, index) => {
    return BASE_CARDS[(index + offset) % BASE_CARDS.length];
  });
}

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="relative min-h-[100dvh] overflow-clip">
      {/*
        Client-only flag-setter. Tells the next page the user lands on
        (via browser back from here) to force a reload so motion hooks
        reinitialise cleanly. See NotFoundBeacon + BfcacheGuard for
        the full rationale.
      */}
      <NotFoundBeacon />
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/backgrounds/background2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img"
          priority
        />
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-38"
          priority
        />
        {/* 404 page uses a slightly darker wine-tinted overlay than
            the universal --section-overlay (this is a standalone
            page, so we want more ambience behind the giant "404"
            ghost type). */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0505]/70 via-[#1a0809]/64 to-[#26090c]/74" />
      </div>

      <section className="nf-stage relative z-10 h-[100dvh]">
        <div className="nf-ghost" aria-hidden="true">
          <p className="nf-ghost__code font-display">404</p>
        </div>

        <div className="nf-rails" aria-label="Recovery route cards">
          {RAIL_OFFSETS.map((offset, railIndex) => (
            <div
              key={`rail-${offset}`}
              className={`nf-rail nf-rail--${railIndex}`}
            >
              <div className="nf-rail-track">
                {[...buildRailCards(offset), ...buildRailCards(offset)].map(
                  (card, cardIndex) => (
                    <Link
                      key={`rail-${offset}-${cardIndex}`}
                      href={card.href}
                      className={`nf-rail-card ${card.tone === "red" ? "nf-rail-card--red" : "nf-rail-card--charcoal"}`}
                    >
                      <div className="nf-rail-card__top">
                        <span className="nf-rail-card__chip">{card.chip}</span>
                        <span className="nf-rail-card__index">
                          {String((cardIndex % BASE_CARDS.length) + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>
                      <p className="nf-rail-card__title">{card.title}</p>
                      <p className="nf-rail-card__cta">
                        {card.cta} <span aria-hidden>→</span>
                      </p>
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}
