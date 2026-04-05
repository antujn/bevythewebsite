# Bevy — Truth or Dare. Reimagined.

Marketing website for the Bevy iOS app. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

**Live:** Deployed on Vercel  
**App Store:** [Bevy on the App Store](https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + custom CSS |
| Fonts | Playfair Display (display), Inter (body) |
| Deployment | Vercel |

---

## Project Structure

```
src/
  app/
    page.tsx              # Main landing page (composes all sections)
    layout.tsx            # Root layout, metadata, fonts, OG tags
    globals.css           # All custom CSS (variables, components, animations)
    privacy/page.tsx      # Privacy Policy
    terms/page.tsx        # Terms of Service
    disclaimer/page.tsx   # Legal Disclaimer
  components/
    Header.tsx            # Fixed header with scroll-aware transparency + fullscreen menu
    Footer.tsx            # CTA band + legal links + social icons
    HeroSection.tsx       # Hero with title, subtitle, App Store CTA, two phone mocks
    FeatureSection.tsx    # Reusable zigzag editorial section (copy + illustration)
    QuoteBreak.tsx        # Centered italic quote with gold line divider
    BundlesShowcase.tsx   # Bundles section with truth/dare phone mock strips
    ReviewsSection.tsx    # App Store reviews in a 3-column grid
    PhoneMock.tsx         # Reusable iPhone 17 Pro mock with screen overlay
    LegalLayout.tsx       # Shared layout for all legal pages (nav, title, footer)
    TaglineSection.tsx    # Unused (kept for reference)
public/
  images/
    icons/                # App logo, App Store badges, social icons
    illustrations/        # Editorial background illustrations (1-9)
    mockups/              # iPhone 17 Pro flat mockup frame
    screens/              # App screenshots (hero, splash, 10 bundle screens)
    qrs/                  # QR codes for App Store link
```

---

## Page Architecture

The landing page (`page.tsx`) is a composition of modular components. Each section is its own component, making reordering and editing straightforward.

### Section Order & Narrative Flow

The page follows a deliberate persuasion arc: **Hook > Explain > Build Trust > Show Product > Validate > Close Emotionally > CTA**.

| # | Component | Kicker | Purpose |
|---|-----------|--------|---------|
| 1 | `HeroSection` | — | First impression: title, subtitle, App Store CTA, two phone mocks |
| 2 | `FeatureSection` | "The Feeling" | Emotional hook — why Bevy matters |
| 3 | `FeatureSection` | "The Experience" | What the cards actually do |
| 4 | `QuoteBreak` | — | Breathing room, sets tone |
| 5 | `FeatureSection` | "Game Night" | Use cases: parties, dates, weekends |
| 6 | `FeatureSection` | "Powered by AI" | How the AI works |
| 7 | `FeatureSection` | "Safe & Inclusive" | Trust building — respectful design |
| 8 | `QuoteBreak` | — | Transition to product showcase |
| 9 | `BundlesShowcase` | "The Collection" | Product depth — all 10 bundles |
| 10 | `ReviewsSection` | "Reviews" | Social proof from real App Store reviews |
| 11 | `QuoteBreak` | — | Final emotional pause |
| 12 | `FeatureSection` | "The Social Catalyst" | Closing appeal — Bevy fits any dynamic |
| 13 | `Footer` | "Get Bevy" | Final CTA with App Store download |

**Why this order:** Bundles and Reviews are placed after the storytelling sections, not in the middle. The user scrolls through the emotional and rational case first, then sees the product depth and social proof right before the closing appeal and download CTA. This maximises conversion at the bottom of the page.

---

## Design Decisions

### Visual Identity

- **Dark theme** (`#0a0a0a` base) — editorial, premium feel that matches the app's dark UI
- **Typography pairing:** Playfair Display (serif, display headings) + Inter (sans-serif, body) — contrast between elegance and readability
- **Gold accent** (`#e8c99f`) — used sparingly for the gold-line dividers and link hover states
- **Muted text hierarchy:** `--text-main` (92% white), `--text-sub` (68%), `--text-muted` (50%), `--text-soft` (36%) — creates visual depth without colour

### Zigzag Layout

All `FeatureSection` components alternate between copy-left/image-right and copy-right/image-left using the `reverse` prop. This creates visual rhythm as the user scrolls:

```
Section 2: [Copy]  [Image]     (default)
Section 3: [Image] [Copy]      (reverse)
Section 5: [Copy]  [Image]     (default)
Section 6: [Image] [Copy]      (reverse)
Section 7: [Copy]  [Image]     (default)
Section 12: [Image] [Copy]     (reverse)
```

### Gold Line Placement

The gold-line divider follows a consistent rule:
- **Feature sections:** Below the title, left-aligned (flows naturally from heading)
- **Quote sections:** Centered above the quote (symmetrical pause)
- **Bundles/Reviews:** Below the title, centered (matches centered layout)
- **Legal pages:** Below the title, left-aligned

### Phone Mocks

The `PhoneMock` component renders app screenshots inside an iPhone 17 Pro flat mockup frame:
- The frame PNG sits at `z-index: 2` above the screenshot
- The screenshot uses `object-contain` to scale without cropping
- Screen insets (`1.2% 2.6% 1.3% 2.6%`) match the exact measured screen opening of the mockup
- Dynamic island from the frame naturally overlaps the screenshot's status bar area
- Compact variant (300px) used in bundle strips, full size (304px) in the hero

### Hero Section

Two phone mocks displayed side-by-side with a `-60px` overlap:
- Front mock: hero-screen (welcome/onboarding)
- Back mock: splash screen
- Left pane: logo (48px), title in display font with "Reimagined." in reduced opacity, subtitle, App Store badge

### Bundles Section

- Split into "Truths" and "Dares" subsections with labels
- Phone mocks overlap with `-50px` negative margin for a stacked card effect
- No background image — relies on the site's dark base for contrast against the phone mocks
- Ordered: 5 truth bundles, then 5 dare bundles

### Reviews Section

- 6 real App Store reviews sourced from the app's `SubscriptionContent.swift`
- 3-column grid on desktop, single column on mobile
- Gold star ratings, review text, author attribution
- Subtle card styling with 2% white background and 6% white border

---

## Legal Pages

All three legal pages share `LegalLayout.tsx` which provides:
- Compact 72px fixed nav bar with logo and "Back Home" link
- Inter-page navigation (Privacy, Terms, Disclaimer)
- Gold-line divider below the page title
- Responsive reading layout (720px max-width)
- Footer with full site footer

### Accuracy

Legal pages are audited against the app's actual codebase:
- **Mixpanel** is the only analytics SDK (no Google Analytics)
- **RevenueCat** handles subscriptions (disclosed by name)
- **Modal** hosts the AI backend (disclosed by name)
- No advertising, remarketing, or cookies
- No user accounts or email collection
- Only two device permissions: photo library + notifications
- AI backend receives only numeric prompt IDs, no personal data

### Legal Page Styles

- H2 headings use Playfair Display with bottom border separators
- Gold-tinted links and list markers for visual consistency
- 15px body text with 1.85 line-height for comfortable reading
- Semantic HTML structure for accessibility

---

## CSS Architecture

All custom styles live in `globals.css` (~420 lines), organised into sections:

```
1. CSS Variables (colours, spacing, typography)
2. Base resets and typography
3. Layout (site-shell, section-space, split-layout)
4. Section components (kicker, section-title, section-body, quote)
5. Legal page styles
6. Animations (fade-in, bounce)
7. Gold line
8. Hero mocks
9. Phone mock + bundle strip
10. Reviews grid
11. Scrollbar hiding
```

Tailwind is used for utility classes (spacing, flexbox, responsive). Custom CSS handles the editorial design system (typography scale, colour variables, component-level styles).

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Main landing page |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/disclaimer` | Legal Disclaimer |

All routes are statically generated at build time.

---

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
```

---

## Asset Naming Conventions

- All files use **kebab-case** (e.g., `bevy-logo.png`, `iphone-17-pro-mockup.png`)
- Bundle screenshots: `bundle-{name}.png` (e.g., `bundle-date-night.png`)
- Illustrations: `illustration{n}.png` (numbered 1-9)
- Icons: descriptive names with colour variant (e.g., `instagram-white.png`, `gmail-grey.png`)
