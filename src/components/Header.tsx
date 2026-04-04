"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-[6vw] lg:px-[4vw] py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logos/logo_derived_3_transparent.png" alt="Bevy" width={36} height={36} />
          </Link>

          <span className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-[0.25em] uppercase text-white/50 hidden lg:block">
            Bevy
          </span>

          <button onClick={() => setOpen(!open)} className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 hover:text-white/90 transition-colors" aria-label="Menu">
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Full-screen nav overlay */}
      <div className={`fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-2xl flex items-center justify-center transition-all duration-500 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <nav className="flex flex-col items-center gap-8">
          {[
            { label: "Home", href: "/" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Disclaimer", href: "/disclaimer" },
          ].map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
              className="font-display italic text-[clamp(24px,4vw,40px)] text-white/70 hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}
          <div className="mt-4 gold-line" />
          <a href="https://apps.apple.com/app/id1553693490" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            className="text-[12px] tracking-[0.2em] uppercase text-white/40 hover:text-white/80 transition-colors mt-2">
            Download
          </a>
        </nav>
      </div>
    </>
  );
}
