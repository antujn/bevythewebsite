import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./Footer";

export default function LegalLayout({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.11] bg-[#090909]/88 backdrop-blur-xl">
        <div className="site-shell flex h-[80px] items-center justify-between">
          <Link href="/" prefetch={false} className="flex items-center gap-3">
            <Image
              src="/images/logos/logo_derived_3_transparent.png"
              alt="Bevy"
              width={34}
              height={34}
              priority
            />
            <span className="text-[12px] font-semibold uppercase tracking-[0.17em] text-white/78">
              Bevy
            </span>
          </Link>

          <Link
            href="/"
            prefetch={false}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/42 transition-colors duration-300 hover:text-white/84"
          >
            Back Home
          </Link>
        </div>
      </nav>

      <main className="pb-20 pt-[118px] sm:pb-24 lg:pb-28">
        <div className="site-shell">
          <div className="mx-auto max-w-[860px]">
            <p className="kicker">Legal</p>
            <h1 className="mt-5 font-display text-[clamp(30px,4.1vw,48px)] font-normal leading-[1.12] text-white/92">
              {title}
            </h1>

            <div className="mt-10 rounded-[2px] border border-white/[0.1] bg-black/24 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
              <div className="legal-copy">{children}</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
