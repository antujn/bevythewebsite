"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDownload } from "./DownloadContext";

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

export default function ReviewsSection() {
  const { triggerDownload } = useDownload();
  const featuredReviews = featuredReviewIndices.map((index) => appStoreReviews[index]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`reviews-paired relative overflow-hidden${isVisible ? " reviews-paired--visible" : ""}`}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/illustrations/background/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-22"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/56 via-black/60 to-black/70" />
      </div>
      <div className="site-shell reviews-paired-stage">
        <div className="reviews-paired-pill" aria-label="Bevy social proof">
          <span>Join 10,000+ players</span>
        </div>

        <h2 className="reviews-paired-title">
          4.7 out of 5 on the App Store, from real players and real game
          nights.
        </h2>

        <button className="reviews-paired-cta" onClick={triggerDownload}>
          Try Bevy
        </button>

        <article className="reviews-bubble reviews-bubble--top-left">
          <div className="reviews-bubble-card">
            <p>{featuredReviews[0].text}</p>
          </div>
          <div className="reviews-bubble-footer" aria-hidden="true">
            <div className="reviews-bubble-tail-dots">
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--big" />
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--small" />
            </div>
            <div className="reviews-bubble-avatars">
              <span className="reviews-bubble-username">{featuredReviews[0].author}</span>
            </div>
          </div>
        </article>

        <article className="reviews-bubble reviews-bubble--top-right">
          <div className="reviews-bubble-card">
            <p>{featuredReviews[1].text}</p>
          </div>
          <div className="reviews-bubble-footer" aria-hidden="true">
            <div className="reviews-bubble-tail-dots">
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--big" />
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--small" />
            </div>
            <div className="reviews-bubble-avatars">
              <span className="reviews-bubble-username">{featuredReviews[1].author}</span>
            </div>
          </div>
        </article>

        <article className="reviews-bubble reviews-bubble--bottom-left">
          <div className="reviews-bubble-card">
            <p>{featuredReviews[2].text}</p>
          </div>
          <div className="reviews-bubble-footer" aria-hidden="true">
            <div className="reviews-bubble-tail-dots">
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--big" />
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--small" />
            </div>
            <div className="reviews-bubble-avatars">
              <span className="reviews-bubble-username">{featuredReviews[2].author}</span>
            </div>
          </div>
        </article>

        <article className="reviews-bubble reviews-bubble--bottom-right">
          <div className="reviews-bubble-card">
            <p>{featuredReviews[3].text}</p>
          </div>
          <div className="reviews-bubble-footer" aria-hidden="true">
            <div className="reviews-bubble-tail-dots">
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--big" />
              <span className="reviews-bubble-tail-dot reviews-bubble-tail-dot--small" />
            </div>
            <div className="reviews-bubble-avatars">
              <span className="reviews-bubble-username">{featuredReviews[3].author}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
