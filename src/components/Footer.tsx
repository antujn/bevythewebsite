"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import DownloadButton from "./DownloadButton";
import { RevealIn, RevealGroup, RevealChild } from "./RevealIn";
import { APP_STORE_URL } from "@/lib/appStore";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Legal Disclaimer", href: "/disclaimer" },
  {
    label: "App Store",
    href: APP_STORE_URL,
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

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  return (
    <footer className="relative min-h-[88vh] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Wine-tinted section overlay + a soft central bloom so the
            footer reads as the final, warm "exhale" of the page. */}
        <div className="section-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(217,82,58,0.06),transparent_60%)]" />
      </div>

      <div className="site-shell relative flex min-h-[88vh] flex-col items-center py-12 sm:py-14 lg:py-16">
        {/* Top divider — scales in from center as user scrolls footer into view */}
        <motion.div
          className="h-px w-full max-w-[980px] bg-white/[0.08]"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        />

        {/* CTA stack — sequenced reveal */}
        <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center text-center">
          <RevealGroup stagger={0.1} amount={0.3}>
            <RevealChild>
              <p className="kicker">Get Bevy</p>
            </RevealChild>
            <RevealChild>
              {/* Couplet CTA — "Try Bevy" in cream, "for free." as
                  the rose italic payoff. See .title-accent in
                  globals.css. */}
              <h2 className="section-title" style={{ textAlign: "center" }}>
                Try Bevy{" "}
                <span className="title-accent">for free.</span>
              </h2>
            </RevealChild>
            <RevealChild preset="scale">
              <div
                className="gold-line mt-4"
                style={{ marginInline: "auto" }}
              />
            </RevealChild>
            <RevealChild>
              <p
                className="section-body"
                style={{
                  textAlign: "center",
                  maxWidth: 440,
                  marginInline: "auto",
                }}
              >
                Download Bevy and turn your next gathering into something
                unforgettable.
              </p>
            </RevealChild>
            <RevealChild preset="scale">
              <div style={{ marginTop: 32 }}>
                <DownloadButton width={188} height={63} />
              </div>
            </RevealChild>
          </RevealGroup>
        </div>

        <div className="flex w-full max-w-[980px] flex-col items-center gap-8 pb-2 pt-10">
          <motion.div
            className="h-px w-full bg-white/[0.06]"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />

          {/* Legal links — stagger fade-up */}
          <RevealGroup
            stagger={0.05}
            amount={0.4}
            className="flex max-w-[840px] flex-wrap justify-center gap-x-8 gap-y-5 text-center sm:gap-x-10"
          >
            {legalLinks.map((item) => (
              <RevealChild key={item.label} preset="fade">
                {item.external ? (
                  <motion.a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/36 hover:text-white/70"
                    whileHover={{ y: -2 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 24,
                    }}
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 24,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/36 transition-colors duration-300 hover:text-white/70"
                    >
                      {item.label}
                    </Link>
                  </motion.span>
                )}
              </RevealChild>
            ))}
          </RevealGroup>

          {/* Social icons — stagger pop-in with hover scale+rotate */}
          <RevealGroup
            stagger={0.08}
            amount={0.4}
            className="flex items-center gap-4"
          >
            {socialLinks.map((item) => (
              <RevealChild key={item.label} preset="scale">
                <motion.a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={item.label}
                  className="group grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.06]"
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 18,
                  }}
                >
                  <span className="relative h-5 w-5">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      sizes="20px"
                      className="object-contain opacity-65 transition-opacity duration-300 group-hover:opacity-100"
                      draggable={false}
                    />
                  </span>
                </motion.a>
              </RevealChild>
            ))}
          </RevealGroup>

          <RevealIn delay={0.3} amount={0.5}>
            <p className="text-[11px] tracking-[0.06em] text-white/22">
              &copy; 2026 Anant Jain. All rights reserved.
            </p>
          </RevealIn>
        </div>
      </div>
    </footer>
  );
}
