"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { RevealChild, RevealGroup } from "./RevealIn";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490";

// All FAQ cards share the Significant Other bundle's deep red to
// match the brand's primary accent. Kept as a single constant so it
// can be swapped (e.g. back to bundle-per-card) in one edit.
const CARD_ACCENT = "#610000";

type FaqItem = {
  q: string;
  /** Plain-text answer used by the JSON-LD FAQPage schema. */
  a: string;
  /** Optional rich renderable version for the UI (with links etc.). */
  render?: ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Who is Bevy for?",
    a: "Couples looking for deeper conversation, friend groups tired of the same twenty recycled prompts, daters trying to move past small talk, and anyone who wants a card game that leans on real conversation. You can also play quietly. BevyAI\u2019s chat lets you scroll prompts and get thoughtful answers one at a time.",
  },
  {
    q: "What makes Bevy different from other Truth or Dare apps?",
    a: "Every card is hand-written and reviewed for tone, inclusivity, and social intelligence. No recycled internet lists, no cringe prompts, no dares that leave someone out. Ten bundles are tuned to specific moods (Significant Other, Date Night, House Party, NSFW, and more), so you pick the vibe upfront. The writing draws on TikTok trends, Reddit threads, and shows like Love Island and The Office, aiming for the opposite of what you remember from middle-school truth or dare.",
  },
  {
    q: "Is it safe and inclusive?",
    a: "Yes. Every card is written to be inclusive across identities, orientations, and comfort levels. NSFW bundles are separate and opt-in, so you pick the intensity upfront. You can exclude any card from your deck and it won\u2019t come back. Nothing asks anyone to do something illegal, dangerous, or degrading. If a card ever misses the mark, you can report it in-app.",
  },
  {
    q: "Is it free?",
    a: "The core app is free, with a starter bundle and a 7-day trial of Bevy Premium Edition on first install. Subscribe to Premium for access to every bundle and extra daily BevyAI tokens. Tokens are a separate currency used for BevyAI replies and can be purchased in packs. Purchased tokens never expire. No ads, ever. Check the App Store listing for the latest pricing and plans.",
    render: (
      <>
        The core app is free, with a starter bundle and a 7&#8209;day trial of
        Bevy Premium Edition on first install. Subscribe to Premium for access
        to every bundle and extra daily BevyAI tokens. Tokens are a separate
        currency used for BevyAI replies and can be purchased in packs.
        Purchased tokens never expire. No ads, ever. Check the{" "}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="faq-link"
        >
          App Store listing
        </a>{" "}
        for the latest pricing and plans.
      </>
    ),
  },
  {
    q: "Do I need to create an account?",
    a: "No. No signup, no email, no login. Your preferences and any custom cards you write live on your device. Analytics are anonymous, and the AI only sees a numeric prompt ID, never your answers, your conversations, or any content you create.",
  },
  {
    q: "Can I play solo?",
    a: "Yes. The BevyAI chat tab is a single-player experience: pick any bundle, scroll through its prompts, tap the one you want, and BevyAI answers as if you asked it the question. There\u2019s no separate \u201csolo mode\u201d. You\u2019re just using the same library without anyone across the table.",
  },
  {
    q: "How does BevyAI work?",
    a: "BevyAI answers prompts. You choose a prebuilt card from any of the ten bundles, tap it, and BevyAI reads back a thoughtful answer. It costs one token per reply. Each reply sends only the card\u2019s numeric prompt ID to our backend. No card text, no custom content, no history, and no personal information. Custom cards you write yourself stay local and aren\u2019t answered by BevyAI yet.",
  },
  {
    q: "How old do I need to be?",
    a: "Bevy is intended for users 18 and up. Apple rates the app 13+ because the built-in bundles include infrequent mature themes, but our Terms of Service require all users to be at least 18. NSFW bundles go further in that direction. If you\u2019re under 18, please use a different app.",
  },
];

const FLIP_SPRING = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
  mass: 0.9,
};

// Schema.org FAQPage so Google can surface Q&A directly in search
// results. The text must match the visible answer text, so we always
// read from the plain-text `a:` field (never from `render`).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqSection() {
  return (
    <section id="faq" className="section-space relative overflow-hidden">
      <span id="faq-anchor" className="section-anchor-mid" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-b from-black/52 via-black/48 to-black/58"
      />

      <div className="relative z-10">
        <RevealGroup
          stagger={0.1}
          amount={0.35}
          style={{ maxWidth: 680, marginInline: "auto", textAlign: "center" }}
          className="site-shell"
        >
          <RevealChild>
            <p className="kicker">Frequently Asked Questions</p>
          </RevealChild>
          <RevealChild>
            <h2 id="faq-heading" className="section-title section-anchor-title">
              A deck of{" "}
              <span className="font-bold italic">answers.</span>
            </h2>
          </RevealChild>
          <RevealChild preset="scale">
            <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          </RevealChild>
          <RevealChild>
            <p
              className="section-body"
              style={{ maxWidth: 520, marginInline: "auto" }}
            >
              Tap any card to flip it. Swipe the rail to browse.
            </p>
          </RevealChild>
        </RevealGroup>

        <div className="faq-rail-viewport">
          <div className="faq-rail">
            {FAQ_ITEMS.map((item, i) => (
              <FaqCard
                key={item.q}
                item={item}
                index={i}
                total={FAQ_ITEMS.length}
              />
            ))}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

const HINT_PULSE = {
  opacity: [0.48, 0.92, 0.48],
};

function FaqCard({
  item,
  index,
  total,
}: {
  item: FaqItem;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardNum = String(index + 1).padStart(2, "0");
  const totalNum = String(total).padStart(2, "0");

  // Alternate a tiny tilt on entrance so the stagger reads like dealing
  // a hand rather than identical cards marching in.
  const enterRotate = index % 2 === 0 ? -2.5 : 2.5;

  return (
    <motion.div
      className="faq-card-slot"
      initial={{ opacity: 0, y: 56, rotateZ: enterRotate }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
    >
      <motion.button
        type="button"
        className="faq-card"
        onClick={() => setFlipped((v) => !v)}
        aria-expanded={flipped}
        aria-label={
          flipped
            ? `Answer to: ${item.q}. Tap to flip back.`
            : `${item.q} Tap to reveal the answer.`
        }
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={FLIP_SPRING}
        whileHover={{ y: -6, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — the question */}
        <div
          className="faq-card-face faq-card-front"
          style={{ background: CARD_ACCENT }}
        >
          <div className="faq-card-top">
            <span className="faq-card-chip">Truth</span>
            <span className="faq-card-index">
              {cardNum} / {totalNum}
            </span>
          </div>
          <h3 className="faq-card-q">{item.q}</h3>
          <div className="faq-card-foot">
            <motion.span
              className="faq-card-hint"
              animate={HINT_PULSE}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                // Offset per card so the rail's hints breathe out of
                // sync — much more alive than a uniform pulse.
                delay: index * 0.24,
              }}
            >
              Tap to reveal
            </motion.span>
            <motion.span
              className="faq-card-arrow"
              aria-hidden
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.24,
              }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Back — the answer */}
        <div className="faq-card-face faq-card-back">
          <div className="faq-card-top">
            <span className="faq-card-chip faq-card-chip--answer">Answer</span>
            <span className="faq-card-index">
              {cardNum} / {totalNum}
            </span>
          </div>
          <p className="faq-card-a">{item.render ?? item.a}</p>
          <div className="faq-card-foot">
            <span className="faq-card-hint">Tap to flip back</span>
            <span className="faq-card-arrow" aria-hidden>
              ↺
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
