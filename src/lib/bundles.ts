/**
 * Shared bundle catalog — single source of truth for bundle copy
 * consumed by both the homepage dial (`BundlesShowcase`) and the
 * per-bundle SEO pages (`/bundles/[slug]`).
 *
 * Mirrors the `BevyBundle` enum in bevytheapp's `CardBundle` model.
 * When the app ships a new bundle, add it here + drop a screenshot
 * into `public/images/bundles/` and the static route automatically
 * generates a crawlable landing page.
 */

export type BundleSlug =
  | "significant-other"
  | "early-dating"
  | "the-office"
  | "house-party"
  | "no-strings-attached"
  | "date-night"
  | "not-safe-for-work"
  | "safe-for-work"
  | "baby-making"
  | "point-break"
  | "write-your-own";

export type BundleCategory = "truth" | "dare" | "both";

export type BundleDefinition = {
  slug: BundleSlug;
  label: string;
  category: BundleCategory;
  /** Short marketing description used on the dial + page hero. */
  description: string;
  /** Longer narrative paragraph for the per-bundle page (SEO body). */
  narrative: string;
  /** List of example prompt topics — used for SEO keyword expansion. */
  topics: string[];
  /** Path to the bundle's product screenshot under `public/images/bundles/`. */
  imageSrc: string;
  /** Cinematic accent hex, matches BundleViewModel.swift in bevytheapp. */
  accent: string;
  /** Ideal group setup ("group" | "oneOnOne" | "both"). */
  idealFor: "group" | "oneOnOne" | "both";
};

export const bundleCatalog: BundleDefinition[] = [
  {
    slug: "significant-other",
    label: "Significant Other",
    category: "truth",
    description:
      "Intimate, affectionate and pragmatic questions to ask in a long-term monogamous relationship to bring you closer to your partner.",
    narrative:
      "Built for couples who already know each other well and want prompts that go past small talk. Significant Other leans into emotional intelligence — the questions that surface shared values, unspoken needs, and the little details that get lost between anniversaries.",
    topics: [
      "Love languages & affection",
      "Future planning & big-life decisions",
      "Emotional check-ins & vulnerability",
      "Relationship rituals & shared memories",
      "Physical intimacy & desire",
    ],
    imageSrc: "/images/bundles/bundle-significant-other.png",
    accent: "#610000",
    idealFor: "oneOnOne",
  },
  {
    slug: "early-dating",
    label: "Early Dating",
    category: "truth",
    description:
      "Socially and emotionally intelligent questions to help you develop a great connection with your potential significant other.",
    narrative:
      "For the butterflies-phase: first-date nerves, the third date after the spark, the six-week check-in. Early Dating prompts skip the interview questions and land on the kind of playful, honest reveals that actually show you who someone is.",
    topics: [
      "Playful what-ifs & hypotheticals",
      "Values & dealbreakers",
      "Chemistry & flirting",
      "Past relationships (tastefully)",
      "Vision for the relationship",
    ],
    imageSrc: "/images/bundles/bundle-early-dating.png",
    accent: "#1A3A3D",
    idealFor: "both",
  },
  {
    slug: "the-office",
    label: "The Office",
    category: "truth",
    description:
      "Quirky, entertaining and revealing questions to create laughter, camaraderie, and share secrets and hilarious anecdotes among coworkers.",
    narrative:
      "Turn the Friday happy-hour into a real moment. The Office bundle is clean enough for HR, funny enough for the group chat afterward — anecdotes, quirks, and work-life reveals that make colleagues feel like people.",
    topics: [
      "Career origin stories",
      "Secret work habits & pet peeves",
      "Hilarious office anecdotes",
      "Team-building icebreakers",
      "Dream-job scenarios",
    ],
    imageSrc: "/images/bundles/bundle-the-office.png",
    accent: "#001F2A",
    idealFor: "group",
  },
  {
    slug: "house-party",
    label: "House Party",
    category: "truth",
    description:
      "Playful, hilarious and stimulating questions to ask your party-mates. Ideal to make new friends and banter with them.",
    narrative:
      "The can't-miss bundle for drinks-at-someone's-apartment nights. House Party prompts escalate gently — start polite, end with the whole room leaning in. Works with strangers and long-time friend groups alike.",
    topics: [
      "Wild stories & confessions",
      "Pop-culture rants",
      "Friend-group insider jokes",
      "Playful roasts",
      "Would-you-rather classics (upgraded)",
    ],
    imageSrc: "/images/bundles/bundle-house-party.png",
    accent: "#000000",
    idealFor: "group",
  },
  {
    slug: "no-strings-attached",
    label: "No Strings Attached",
    category: "truth",
    description:
      "Bold questions for casual relationships. Great for sexual partners wanting to share experiences and communicate desires.",
    narrative:
      "Frank, grown, and unapologetically direct. No Strings Attached is designed for people who are comfortable with each other's bodies but want to surface desires, boundaries, and fantasies without the awkward lead-up.",
    topics: [
      "Desires & fantasies",
      "Turn-ons & turn-offs",
      "Boundaries & comfort",
      "Past experiences (shared on terms)",
      "What makes a night unforgettable",
    ],
    imageSrc: "/images/bundles/bundle-no-strings.png",
    accent: "#B3371C",
    idealFor: "oneOnOne",
  },
  {
    slug: "date-night",
    label: "Date Night",
    category: "dare",
    description:
      "Elevate your dates with these novel date ideas. Avoid those conversational clichés that leave you yawning into your pasta at a local date spot.",
    narrative:
      "Date Night replaces the usual small talk with tiny physical dares and playful nudges. Designed to turn an ordinary dinner into a memory — no phone scrolling, no conversational silence, just one small thing after another.",
    topics: [
      "Gentle physical dares",
      "Playful photo challenges",
      "Shared mini-adventures",
      "Compliment-escalation games",
      "Restaurant-table icebreakers",
    ],
    imageSrc: "/images/bundles/bundle-date-night.png",
    accent: "#3A0D1C",
    idealFor: "oneOnOne",
  },
  {
    slug: "not-safe-for-work",
    label: "Not Safe For Work",
    category: "dare",
    description:
      "This bundle is a riot. If you've got a lively group of enthusiastic, exciting individuals craving an unforgettable after-party, this bundle is for you!",
    narrative:
      "Not Safe For Work is the bundle that gets a living room loud. Escalating dares tuned for after-dark groups where everyone is comfortable — spicier than House Party, tamer than an actual strip-game app. Best with consent check-ins enabled in the app.",
    topics: [
      "Spicy group dares",
      "After-party bets & forfeits",
      "Shameless confessions",
      "Flirty challenges (opt-in only)",
      "End-of-night storytelling",
    ],
    imageSrc: "/images/bundles/bundle-nsfw.png",
    accent: "#0D0D18",
    idealFor: "group",
  },
  {
    slug: "safe-for-work",
    label: "Safe For Work",
    category: "dare",
    description:
      "Hilarious and harmless dares for your next game-night with co-workers or family. No unhygienic or pointless tasks, just pure enjoyment.",
    narrative:
      "All of the energy of a game-night dare deck, none of the awkwardness. Safe For Work is family-friendly without being boring — great for holiday gatherings, team off-sites, and nights where kids are in the room.",
    topics: [
      "Silly physical challenges",
      "Accent & impression dares",
      "Family-friendly performance bits",
      "Group photo dares",
      "Kitchen-table competitions",
    ],
    imageSrc: "/images/bundles/bundle-safe-for-work.png",
    accent: "#8C1F43",
    idealFor: "group",
  },
  {
    slug: "baby-making",
    label: "Baby Making",
    category: "dare",
    description:
      "Bored with your usual bedroom routine? Pair with a fellow baby maker and test your trust, coordination and add variety to your love making.",
    narrative:
      "Intimate, trust-building dares designed for partners who already share a bed. Baby Making pairs physical prompts with gentle coordination challenges so the bedroom stays playful, not predictable.",
    topics: [
      "Trust & coordination",
      "Sensory variety",
      "Intimacy rituals",
      "Couple-only challenges",
      "Shared vulnerability",
    ],
    imageSrc: "/images/bundles/bundle-baby-making.png",
    accent: "#00002A",
    idealFor: "oneOnOne",
  },
  {
    slug: "point-break",
    label: "Point Break",
    category: "dare",
    description:
      "Not for the weak! Made for total daredevils to take on extreme sports challenges across the globe and push their limits to new heights.",
    narrative:
      "Surf, ski, bungee, skydive. Point Break is the passport-and-helmet bundle — dares written for friend groups who travel for adrenaline and share the receipts afterwards. Each prompt is a legitimate challenge, not a stunt, and respects local safety laws.",
    topics: [
      "Surfing & board sports",
      "Mountain & snow challenges",
      "Extreme water sports",
      "Bucket-list trip ideas",
      "Adrenaline photography & filming",
    ],
    imageSrc: "/images/bundles/bundle-point-break.png",
    accent: "#002B00",
    idealFor: "both",
  },
  {
    slug: "write-your-own",
    label: "Write Your Own",
    category: "both",
    description:
      "Leverage the intuitive and versatile interface provided by Bevy to write and play your own questions and challenges.",
    narrative:
      "The meta-bundle. Write Your Own turns Bevy into a canvas — compose prompts that fit your crew, save them alongside the stock bundles, and bring them out whenever the moment calls for something hand-written. Perfect for anniversaries, private game nights, and inside-jokes-only rooms.",
    topics: [
      "Custom prompt authoring",
      "Private decks for your crew",
      "Mixing stock + custom cards",
      "Reusable anniversary decks",
      "Inside-joke libraries",
    ],
    imageSrc: "/images/bundles/bevy-write-your-own.png",
    accent: "#444444",
    idealFor: "both",
  },
];

/** Lookup helper for route-level code. */
export function findBundle(slug: string): BundleDefinition | undefined {
  return bundleCatalog.find((b) => b.slug === slug);
}
