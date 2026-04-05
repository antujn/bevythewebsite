import type { ReactNode } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type FeatureSectionProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

type PhoneMockProps = {
  screenSrc: string;
  screenAlt: string;
  priority?: boolean;
  compact?: boolean;
};

const bundleScreens = [
  {
    label: "Significant Other",
    imageSrc: "/images/screens/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
  },
  {
    label: "Early Dating",
    imageSrc: "/images/screens/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
  },
  {
    label: "Date Night",
    imageSrc: "/images/screens/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
  },
  {
    label: "Point Break",
    imageSrc: "/images/screens/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
  },
  {
    label: "The Office",
    imageSrc: "/images/screens/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
  },
  {
    label: "No Strings Attached",
    imageSrc: "/images/screens/bundle-no-strings.png",
    imageAlt: "No Strings Attached bundle screen",
  },
  {
    label: "Not Safe For Work",
    imageSrc: "/images/screens/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
  },
];

function PhoneMock({
  screenSrc,
  screenAlt,
  priority = false,
  compact = false,
}: PhoneMockProps) {
  return (
    <div className={`phone-mock${compact ? " phone-mock--compact" : ""}`}>
      <div className="phone-mock__screen">
        <Image
          src={screenSrc}
          alt={screenAlt}
          fill
          sizes={compact ? "300px" : "380px"}
          className="object-contain"
          priority={priority}
        />
      </div>
      <Image
        src="/images/mocks/iPhone 17 Pro Flat Mockup (Community).png"
        alt=""
        fill
        sizes={compact ? "300px" : "380px"}
        className="phone-mock__frame"
      />
    </div>
  );
}

function BundlesShowcase() {
  return (
    <section className="section-space relative overflow-hidden" style={{ paddingTop: 0, paddingBottom: 40 }}>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/illustration3.png"
          alt=""
          fill
          className="editorial-img"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#050505]/90" />
      </div>
      <div className="site-shell">
        <article style={{ maxWidth: 680, marginInline: 'auto', textAlign: 'center', paddingTop: 80 }}>
          <p className="kicker">Bundles</p>
          <div className="gold-line mt-4" style={{ marginInline: 'auto' }} />
          <h2 className="section-title">A different energy for every night.</h2>
          <p className="section-body" style={{ maxWidth: 560, marginInline: 'auto' }}>
            From soft truths to bold dares, each Bevy bundle sets its own tone
            so the game fits your people, your mood, and your moment.
          </p>
        </article>
      </div>

      <div className="bundle-strip" style={{ marginTop: 40 }}>
          {bundleScreens.map((bundle) => (
            <div key={bundle.label} className="bundle-item">
              <PhoneMock
                compact
                screenSrc={bundle.imageSrc}
                screenAlt={bundle.imageAlt}
              />
            </div>
          ))}
        </div>
    </section>
  );
}

function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  const copyBlock = (
    <article className="copy-column">
      <p className="kicker">{eyebrow}</p>
      <div className="gold-line mt-4" />
      <h2 className="section-title">{title}</h2>
      <p className="section-body">{body}</p>
    </article>
  );

  const mediaBlock = (
    <div className="media-column">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="editorial-img"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-black/8" />
    </div>
  );

  return (
    <section id={id} className="section-space">
      <div className={`site-shell split-layout${reverse ? " reverse" : ""}`}>
        {reverse ? (
          <>
            {mediaBlock}
            {copyBlock}
          </>
        ) : (
          <>
            {copyBlock}
            {mediaBlock}
          </>
        )}
      </div>
    </section>
  );
}

function QuoteBreak({ children }: { children: ReactNode }) {
  return (
    <section className="quote-space flex items-center justify-center">
      <div className="mx-auto w-full max-w-[640px] px-6 text-center">
        <div className="gold-line mx-auto" />
        <p className="quote-copy">{children}</p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main>

        <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/illustrations/illustration2.png"
              alt=""
              fill
              className="editorial-img"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/72 via-[#0a0a0a]/40 to-[#050505]/85" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.34)_80%)]" />
          </div>

          <div className="site-shell relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left — Logo, title & line */}
            <div className="flex flex-col items-center text-center fade-in fade-in-d3">
              <Image
                src="/images/logos/logo_derived_3_transparent.png"
                alt="Bevy"
                width={160}
                height={160}
                priority
              />
              <span className="mt-6 text-[22px] font-medium uppercase tracking-[0.28em] text-white/45">
                Bevy
              </span>
              <div className="mt-5 h-px w-[64px] bg-white/[0.16]" />
              <a
                href="https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: 16, color: '#ffffff' }}
                className="text-[11px] font-medium tracking-[0.25em] uppercase transition-colors hover:text-white/70"
              >
                ‹ Download ›
              </a>
            </div>

            {/* Right — Title & description */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/42 fade-in">
                Truth or Dare, Reimagined
              </p>
              <h1 style={{ marginTop: 16 }} className="font-display text-[clamp(38px,6.2vw,74px)] font-normal leading-[1.1] text-white/92 fade-in fade-in-d1">
                Go further,
                <br />
                feel more.
              </h1>

              <div style={{ paddingTop: 12, paddingBottom: 12 }} className="fade-in fade-in-d2">
                <div className="h-px w-[120px] bg-white/[0.16]" />
              </div>

              <p className="max-w-[440px] text-[16px] font-light leading-[1.78] text-white/54 fade-in fade-in-d2">
                Behind every person you know is a conversation you
                haven&rsquo;t had yet. Bevy helps you start it.
              </p>

            </div>
          </div>

          <a
            href="#s1"
            className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/34 transition-colors hover:text-white/62 fade-in fade-in-d3"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase">Discover</span>
            <svg
              className="bounce h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </a>
        </section>

        <FeatureSection
          id="s1"
          eyebrow="The Experience"
          title={
            <>
              Conversations
              <br />
              that stay with you.
            </>
          }
          body="Every card in Bevy is crafted to go beyond the surface. Questions that make you pause. Dares that make you feel alive. Moments that bond you closer to the people around you."
          imageSrc="/images/illustrations/illustration6.png"
          imageAlt="An intimate embrace"
        />

        <QuoteBreak>
          &ldquo;The best nights aren&rsquo;t planned.
          <br />
          They&rsquo;re felt.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="Game Night"
          title={
            <>
              Elevate
              <br />
              the ordinary.
            </>
          }
          body="House parties, date nights, long weekends away. Bevy turns any gathering into something electric. No awkward silences. No recycled questions. Just the right card at the right moment."
          imageSrc="/images/illustrations/illustration2.png"
          imageAlt="Couples dancing at night"
          reverse
        />

        <BundlesShowcase />

        <QuoteBreak>
          &ldquo;Some truths need telling.
          <br />
          Some dares need taking.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="Powered by AI"
          title={
            <>
              Thoughtfully
              <br />
              intelligent.
            </>
          }
          body="BevyAI learns the room. It adapts to your energy, your comfort level, your dynamic. Every prompt is emotionally considered, socially aware, and designed to land."
          imageSrc="/images/illustrations/illustration8.jpeg"
          imageAlt="A diverse group of friends"
        />

        <QuoteBreak>
          &ldquo;Ask the questions
          <br />
          you&rsquo;ve always wanted to.&rdquo;
        </QuoteBreak>

        <FeatureSection
          eyebrow="The People You Love"
          title={
            <>
              Made for
              <br />
              the moments
              <br />
              in between.
            </>
          }
          body="Ten bundles. Over a thousand cards. From the first date to the twentieth anniversary. From Friday night with strangers to Sunday morning with your person. Bevy meets you wherever you are."
          imageSrc="/images/illustrations/illustration1.png"
          imageAlt="A sophisticated social gathering"
          reverse
        />
      </main>

      <Footer />
    </>
  );
}
