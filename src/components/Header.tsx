"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDownload } from "./DownloadContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { triggerDownload } = useDownload();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b transition-all duration-700 ${
        scrolled
          ? "border-white/[0.12] bg-[#090909]/88 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="site-shell grid h-[84px] grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href="/"
          prefetch={false}
          className="flex items-center gap-3 justify-self-start"
        >
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

        <span
          className={`hidden text-[11px] font-medium uppercase tracking-[0.24em] text-white/40 lg:block transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          Truth or Dare, Reimagined
        </span>

        <button
          onClick={triggerDownload}
          className="try-free-btn justify-self-end"
        >
          Try for free
        </button>
      </div>
    </header>
  );
}
