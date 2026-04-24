/**
 * Release history — drives the /changelog route.
 *
 * Each entry is a versioned batch of user-visible changes. Keep it
 * short and player-facing (not engineering-facing): the /changelog
 * route is read by real users, journalists, and LLMs to understand
 * "what's new in Bevy lately?". Engineering-only churn doesn't
 * belong here.
 *
 * Ordering: newest first. Dates in ISO `YYYY-MM-DD` so Schema.org's
 * `datePublished` renders correctly without locale ambiguity.
 */

export type ChangelogCategory =
  | "feature"
  | "content"
  | "improvement"
  | "fix";

export type ChangelogEntry = {
  /** Semantic version — matches the App Store build. */
  version: string;
  /** ISO date (YYYY-MM-DD) — also used as `datePublished` in JSON-LD. */
  date: string;
  /** One-line headline shown in large type. */
  headline: string;
  /** Bulleted list of what landed in this release. */
  changes: Array<{ label: ChangelogCategory; text: string }>;
};

export const changelog: ChangelogEntry[] = [
  {
    version: "2.3",
    date: "2026-04-24",
    headline: "Custom Mode + unified design language",
    changes: [
      {
        label: "feature",
        text: "Custom Mode: write and replay your own prompts alongside the stock bundles.",
      },
      {
        label: "content",
        text: "11 bundle accents retuned for a single cinematic wine-black atmosphere. The app, the website, and the App Store previews all read as the same product now.",
      },
      {
        label: "content",
        text: "Widget: Playfair italic cream-gold accent on every slide for consistent editorial flourish.",
      },
      {
        label: "improvement",
        text: "Intelligent contrast: type pill color is now picked by the bundle's brightness instead of its category, so labels stay legible on every card.",
      },
    ],
  },
  {
    version: "2.2",
    date: "2026-03-14",
    headline: "Achievements and long-term replay loop",
    changes: [
      {
        label: "feature",
        text: "Achievements across bundles and game styles. Reward consistency, creativity, and bold gameplay.",
      },
      {
        label: "feature",
        text: "Daily Prompt widget: a fresh card on your home screen between sessions.",
      },
      {
        label: "improvement",
        text: "Faster onboarding — fewer screens between install and first card.",
      },
    ],
  },
  {
    version: "2.1",
    date: "2026-02-02",
    headline: "BevyAI chat reaches every bundle",
    changes: [
      {
        label: "feature",
        text: "BevyAI now answers prompts from every one of the eleven bundles, including the Write Your Own deck.",
      },
      {
        label: "improvement",
        text: "Token model: purchased tokens never expire; premium subscribers get a monthly refill.",
      },
      {
        label: "fix",
        text: "Fixed an Alias Game scoreboard edge case that could drop the final round's points.",
      },
    ],
  },
  {
    version: "2.0",
    date: "2025-12-01",
    headline: "Bevy, reimagined",
    changes: [
      {
        label: "feature",
        text: "Complete rewrite for iOS 17. New game modes (Finger, Alias, BevyAI Play), new bundle architecture, new visual language.",
      },
      {
        label: "content",
        text: "1,000+ new prompts hand-written and reviewed for tone, inclusivity, and social intelligence.",
      },
      {
        label: "content",
        text: "Eleven themed bundles replace the old one-size-fits-all deck.",
      },
    ],
  },
];
