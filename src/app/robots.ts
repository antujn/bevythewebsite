import type { MetadataRoute } from "next";

function getSiteUrl(): string {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * Every crawler covered by the default `*` rule already includes the
 * major LLM/AI crawlers by inheritance, but listing them explicitly
 * here is a signal-of-intent: "yes, you are welcome to fetch this site
 * and use it to answer questions about Bevy." Most of these crawlers
 * respect robots.txt per their published docs (OpenAI, Anthropic,
 * Google-Extended, Perplexity, Apple Intelligence, Common Crawl).
 *
 * The explicit Allow rules don't change behaviour — they exist so the
 * intent is visible to humans reading the file (journalists, AI policy
 * researchers) and to downstream tools that surface "this site welcomes
 * AI crawlers."
 *
 * If Bevy ever wants to OPT OUT of any specific crawler (e.g. block
 * CCBot so content isn't scraped into future Common Crawl training
 * sets), flip its `allow` to `disallow` and it takes effect on next
 * fetch — no code change beyond this file.
 */
const AI_CRAWLERS: string[] = [
  // OpenAI
  "GPTBot",           // Training-data crawler
  "ChatGPT-User",     // User-initiated fetches from ChatGPT
  "OAI-SearchBot",    // OpenAI SearchGPT
  // Anthropic
  "ClaudeBot",        // Training + real-time fetch
  "Claude-Web",       // Claude.ai user-triggered fetches
  "anthropic-ai",     // Legacy Anthropic UA
  // Google
  "Google-Extended",  // Gemini / Vertex AI training opt-in
  // Apple
  "Applebot-Extended",// Apple Intelligence training
  // Perplexity
  "PerplexityBot",    // Perplexity search + AI answers
  "Perplexity-User",  // Perplexity user-triggered fetches
  // Common Crawl — feeds many open LLMs
  "CCBot",
  // Meta
  "Meta-ExternalAgent",
  "FacebookBot",
  // ByteDance
  "Bytespider",
  // You.com
  "YouBot",
  // Cohere
  "cohere-ai",
];

/**
 * Advertise the sitemap, allow every crawler, and echo the intent with
 * explicit per-UA Allow rules for the major AI crawlers.
 *
 * Disallow `/_next/` so nobody wastes crawl budget on Next.js internals.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      // Default rule — every other crawler inherits this.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/"],
      },
      // Explicit AI-crawler allowlist (see comment above for rationale).
      ...AI_CRAWLERS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/_next/"],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
