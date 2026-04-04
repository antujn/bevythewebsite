import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";

const pad = "px-[6vw] lg:px-[4vw]";

export default function Home() {
  return (
    <>
      <Header />

      <main>

        {/* ═══ HERO — video background, editorial text at bottom ═══ */}
        <section className={`relative min-h-[100dvh] flex flex-col justify-end ${pad} pb-[6vh] overflow-hidden`}>
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover -z-20"
            poster="/images/illustrations/illustration3.png"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/20" />

          <div className="max-w-[1500px] w-full mx-auto">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/40 fade-in">
              An AI-Powered Experience
            </p>
            <h1 className="mt-4 font-display text-[clamp(36px,6vw,72px)] font-normal leading-[1.1] text-white/90 fade-in fade-in-d1">
              Go further,<br />feel more.
            </h1>
            <p className="mt-5 max-w-[380px] text-[16px] font-light text-white/50 leading-[1.75] fade-in fade-in-d2">
              Bevy transforms truth or dare into something worth remembering.
              Over 1000 cards designed to spark connection, vulnerability, and
              unforgettable moments between the people who matter most.
            </p>
          </div>

          <a href="#s1" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors fade-in fade-in-d3">
            <span className="text-[10px] tracking-[0.25em] uppercase">Discover</span>
            <svg className="w-4 h-4 bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </a>
        </section>


        {/* ═══ SECTION 1 — text left, image right ═══ */}
        <section id="s1" className={`py-[4vh] lg:py-[8vh] ${pad}`}>
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-10 items-center">
            <div className="lg:col-start-1 lg:col-span-4 order-2 lg:order-1">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/30">
                The Experience
              </p>
              <div className="gold-line mt-4" />
              <h2 className="mt-5 font-display text-[clamp(24px,3vw,38px)] font-normal leading-[1.2] text-white/90">
                Conversations<br />that stay with you.
              </h2>
              <p className="mt-5 text-[16px] font-light text-white/40 leading-[1.75]">
                Every card in Bevy is crafted to go beyond the surface. Questions that
                make you pause. Dares that make you feel alive. Moments that bond you
                closer to the people around you.
              </p>
            </div>
            <div className="lg:col-start-7 lg:col-span-6 order-1 lg:order-2 aspect-[3/4] relative overflow-hidden">
              <Image src="/images/illustrations/illustration6.png" alt="An intimate embrace" fill className="editorial-img" sizes="(min-width:1024px) 45vw, 92vw" />
            </div>
          </div>
        </section>


        {/* ═══ QUOTE ═══ */}
        <section className={`py-[6vh] lg:py-[10vh] ${pad}`}>
          <div className="flex flex-col items-center">
            <div className="gold-line" />
            <p className="mt-8 max-w-[480px] font-display italic text-[clamp(18px,2.5vw,28px)] text-white/30 text-center leading-[1.6]">
              &ldquo;The best nights aren&rsquo;t planned.<br />They&rsquo;re felt.&rdquo;
            </p>
          </div>
        </section>


        {/* ═══ SECTION 2 — image left, text right ═══ */}
        <section className={`py-[4vh] lg:py-[8vh] ${pad}`}>
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-10 items-center">
            <div className="lg:col-start-1 lg:col-span-6 aspect-[3/4] relative overflow-hidden">
              <Image src="/images/illustrations/illustration2.png" alt="Couples dancing at night" fill className="editorial-img" sizes="(min-width:1024px) 45vw, 92vw" />
            </div>
            <div className="lg:col-start-9 lg:col-span-4">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/30">
                Game Night
              </p>
              <div className="gold-line mt-4" />
              <h2 className="mt-5 font-display text-[clamp(24px,3vw,38px)] font-normal leading-[1.2] text-white/90">
                Elevate<br />the ordinary.
              </h2>
              <p className="mt-5 text-[16px] font-light text-white/40 leading-[1.75]">
                House parties, date nights, long weekends away. Bevy turns any
                gathering into something electric. No awkward silences. No recycled
                questions. Just the right card at the right moment.
              </p>
            </div>
          </div>
        </section>


        {/* ═══ VIDEO INTERLUDE ═══ */}
        <section className="relative h-[50vh] overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/ambient.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </section>


        {/* ═══ SECTION 3 — text left, image right ═══ */}
        <section className={`py-[4vh] lg:py-[8vh] ${pad}`}>
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-10 items-center">
            <div className="lg:col-start-1 lg:col-span-4 order-2 lg:order-1">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/30">
                Powered by AI
              </p>
              <div className="gold-line mt-4" />
              <h2 className="mt-5 font-display text-[clamp(24px,3vw,38px)] font-normal leading-[1.2] text-white/90">
                Thoughtfully<br />intelligent.
              </h2>
              <p className="mt-5 text-[16px] font-light text-white/40 leading-[1.75]">
                BevyAI learns the room. It adapts to your energy, your comfort level,
                your dynamic. Every prompt is emotionally considered, socially aware,
                and designed to land.
              </p>
            </div>
            <div className="lg:col-start-7 lg:col-span-6 order-1 lg:order-2 aspect-[3/4] relative overflow-hidden">
              <Image src="/images/illustrations/illustration8.jpeg" alt="A diverse group of friends" fill className="editorial-img" sizes="(min-width:1024px) 45vw, 92vw" />
            </div>
          </div>
        </section>


        {/* ═══ QUOTE ═══ */}
        <section className={`py-[6vh] lg:py-[10vh] ${pad}`}>
          <div className="flex flex-col items-center">
            <div className="gold-line" />
            <p className="mt-8 max-w-[480px] font-display italic text-[clamp(18px,2.5vw,28px)] text-white/30 text-center leading-[1.6]">
              &ldquo;Ask the questions<br />you&rsquo;ve always wanted to.&rdquo;
            </p>
          </div>
        </section>


        {/* ═══ SECTION 4 — image left, text right ═══ */}
        <section className={`py-[4vh] lg:py-[8vh] ${pad}`}>
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-10 items-center">
            <div className="lg:col-start-1 lg:col-span-7 aspect-[3/4] relative overflow-hidden">
              <Image src="/images/illustrations/illustration1.png" alt="A sophisticated social gathering" fill className="editorial-img" sizes="(min-width:1024px) 52vw, 92vw" />
            </div>
            <div className="lg:col-start-9 lg:col-span-4">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/30">
                The People You Love
              </p>
              <div className="gold-line mt-4" />
              <h2 className="mt-5 font-display text-[clamp(24px,3vw,38px)] font-normal leading-[1.2] text-white/90">
                Made for<br />the moments<br />in between.
              </h2>
              <p className="mt-5 text-[16px] font-light text-white/40 leading-[1.75]">
                Ten bundles. Over a thousand cards. From the first date to the
                twentieth anniversary. From Friday night with strangers to Sunday
                morning with your person. Bevy meets you wherever you are.
              </p>
            </div>
          </div>
        </section>


        {/* ═══ CLOSING CTA ═══ */}
        <section className={`py-24 lg:py-40 ${pad}`}>
          <div className="max-w-[500px] mx-auto text-center">
            <Image src="/images/logos/logo_derived_3_transparent.png" alt="Bevy" width={48} height={48} className="mx-auto opacity-50" />
            <div className="gold-line mx-auto mt-8" />
            <h2 className="mt-8 font-display text-[clamp(26px,4.5vw,48px)] font-normal leading-[1.15] text-white/90">
              Your night<br />deserves more.
            </h2>
            <p className="mt-5 text-[16px] font-light text-white/40 leading-[1.75]">
              Available on the App Store.
            </p>
            <a href="https://apps.apple.com/app/id1553693490" target="_blank" rel="noopener noreferrer"
              className="inline-block mt-10 transition-transform hover:scale-105 active:scale-95">
              <Image src="/images/social/appstore.png" alt="Download on the App Store" width={160} height={52} className="h-[44px] w-auto opacity-60 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </section>

      </main>


      {/* ═══ FOOTER ═══ */}
      <footer className={`${pad} pt-0 pb-12`}>
        <div className="w-full h-px bg-white/[0.06]" />
        <div className="max-w-[1500px] mx-auto pt-12 grid grid-cols-1 sm:grid-cols-3 gap-10 items-start">
          <div className="flex justify-center sm:justify-start">
            <Image src="/images/logos/logo_derived_3_transparent.png" alt="Bevy" width={32} height={32} className="opacity-30" />
          </div>
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-5">
              <a href="https://www.instagram.com/bevytheapp" target="_blank" rel="noopener noreferrer" className="opacity-30 hover:opacity-60 transition-opacity">
                <Image src="/images/social/instagram-white.png" alt="Instagram" width={16} height={16} />
              </a>
              <a href="https://www.tiktok.com/@bevytheapp" target="_blank" rel="noopener noreferrer" className="opacity-30 hover:opacity-60 transition-opacity">
                <Image src="/images/social/tiktok.png" alt="TikTok" width={16} height={16} />
              </a>
              <a href="mailto:bevytheapp@gmail.com" className="opacity-30 hover:opacity-60 transition-opacity">
                <Image src="/images/social/gmail.png" alt="Email" width={16} height={16} />
              </a>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">Terms</Link>
              <Link href="/disclaimer" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">Disclaimer</Link>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <p className="text-[11px] text-white/20">&copy; 2026 Anant Jain</p>
          </div>
        </div>
      </footer>
    </>
  );
}
