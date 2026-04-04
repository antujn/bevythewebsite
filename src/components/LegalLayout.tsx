import Link from "next/link";
import Image from "next/image";

export default function LegalLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-[max(24px,5vw)] py-[18px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[10px]">
            <Image src="/images/logos/logo_derived_3_transparent.png" alt="Bevy" width={32} height={32} />
            <span className="text-[13px] font-semibold tracking-[0.12em] uppercase text-white/80">Bevy</span>
          </Link>
          <Link href="/" className="text-[11px] font-medium tracking-[0.16em] uppercase text-white/40 hover:text-white/80 transition-colors duration-300">
            Home
          </Link>
        </div>
      </nav>

      <main className="pt-[120px] pb-[80px] px-[max(24px,5vw)]">
        <div className="max-w-[680px] mx-auto">
          <h1 className="font-display text-[clamp(28px,4vw,42px)] font-normal leading-[1.15] text-white/90 mb-[48px]">
            {title}
          </h1>
          <div className="text-white/50 text-[14px] leading-[1.7] [&_h2]:text-white/80 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:mt-[40px] [&_h2]:mb-[16px] [&_h3]:text-white/70 [&_h3]:text-[16px] [&_h3]:font-semibold [&_h3]:mt-[32px] [&_h3]:mb-[12px] [&_p]:mb-[16px] [&_ul]:mb-[16px] [&_ul]:pl-[20px] [&_li]:mb-[6px] [&_a]:text-white/60 [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:text-white/90 [&_strong]:text-white/70 [&_strong]:font-semibold">
            {children}
          </div>
        </div>
      </main>

      <footer className="px-[max(24px,5vw)] pt-0 pb-[40px]">
        <div className="rule-full" />
        <div className="max-w-[1200px] mx-auto pt-[36px] flex flex-col items-center gap-[16px]">
          <div className="flex items-center gap-[20px]">
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
          <div className="flex flex-wrap justify-center gap-x-[20px] gap-y-[8px]">
            <Link href="/privacy" className="text-[10px] tracking-[0.1em] uppercase text-white/25 hover:text-white/50 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[10px] tracking-[0.1em] uppercase text-white/25 hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/disclaimer" className="text-[10px] tracking-[0.1em] uppercase text-white/25 hover:text-white/50 transition-colors">Disclaimer</Link>
          </div>
          <p className="text-[10px] text-white/15">&copy; Anant Jain 2023&ndash;2026</p>
        </div>
      </footer>
    </>
  );
}
