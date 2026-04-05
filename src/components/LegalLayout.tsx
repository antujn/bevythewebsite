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
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#090909]/92 backdrop-blur-xl">
        <div className="site-shell flex h-[72px] items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center gap-3">
            <Image
              src="/images/icons/bevy-logo.png"
              alt="Bevy"
              width={30}
              height={30}
              priority
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.17em] text-white/60">
              Bevy
            </span>
          </Link>

          <Link
            href="/"
            prefetch={false}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/36 transition-colors duration-300 hover:text-white/70"
          >
            &larr; Back Home
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: 120, paddingBottom: 100 }}>
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
    </>
  );
}
