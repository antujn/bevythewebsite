import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";

const legalNav = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function LegalLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[5] bg-gradient-to-b from-black/62 via-black/58 to-black/66"
      />

      <nav className="fixed inset-x-0 top-0 z-[60] border-b border-white/[0.12] bg-[#090909]/88 backdrop-blur-xl">
        <div className="site-shell flex h-[84px] items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center gap-3">
            <Image
              src="/images/icons/bevy-logo.png"
              alt="Bevy"
              width={44}
              height={44}
              priority
            />
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.2em] text-white/52 sm:block">
              Bevy
            </span>
          </Link>

          <Link
            href="/"
            prefetch={false}
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56 transition-colors duration-300 hover:text-white/90"
          >
            &larr; Back Home
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        <main style={{ paddingTop: 132, paddingBottom: 100 }}>
          <div className="site-shell">
            <article className="mx-auto max-w-[720px]">
              <header style={{ marginBottom: 48 }}>
                <p className="kicker">Legal</p>
                <h1
                  className="section-title"
                  style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
                >
                  {title}
                </h1>
                <div className="gold-line mt-4" style={{ marginInline: 0 }} />
              </header>

              <nav
                className="flex flex-wrap gap-x-6 gap-y-2"
                style={{
                  marginBottom: 40,
                  paddingBottom: 20,
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {legalNav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={false}
                    className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/30 transition-colors hover:text-white/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="legal-copy">{children}</div>
            </article>
          </div>
        </main>

        <Footer />
        </div>
    </>
  );
}
