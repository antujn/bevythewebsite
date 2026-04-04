"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-all duration-700 ${
          scrolled
            ? "border-white/[0.12] bg-[#090909]/88 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="site-shell grid h-[84px] grid-cols-[1fr_auto_1fr] items-center">
          <Link href="/" prefetch={false} className="flex items-center gap-3 justify-self-start">
            <Image
              src="/images/logos/logo_derived_3_transparent.png"
              alt="Bevy"
              width={36}
              height={36}
              priority
            />
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.24em] text-white/52 sm:block">
              Bevy
            </span>
          </Link>

          <span className="hidden text-[11px] font-medium uppercase tracking-[0.24em] text-white/40 lg:block">
            An AI-Powered Experience
          </span>

          <button
            onClick={() => setOpen(!open)}
            className="justify-self-end text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white/90"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#080808]/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="site-shell flex flex-col items-center gap-8 text-center">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-[clamp(28px,4vw,42px)] italic leading-[1.15] text-white/72 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="gold-line mt-4" />
          <a
            href="https://apps.apple.com/app/id1553693490"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-2 text-[12px] uppercase tracking-[0.2em] text-white/42 transition-colors hover:text-white/82"
          >
            Download
          </a>
        </nav>
      </div>
    </>
  );
}
