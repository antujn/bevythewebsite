"use client";

import { useState } from "react";

const reviews = [
  // Row 1 — diverse use cases, strongest voices
  {
    author: "DukeNeuk",
    text: "I'm working at a hostel in Bali and one of my guests had the app. We started playing every morning and it brings the group together so effortlessly — complete strangers opening up like old friends. Give it a try with new people or old and get your party started!",
  },
  {
    author: "AnthonyJane24",
    text: "This app is a fantastic way to get to know your partner on a deeper level. It asks things you'd never think to ask yourself. Answers you receive today may change in a year's time as well. I'd recommend this to any couple regardless of how long they've been together.",
  },
  {
    author: "Niece.doll",
    text: "The questions are unique and actually get more than one-word answers. I use it inside of dating apps when the conversation goes kinda stale — completely changes the energy. It's become my secret weapon for first dates.",
  },
  // Row 2 — more social proof, different angles
  {
    author: "Angelina",
    text: "A friend of mine was using it as a meditative introspection tool, which I thought was beautiful. I bought a couple of bundles and my friends and I played together — we ended up talking for hours about things we'd never brought up before.",
  },
  {
    author: "mollhds",
    text: "First app I've found that actually has good truth or dare questions. Not the cringy stuff you find everywhere else. Great for pre-drinks or just having a proper laugh with your mates.",
  },
  {
    author: "iMonkey.",
    text: "Had some friends over last Friday before we went out and pulled this up on a whim. Everyone loved it. We almost didn't leave the house.",
  },
  // Hidden row — overflow
  {
    author: "J.Reeves",
    text: "We play this every time we travel together now. The Point Break bundle is perfect for road trips — it turns those long drives into actual conversations instead of everyone being on their phones.",
  },
  {
    author: "sophiamtz",
    text: "Downloaded this for a girls' night and now it's a staple. The questions hit different — they're thoughtful without being heavy. You learn things about people you thought you already knew everything about.",
  },
  {
    author: "carter.wb",
    text: "My therapist actually recommended something like this for our couples sessions. Bevy does it better than anything she suggested. The Significant Other bundle is genuinely well written.",
  },
];

const VISIBLE_COUNT = 6;

export default function ReviewsSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, VISIBLE_COUNT);

  return (
    <section className="section-space">
      <div className="site-shell">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
          }}
        >
          <p className="kicker">Reviews</p>
          <h2 className="section-title">What people are saying.</h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
        </article>

        <div className="reviews-grid">
          {visible.map((review) => (
            <blockquote key={review.author} className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">&ldquo;{review.text}&rdquo;</p>
              <cite className="review-author">— {review.author}</cite>
            </blockquote>
          ))}
        </div>

        {reviews.length > VISIBLE_COUNT && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="review-toggle"
            >
              {expanded ? "Show less" : `Show ${reviews.length - VISIBLE_COUNT} more`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
