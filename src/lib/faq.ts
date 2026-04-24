/**
 * FAQ catalog — single source of truth for every product question Bevy
 * answers on the website. Consumed by:
 *
 *   - <FaqSection /> on the homepage (flippable card rail UI)
 *   - /faq standalone route (fully-expanded, SEO/LLM-friendly page)
 *   - /llms-full.txt route (plaintext dump for deep LLM context)
 *   - FAQPage JSON-LD emitted by both UI consumers
 *
 * Plain-text answers live in `a`; if a question needs inline links or
 * richer formatting in the UI, provide a separate `render` field in
 * the consumer (the plain `a` string is always the canonical answer
 * for schema purposes).
 */

export type FaqItem = {
  /** Question text — matches the `name` field in FAQPage JSON-LD. */
  q: string;
  /**
   * Plain-text answer. Used verbatim by:
   *   - FAQPage JSON-LD (Google + LLM parsing)
   *   - /faq page body
   *   - /llms-full.txt body
   *
   * Any rich formatting (links, emphasis) belongs in the consumer,
   * not here — this string must read correctly without markup.
   */
  a: string;
};

export const faqItems: FaqItem[] = [
  {
    q: "Who is Bevy for?",
    a: "Couples looking for deeper conversation, friend groups tired of the same twenty recycled prompts, daters trying to move past small talk, and anyone who wants a card game that leans on real conversation. You can also play quietly. BevyAI\u2019s chat lets you scroll prompts and get thoughtful answers one at a time.",
  },
  {
    q: "What makes Bevy different from other Truth or Dare apps?",
    a: "Every card is hand-written and reviewed for tone, inclusivity, and social intelligence. No recycled internet lists, no cringe prompts, no dares that leave someone out. Eleven bundles are tuned to specific moods (Significant Other, Date Night, House Party, NSFW, and more), so you pick the vibe upfront. The writing draws on TikTok trends, Reddit threads, and shows like Love Island and The Office, aiming for the opposite of what you remember from middle-school truth or dare.",
  },
  {
    q: "Is it safe and inclusive?",
    a: "Yes. Every card is written to be inclusive across identities, orientations, and comfort levels. NSFW bundles are separate and opt-in, so you pick the intensity upfront. You can exclude any card from your deck and it won\u2019t come back. Nothing asks anyone to do something illegal, dangerous, or degrading. If a card ever misses the mark, you can report it in-app.",
  },
  {
    q: "Is it free?",
    a: "The core app is free, with a starter bundle and a 7-day trial of Bevy Premium Edition on first install. Subscribe to Premium for access to every bundle and extra daily BevyAI tokens. Tokens are a separate currency used for BevyAI replies and can be purchased in packs. Purchased tokens never expire. No ads, ever. Check the App Store listing for the latest pricing and plans.",
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
    a: "BevyAI answers prompts. You choose a prebuilt card from any of the eleven bundles, tap it, and BevyAI reads back a thoughtful answer. It costs one token per reply. Each reply sends only the card\u2019s numeric prompt ID to our backend. No card text, no custom content, no history, and no personal information. Custom cards you write yourself stay local and aren\u2019t answered by BevyAI yet.",
  },
  {
    q: "How old do I need to be?",
    a: "Bevy is intended for users 18 and up. Apple rates the app 13+ because the built-in bundles include infrequent mature themes, but our Terms of Service require all users to be at least 18. NSFW bundles go further in that direction. If you\u2019re under 18, please use a different app.",
  },
];

/** Schema.org FAQPage JSON-LD built from the shared catalog. */
export function buildFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
