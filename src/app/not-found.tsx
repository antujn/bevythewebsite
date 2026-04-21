import Image from "next/image";
import Link from "next/link";

const DIGITS = ["4", "0", "4"] as const;

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-8 py-20 sm:px-12 sm:py-24"
    >
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52"
        aria-hidden="true"
      >
        <Image
          src="/images/illustrations/illustration7.jpg"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/54 to-black/66" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(circle_at_50%_78%,rgba(198,166,120,0.08),transparent_60%)]" />
      </div>

      <section className="relative z-10 w-full max-w-[760px] px-8 py-8 text-center sm:px-12 sm:py-12">
        <div
          className="font-display flex items-baseline justify-center px-4 py-3 text-[clamp(112px,20vw,220px)] font-normal leading-none tracking-[-0.03em] text-white/92"
          aria-label="404"
        >
          {DIGITS.map((d, i) => (
            <span
              key={i}
              className={`${i === 1 ? "italic font-bold text-white/52" : ""} inline-block px-1 py-1`}
            >
              <span className="px-[0.035em]">{d}</span>
            </span>
          ))}
        </div>

        <h1 className="font-display mt-3 px-4 py-2 text-[clamp(30px,4.1vw,44px)] leading-[1.16] text-white/86 sm:mt-4">
          Wrong turn.
        </h1>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-3 sm:mt-10">
          <Link href="/" className="nf-cta">
            <span className="nf-cta__arrow" aria-hidden>
              &larr;
            </span>
            Back to Bevy
          </Link>
        </div>

      </section>
    </main>
  );
}
