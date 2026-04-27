# Bevy the Website

Marketing, discovery, and SEO/GEO surface for the Bevy iOS app.

- Live: [https://bevythewebsite.vercel.app/](https://bevythewebsite.vercel.app/)
- App Store: [Bevy on the App Store](https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490)
- Stack: Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4 + Motion 12

> "Reads as the same product the app is." Every visual element on the site mirrors the in-app palette, typography, and bundle metadata so the site, the App Store previews, and the app itself feel like one continuous experience.

## What's New Since The Previous README

This README has been rewritten end-to-end. Highlights of what's been added since the old one (which only described the homepage + legal routes + the original preview download flow):

- **GEO + SEO infrastructure** — `llms.txt`, `llms-full.txt`, explicit AI-crawler allowlist in `robots.ts`, `@graph`-style JSON-LD with cross-referenced `MobileApplication` / `Organization` / `Person` / `WebSite`, FAQPage / BreadcrumbList / Article / SoftwareApplication / ItemList structured data per route, `max-snippet=-1` directives, generated 1200×630 OG share card, Apple Smart Banner, Bing + Google Search Console verification.
- **New crawlable routes** — `/faq`, `/compare`, `/changelog`, `/press`, `/bundles/<slug>` (×11), `/.well-known/apple-app-site-association`, `/.well-known/security.txt`, `/llms.txt`, `/llms-full.txt`, plus a fully-rebuilt `/404`.
- **Lighthouse CI** in `.github/workflows/lighthouse.yml` enforcing per-route SEO/A11y/Performance budgets.
- **Site-wide accessibility pass** — `MotionProvider` (`prefers-reduced-motion`), skip-link, focus-trap in the Previews modal, keyboard focus styling, BfcacheGuard for back-nav reliability.
- **Previews modal v2** — three top-level tabs (Slides · Videos · Icons). Slides rail unchanged; Videos tab plays three React-driven preview reels (30s / 50s / 90s) with fullscreen-for-screen-recording; Icons tab renders the bundle + premium app icons with a "Download All as 1024×1024 PNG" exporter that names files to match `bevytheapp/Shared/Assets.xcassets/appIcons/`.
- **Two new homepage sections** — `GameplaySection` (5 gameplay modes incl. Custom Mode + Achievements) and `FaqSection` (flippable card rail).
- **Two-dial draggable 3D coverflow** for `BundlesShowcase` (replaces old left/right list).
- **Smart download CTA** — iPhone goes direct to App Store, iPad/desktop opens a QR modal, Android sees a clear "iPhone-only" note.
- **Hero, FeatureDeck, Reviews, Footer polish** — couplet headlines, fly-off feature cards, scroll progress bar, restored alternating illustrations, unified site background, ember/wine palette.
- **Vercel Analytics** wired up via `@vercel/analytics`.
- **Sitemap.ts + robots.ts** auto-generated from the bundle + changelog catalogs.
- **Apple Universal Links** via `applinks:` JSON published at `/.well-known/apple-app-site-association`.
- Dropped the Playwright preview exporter; in-modal client-side `modern-screenshot` is the single export path.

See `git log` for the full per-commit history. Recent notable themes:

- "Make the site LLM-friendly" — `/llms.txt`, AI-crawler allowlist, `max-snippet` hints
- "Ship full discoverability audit pass" — sitemap, robots, structured data, OG image, smart banner, manifest
- "Ship everything-else pass" — `/faq`, `/compare`, `/changelog`, `/llms-full.txt`, entity graph, ItemList JSON-LD
- "Reload on back-from-404 via sessionStorage beacon handoff" + bfcache fixes — motion reliability across navigation

## Tech Stack

| Layer | Tech | Notes |
| --- | --- | --- |
| Framework | Next.js 16.2.x (App Router, Turbopack) | Server components by default; `"use client"` only where needed |
| UI | React 19.2 | |
| Language | TypeScript 5 (strict) | |
| Styling | Tailwind CSS 4 + custom `globals.css` | Single CSS file with design tokens (`--bg-base`, `--cream`, `--ember-bright`, `--crimson`) |
| Motion | Motion 12 (a.k.a. framer-motion) | Wrapped in `<MotionProvider reducedMotion="user">` |
| Fonts | Playfair Display (display), Plus Jakarta Sans (body) | Vendored as TTF for OG image generation |
| Linting | ESLint 9 (`eslint-config-next`) | Run with `npm run lint` |
| Analytics | `@vercel/analytics` | Privacy-friendly, no PII |
| Performance budget | Lighthouse CI | Per-route assertions on PRs + `main` |

## Routes

```text
/                            Homepage (hero, features, bundles, gameplay, reviews, FAQ)
/bundles/<slug>              11 per-bundle SEO landing pages (statically generated)
/faq                         Standalone, fully-expanded FAQ (FAQPage JSON-LD)
/compare                     "Bevy vs traditional Truth or Dare" (Article JSON-LD)
/changelog                   Release history (SoftwareApplication JSON-LD with hasPart)
/press                       Press kit + brand assets (Article JSON-LD)
/privacy /terms /disclaimer  Legal (shared route group with stable layout)
/404                         Custom not-found with deck-of-cards rail

# File-convention routes
/sitemap.xml                 Generated from bundleCatalog + changelog
/robots.txt                  Default + explicit AI-crawler allowlist
/manifest.webmanifest        PWA manifest
/opengraph-image             1200×630 generated OG/Twitter share card

# Plain-text and well-known endpoints
/llms.txt                    Concise summary for LLMs (~4KB)
/llms-full.txt               Deep-context dump (FAQ + bundles + changelog inlined)
/humans.txt                  Author/team manifest
/.well-known/apple-app-site-association   Apple Universal Links payload
/.well-known/security.txt    RFC 9116 vulnerability-disclosure contact
```

## Project Structure

```text
src/
  app/
    layout.tsx                root metadata + JSON-LD @graph + DownloadProvider/MotionProvider/BfcacheGuard
    page.tsx                  homepage composition + ItemList JSON-LD for the 11 bundles
    globals.css               design tokens + every section's bespoke styles
    not-found.tsx             server component (intentionally) for clean back-nav
    opengraph-image.tsx       1200×630 OG card via `next/og`
    sitemap.ts                generated from bundleCatalog + changelog
    robots.ts                 default rule + AI-crawler allowlist
    manifest.ts               PWA manifest
    icon.png / apple-icon.png Favicons (Next file conventions)

    bundles/[slug]/page.tsx   11 statically-generated SEO landing pages
    faq/page.tsx              standalone FAQ with FAQPage + Breadcrumb JSON-LD
    compare/page.tsx          comparison page with Article JSON-LD
    changelog/page.tsx        release history with SoftwareApplication JSON-LD
    press/page.tsx            press kit + downloadable assets

    (legal)/                  shared route group
      layout.tsx              Article JSON-LD, breadcrumbs, last-updated date
      privacy/page.tsx
      terms/page.tsx
      disclaimer/page.tsx

    .well-known/
      apple-app-site-association/route.ts   Apple Universal Links
      security.txt/route.ts                 RFC 9116 contact
    llms.txt/route.ts                       LLM summary
    llms-full.txt/route.ts                  LLM deep context

    fonts/                    Vendored TTFs (used by opengraph-image.tsx)

  components/
    Header.tsx                Nav + Previews modal (Slides / Videos / Icons tabs)
    HeroSection.tsx           Hero with auto-cycling video mock
    FeatureDeck.tsx           Sticky scroll-driven feature deck w/ fly-off cards
    BundlesShowcase.tsx       Two-dial 3D coverflow over the 11 bundles
    GameplaySection.tsx       5 gameplay modes (Finger, Alias, AI, Custom, Achievements)
    ReviewsSection.tsx        Floating-bubble testimonials stage
    FaqSection.tsx            Flippable card rail (canonical answers from src/lib/faq.ts)
    Footer.tsx                Legal + social links + App Store CTA

    DownloadButton.tsx        App Store badge wrapper
    DownloadContext.tsx       Smart download flow: iPhone direct, iPad/desktop QR, Android note
    TryBevyButton.tsx         Editorial inline CTA pill (routes through DownloadContext)
    PreviewIcons.tsx          Icons tab in modal — renders 13 app-icon variants and exports PNGs
    ScrollProgressBar.tsx     Top-of-viewport progress bar (springs)
    RevealIn.tsx              Scroll-triggered fade/slide reveal primitives
    MotionProvider.tsx        Wraps the tree in `MotionConfig reducedMotion="user"`
    BfcacheGuard.tsx          Reload on bfcache restore / back-forward / soft-back-from-404
    NotFoundBeacon.tsx        Companion to BfcacheGuard for back-from-404 reload

    previewSlides.ts          10-slide App Store preview deck used by the modal Slides tab
    preview-videos/           React port of the Stage/Sprite system that powers /Videos tab
      animations.tsx          Stage / Sprite primitives + StageHandle imperative API
      bevyShared.tsx          Shared visual primitives (PhoneFrame, KenBurns, Vignette, …)
      appPreviewScenes.tsx    Scenes shared between 30s/50s reels
      AppPreview30s.tsx       30-second App Store preview reel
      AppPreview50s.tsx       50-second App Store preview reel
      CinematicTrailer90s.tsx 90-second cinematic trailer
      PreviewVideos.tsx       Video tab switcher + fullscreen toggle

  lib/
    appStore.ts               APP_STORE_ID / APP_STORE_URL / APP_FULL_NAME single-source-of-truth
    bundles.ts                11-bundle catalog (slug, label, hex accent, narrative, topics)
    faq.ts                    8-question FAQ catalog + buildFaqPageJsonLd()
    changelog.ts              Release history (newest first) — drives /changelog + /llms-full.txt + sitemap freshness

public/
  icon-192.png / icon-512.png        PWA icons (manifest references these)
  humans.txt                         Author/team manifest
  videos/                            Hero + gameplay clips (.mp4 + .webm pairs)
  images/
    icons/                           Site icons (logo, social, App Store badges) — `bevy-logo.png` is the canonical Bevy silhouette used everywhere
    bundles/                         11 bundle screenshots (one per bundle)
    backgrounds/                     Section background art
    illustrations/                   Feature deck artwork (illustration1–8.jpg)
    mockups/                         iPhone mockup PNGs
    previews/                        Preview-modal assets (claude_design WIP folder lives here)
    qrs/                             QR codes for the desktop/iPad download modal
```

## Key Pages and Interactions

### Homepage (`src/app/page.tsx`)

Renders, in order:

1. `ScrollProgressBar` — thin ember bar pinned to the top of the viewport
2. `Header` — fixed nav, opens Previews modal
3. `HeroSection` — auto-cycling mock video + couplet headline
4. `FeatureDeck` — scroll-driven sticky deck with fly-off cards
5. `BundlesShowcase` — two-dial 3D coverflow for the 11 bundles
6. `GameplaySection` — 5 gameplay-mode cards
7. `ReviewsSection` — App Store testimonials with floating bubbles
8. `FaqSection` — flippable card rail
9. `Footer`

Plus an `ItemList` JSON-LD block enumerating every bundle with deep-link sub-page URLs.

### Per-bundle pages (`src/app/bundles/[slug]/page.tsx`)

Statically generated for each entry in `src/lib/bundles.ts`. Per page:

- Custom `<title>` and `<meta description>` derived from the bundle's category + label
- Canonical URL pinned to `/bundles/<slug>`
- BreadcrumbList JSON-LD ("Home › Bundles › <bundle name>")
- Hero copy + topic list + accent-tinted hero card
- "Try <bundle> in Bevy" CTA → App Store

### `/faq` — Frequently Asked Questions

- Same 8 questions as the homepage card rail, but fully expanded in static HTML
- FAQPage + BreadcrumbList JSON-LD
- All canonical answers come from `src/lib/faq.ts` (`buildFaqPageJsonLd()` is shared between /faq and the homepage rail)

### `/compare` — Bevy vs Traditional Truth or Dare

- 8-row feature-by-feature comparison table
- Article + BreadcrumbList JSON-LD
- High-value "GEO" page — LLMs cite comparison tables well

### `/changelog`

- Release history rendered newest-first
- SoftwareApplication JSON-LD with `hasPart` for every prior release, so LLMs can answer "what changed in Bevy 2.0?"
- `lastModified` of every other route in the sitemap is derived from `changelog[0].date`

### `/press`

- Press one-liner, quick-facts table, downloadable brand assets
- Article JSON-LD

### `/llms.txt` and `/llms-full.txt`

- `/llms.txt` → ~4KB Markdown summary keyed on the [llmstxt.org](https://llmstxt.org/) convention
- `/llms-full.txt` → deep-context dump: site summary + every bundle narrative + every FAQ + every release note in one file
- Both served as `text/plain; charset=utf-8` with aggressive cache headers

### Previews modal (`src/components/Header.tsx`)

Three top-level tabs:

| Tab | Source | Behavior |
| --- | --- | --- |
| `Slides` | `previewSlides.ts` (10 slides) | Horizontal rail + per-slide JPEG export at App Store dimensions (1320×2868) via `modern-screenshot` |
| `Videos` | `preview-videos/*` | Sub-tabs for `30s` / `50s` / `90s` React-driven preview reels. Fullscreen toggle for screen recording (no in-browser MP4 export) |
| `Icons` | `PreviewIcons.tsx` | Renders 13 app-icon variants (11 bundle accents + 2 premium gradients). `Download All` exports each as a 1024×1024 PNG named `BevyDark<Color>Icon.png` to match `bevytheapp/Shared/Assets.xcassets/appIcons/` |

Modal is keyboard-accessible (focus trap, Esc-to-close, focus restored to trigger on close).

### Smart download flow (`src/components/DownloadContext.tsx`)

`useDownload().triggerDownload()` opens one of three modals depending on UA:

- **iPhone / iPod** → opens the App Store directly
- **iPad / desktop / unknown** → QR modal (scan with iPhone)
- **Android** → "iPhone-only" note with App Store CTA disabled

Used by `DownloadButton`, `TryBevyButton`, FAQ "Try for free" inline links, and the footer.

## SEO + GEO

Search Engine Optimization + Generative Engine Optimization (showing up well in LLM answers, not just SERPs) are first-class concerns. Key surfaces:

### Metadata + indexability

`src/app/layout.tsx`:

- `metadataBase` derived from `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL` / localhost
- Title template `"%s · Bevy"` so every sub-route auto-frames
- Canonical `/` per Google best-practice (preview deployments stay out of the index)
- `robots: { googleBot: { "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } }` — explicitly opens up snippet length, image preview size, and video preview duration
- `verification.google` and `verification.other.msvalidate.01` for Search Console + Bing Webmaster Tools
- Apple Smart Banner via `appleWebApp` + `apple-itunes-app` meta with deep-linkable `app-argument`

### Structured data (JSON-LD)

Page-by-page coverage:

| Route | JSON-LD types |
| --- | --- |
| Every page (root layout) | `MobileApplication` + `Organization` + `Person` + `WebSite` (single `@graph` with cross-references via `@id`) |
| `/` | + `ItemList` enumerating the 11 bundles |
| `/bundles/<slug>` | + `BreadcrumbList` |
| `/faq` | `FAQPage` + `BreadcrumbList` |
| `/compare` | `Article` + `BreadcrumbList` |
| `/changelog` | `SoftwareApplication` w/ `hasPart` per release + `BreadcrumbList` |
| `/press` | `Article` |
| `(legal)` | `Article` (with `dateModified` from `LEGAL_LAST_UPDATED`) + `BreadcrumbList` |

JSON-LD is rendered inline as `<script type="application/ld+json">` so crawlers see it in the initial HTML response without waiting for client-side hydration.

### Open Graph + Twitter Cards

- `src/app/opengraph-image.tsx` generates a 1200×630 PNG once at build time (`next/og`) using vendored TTF fonts
- Cards consistent across iMessage, Slack, Discord, Twitter, etc.
- Per-route `openGraph` blocks override the title + description for sub-pages

### Sitemap + Robots

- `src/app/sitemap.ts` enumerates every crawlable URL with explicit `priority` and `changeFrequency`. `lastModified` for marketing routes is bound to `changelog[0].date` (= when the app last shipped).
- `src/app/robots.ts` declares an explicit allowlist for AI crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, PerplexityBot, CCBot, …) on top of the default `*` rule. Disallowing one is a one-line change.

### LLM-specific surfaces

- `/llms.txt` (concise) and `/llms-full.txt` (deep) per the [llmstxt.org](https://llmstxt.org/) convention
- `humans.txt` for tooling that follows the older `humans.txt` convention
- AI-crawler explicit allowlist in `robots.ts`
- All structured data uses `@graph` with `@id` cross-references — gives LLMs a stable internal reference graph rather than disconnected entities

### Per-page metadata

Every route exports its own `metadata` (or `generateMetadata` for dynamic routes) so Google + Bing index rich titles, descriptions, and canonical URLs per page rather than re-using the root.

### Performance budget

`.github/workflows/lighthouse.yml` + `lighthouserc.json` run Lighthouse against `/`, `/faq`, `/compare`, `/bundles/significant-other`, `/press`, and `/changelog` on every PR and push to `main`. The check fails if SEO drops below 0.95 or Accessibility drops below 0.95.

## Accessibility

- `MotionProvider` wraps the tree with `<MotionConfig reducedMotion="user">`. Users with `prefers-reduced-motion: reduce` get opacity-only entrance animations; no parallax, springs, coverflow tilts, or word-staggers.
- Skip-link (`<a href="#main">Skip to main content</a>`) appears on first focus.
- Site-wide keyboard focus ring styled in `globals.css`.
- Previews modal traps focus and restores it to the trigger on close.
- Every interactive element has accessible labels (`aria-label` / visible text).

## Reliability

- `BfcacheGuard` reloads the page when:
  - Safari/Chrome restores from bfcache (`pageshow` with `event.persisted === true`)
  - Hard back-forward navigation fires (`PerformanceNavigationTiming.type === "back_forward"`)
  - User soft-navigates back from `/404` (via the `NotFoundBeacon` sessionStorage handoff)
- `not-found.tsx` is intentionally a Server Component to avoid back-nav restoring stale React tree from the client router cache.
- Reload guard with 2s cooldown to prevent loops.

## Universal Links + Security

- `/.well-known/apple-app-site-association` published as `application/json` with the `applinks` payload pointing at `bevy.bevy` under team `G5B6B4Y2T5`. iOS picks this up so any URL on the domain opens the Bevy app on devices with it installed.
- `/.well-known/security.txt` (RFC 9116) advertises the disclosure contact + canonical URL + expiry. Bump the `Expires` date when it approaches.

## Single Sources of Truth

| File | Drives |
| --- | --- |
| `src/lib/bundles.ts` | Bundle dial, all 11 `/bundles/<slug>` pages, sitemap, llms.txt, llms-full.txt, ItemList JSON-LD on `/`, BundlesShowcase, FAQ inline links |
| `src/lib/faq.ts` | Homepage FAQ rail, `/faq` page, llms-full.txt, FAQPage JSON-LD on both surfaces |
| `src/lib/changelog.ts` | `/changelog` page, sitemap `lastModified` for every marketing route, llms-full.txt, SoftwareApplication JSON-LD |
| `src/lib/appStore.ts` | Every CTA, JSON-LD `MobileApplication.downloadUrl`, smart banner `app-id`, AASA `appstoreID`, Footer App Store link |

When the iOS app ships a new bundle: add it to `bundleCatalog`, drop the screenshot into `public/images/bundles/`, and the rest (sitemap entry, ItemList, llms files, /bundles/<slug> page) regenerates at build time.

## Development

```bash
npm install
npm run dev         # Turbopack dev server on :3000
npm run lint        # ESLint with eslint-config-next
npm run build       # production build
npm run start       # serve the production build
```

Useful: `npx --yes @lhci/cli@0.14.x autorun` reproduces the Lighthouse CI check locally.

## Deployment (Vercel)

Production lives at [https://bevythewebsite.vercel.app/](https://bevythewebsite.vercel.app/).

Steps to redeploy on Vercel:

1. Push to GitHub.
2. Import (or auto-redeploy) at [https://vercel.com/new](https://vercel.com/new).
3. Defaults are correct (Framework: Next.js · Build: `next build` · Output: `.next`).
4. Verify after deploy:
   - `/` `/faq` `/compare` `/changelog` `/press` `/bundles/significant-other`
   - `/sitemap.xml` `/robots.txt` `/llms.txt` `/llms-full.txt`
   - `/.well-known/apple-app-site-association` `/.well-known/security.txt`
   - `/opengraph-image` (PNG)
   - `/manifest.webmanifest`

`metadataBase` is wired to `VERCEL_PROJECT_PRODUCTION_URL` so previews stay out of the canonical index automatically.

## Design Inspiration

- [Paired](https://www.paired.com/) — social-proof framing, conversation-first storytelling, section pacing.
- [Flo Health](https://flo.health/) — editorial composition, premium dark aesthetic, guided scroll flow.

## Asset Notes

- Bundle screenshots: `public/images/bundles/bundle-<slug>.png` (one per bundle defined in `src/lib/bundles.ts`)
- Hero + gameplay videos: `public/videos/<name>.{mp4,webm}` (every clip ships both, browser picks)
- Feature deck art: `public/images/illustrations/illustration1.jpg`–`illustration8.jpg`
- Icon-export source logo: `public/images/icons/bevy-logo.png` (the canonical Bevy silhouette used across the site; the Icons-tab exporter draws the tile background dynamically and, for premium tiers, recolors the logo at draw time via per-tier gradient masking — see `PREMIUM_LOGO_STOPS` in `PreviewIcons.tsx`)
- The `public/images/previews/claude_design/` folder is a working scratchpad and may be deleted; the runtime no longer depends on anything inside it (asset migration was done when the Icons-tab feature shipped).
