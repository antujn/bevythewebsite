"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useDownload } from "./DownloadContext";
import { RevealIn } from "./RevealIn";

const appStoreReviews = [
  {
    author: "DukeNeuk",
    title: "Smart and Fun Game!",
    text: "Bevy is so much fun! The prompts are hilarious and really help to break the ice in a crowd. I’m working at a hostel in Bali and one of my guests had the app and I wanted to share the experience with other guests once she left. We play every morning and it brings the group together so effortlessly. Give it a try with new friends or old and get your party started!",
  },
  {
    author: "AnthonyJane24",
    title: "A wonderful game for partners",
    text: "This app is a fantastic way to get to know your partner better. It offers insightful questions into things about your partner you may not know or understand. Answers you receive today may change in a years time as well. I highly recommend this to any couple regardless of the current length of their relationship.",
  },
  {
    author: "Niece.doll",
    title: "Great game with smooth design",
    text: "This is such a great game to get to know someone. The questions are unique and help you get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale.",
  },
  {
    author: "Angelina, bird enthusiast",
    title: "Not really a “game” but great",
    text: "So I found out about it because a friend of mine was using it as a mediative introspection tool. I really liked some of the questions he showed me so I bought a couple of bundles. My friends and I played it together and had a lot of fun.",
  },
  {
    author: "Remark Bil",
    title: "New favourite",
    text: "So fun! Best drinking game we have ever found and we’ve tried quite a few!",
  },
  {
    author: "jp2065",
    title: "Can this shock you if you lie?",
    text: "Hilarious app. My friends and I used it for a gals night and had so much fun.",
  },
  {
    author: "mollhds",
    title: "Very good questions",
    text: "This is the first app I found which has really good truth or dare questions! I would recommend it to others, great for pre drinks or having a laugh with your mates.",
  },
  {
    author: "iMonkey.",
    title: "Good for predrinks",
    text: "Used this with some friends I had over last Friday before we went out and everyone loved it.",
  },
];

const featuredReviewIndices = [0, 1, 2, 3];

// Each bubble enters from its own corner with a tiny overshoot pop.
const BUBBLE_OFFSETS: Record<string, { x: number; y: number }> = {
  "top-left": { x: -40, y: -20 },
  "top-right": { x: 40, y: -20 },
  "bottom-left": { x: -40, y: 20 },
  "bottom-right": { x: 40, y: 20 },
};

// Stagger per-position so the 4 bubbles fan in sequentially.
const BUBBLE_DELAYS: Record<string, number> = {
  "top-left": 0.07,
  "top-right": 0.15,
  "bottom-left": 0.23,
  "bottom-right": 0.31,
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function ReviewBubble({
  review,
  position,
  anchorId,
}: {
  review: { author: string; text: string };
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  anchorId?: string;
}) {
  const offset = BUBBLE_OFFSETS[position];
  const delay = BUBBLE_DELAYS[position];
  return (
    <motion.article
      id={anchorId}
      className={`reviews-bubble reviews-bubble--${position}${anchorId ? " reviews-anchor-target" : ""}`}
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.88 }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        ease: EASE_OUT,
        delay,
        scale: {
          type: "spring",
          stiffness: 240,
          damping: 18,
          delay,
        },
      }}
    >
      <div className="reviews-bubble-card">
        <p>{review.text}</p>
      </div>
      <div className="reviews-bubble-footer" aria-hidden="true">
        <div className="reviews-bubble-tail-dots">
          <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--big" />
          <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--small" />
        </div>
        <div className="reviews-bubble-avatars">
          <span className="reviews-bubble-username">{review.author}</span>
        </div>
      </div>
    </motion.article>
  );
}

export default function ReviewsSection() {
  const { triggerDownload } = useDownload();
  const featuredReviews = featuredReviewIndices.map((i) => appStoreReviews[i]);

  return (
    <section
      id="reviews"
      className="reviews-paired relative overflow-hidden"
    >
      <span id="reviews-anchor" className="section-anchor-mid" aria-hidden />
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
      </div>

      <div className="site-shell reviews-paired-stage">
        <RevealIn preset="scale" amount={0.35}>
          <div className="reviews-paired-pill" aria-label="Bevy social proof">
            <span>Join 25K+ players around the globe</span>
          </div>
        </RevealIn>

        <RevealIn delay={0.1} amount={0.35}>
          <h2
            id="reviews-heading"
            className="reviews-paired-title section-anchor-title"
          >
            4.7 out of 5 on the App Store, from real players and real game
            nights.
          </h2>
        </RevealIn>

        <RevealIn delay={0.22} amount={0.35} preset="scale">
          <motion.button
            className="reviews-paired-cta"
            onClick={triggerDownload}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          >
            Try Bevy
          </motion.button>
        </RevealIn>

        <ReviewBubble
          review={featuredReviews[0]}
          position="top-left"
          anchorId="reviews-top"
        />
        <ReviewBubble review={featuredReviews[1]} position="top-right" />
        <ReviewBubble review={featuredReviews[2]} position="bottom-left" />
        <ReviewBubble review={featuredReviews[3]} position="bottom-right" />
      </div>
    </section>
  );
}
