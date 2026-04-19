"use client";

import Image from "next/image";
import Link from "next/link";
import DownloadButton from "./DownloadButton";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Legal Disclaimer", href: "/disclaimer" },
  {
    label: "App Store",
    href: "https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490",
    external: true,
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bevytheapp",
    icon: "/images/icons/instagram-white.png",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bevytheapp",
    icon: "/images/icons/tiktok-white.png",
  },
  {
    label: "Email",
    href: "mailto:bevytheapp@gmail.com",
    icon: "/images/icons/gmail-grey.png",
  },
];

export default function Footer() {
  return (
    <footer className="relative min-h-[88vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/52" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      <div className="site-shell relative flex min-h-[88vh] flex-col items-center py-12 sm:py-14 lg:py-16">
        <div className="h-px w-full max-w-[980px] bg-white/[0.08]" />

        <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center text-center">
          <p className="kicker">Get Bevy</p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Try Bevy for free.
          </h2>
          <div className="gold-line mt-4" style={{ marginInline: 'auto' }} />

          <p className="section-body" style={{ textAlign: 'center', maxWidth: 440, marginInline: 'auto' }}>
            Download Bevy and turn your next gathering into something
            unforgettable.
          </p>

          <div style={{ marginTop: 32 }}>
            <DownloadButton width={188} height={63} />
          </div>
        </div>

        <div className="flex w-full max-w-[980px] flex-col items-center gap-8 pb-2 pt-10">
          <div className="h-px w-full bg-white/[0.06]" />

          <nav className="flex max-w-[840px] flex-wrap justify-center gap-x-8 gap-y-5 text-center sm:gap-x-10">
            {legalLinks.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/36 transition-colors duration-300 hover:text-white/70"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={false}
                  className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/36 transition-colors duration-300 hover:text-white/70"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={item.label}
                className="group grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.06]"
              >
                <span className="relative h-5 w-5">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    fill
                    sizes="20px"
                    className="object-contain opacity-65 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </span>
              </a>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.06em] text-white/22">
            &copy; 2026 Anant Jain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
