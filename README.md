# Bevy the Website

Marketing website for the Bevy iOS app.

- Live: [https://bevythewebsite.vercel.app/](https://bevythewebsite.vercel.app/)
- App Store: [Bevy on the App Store](https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490)
- Stack: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4

## Design Inspiration

- [Paired](https://www.paired.com/) - social proof framing, conversation-first storytelling, section pacing
- [Flo Health](https://flo.health/) - editorial composition, premium dark aesthetic, guided scroll flow

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + custom `globals.css` |
| Fonts | Playfair Display (display), Plus Jakarta Sans (body) |
| Linting | ESLint |

## Current Homepage Composition

`src/app/page.tsx` renders the sections in this order:

1. `Header`
2. `HeroSection`
3. `FeatureDeck`
4. `BundlesShowcase`
5. `ReviewsSection`
6. `Footer`

## Key Interactions

### Hero (`src/components/HeroSection.tsx`)
- Two phone mocks (front + back)
- Front screen auto-rotates through `public/images/screens/hero_mock/*` with crossfade
- Uses background illustration overlay and App Store CTA

### Feature Deck (`src/components/FeatureDeck.tsx`)
- Scroll-driven sticky deck with tab sync
- Clicking a tab scrolls to the matching deck position
- Feature artwork comes from `public/images/illustrations/features/*`

### Bundles Showcase (`src/components/BundlesShowcase.tsx`)
- Left/right bundle columns (`Question Bundles` / `Challenge Bundles`)
- Sticky center phone with crossfade transitions between bundle screens
- Auto-rotate + manual tab/dot navigation
- Active state tint follows bundle-specific accent colors

### Reviews (`src/components/ReviewsSection.tsx`)
- Dark testimonial stage with floating bubbles
- Uses real App Store review copy
- Bubble entrance animation on section reveal
- CTA button opens the shared download flow

### Download Flow (`src/components/DownloadContext.tsx`)
- Global QR modal opened by `DownloadButton`
- Uses black QR asset and App Store fallback link

### Preview Modal Export (`src/components/Header.tsx`)
- `Previews` button opens the 10-slide App Store-style modal
- `Download` button exports the currently visible slide as a 1320x2868 JPEG
- Export is client-side using `modern-screenshot` and saves as `bevy-preview-{slide-id}.jpg`

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    privacy/page.tsx
    terms/page.tsx
    disclaimer/page.tsx
  components/
    Header.tsx
    HeroSection.tsx
    FeatureDeck.tsx
    BundlesShowcase.tsx
    ReviewsSection.tsx
    Footer.tsx
    DownloadButton.tsx
    DownloadContext.tsx
    PhoneMock.tsx
    LegalLayout.tsx

public/
  images/
    icons/
    mockups/
    qrs/
    illustrations/
      background/
      features/
    screens/
      bundles_mock/
      hero_mock/
```

## Routes

- `/` - Landing page
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/disclaimer` - Legal Disclaimer

## Development

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## Deployment (Vercel)

Current production deployment:

- [https://bevythewebsite.vercel.app/](https://bevythewebsite.vercel.app/)

Steps to deploy on Vercel:

1. Push your latest changes to GitHub.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import the `bevythewebsite` repository.
4. Keep the default Vercel settings for Next.js:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `.next` (default)
5. Click **Deploy**.
6. After deployment, open the generated URL and verify key routes:
   - `/`
   - `/privacy`
   - `/terms`
   - `/disclaimer`

Optional production setup:

- Add a custom domain in Vercel Project Settings > Domains.
- Configure branch protection and auto-deploy from `main`.

## Asset Notes

- Feature images: `public/images/illustrations/features/illustration1.jpg` to `illustration6.jpg`
- Background images: `public/images/illustrations/backgrounds/illustration7.jpg`, `illustration8.jpg`
- Hero rotating screens are defined in `HeroSection.tsx` (`heroImages` array)
- Bundle screens and metadata (labels, copy, accents) are defined in `BundlesShowcase.tsx` (`bundles` array)
