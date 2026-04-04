import Image from "next/image";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Legal Disclaimer", href: "/disclaimer" },
  {
    label: "App Store",
    href: "https://apps.apple.com/app/id1553693490",
    external: true,
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bevytheapp",
    icon: "/images/social/instagram-white.png",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bevytheapp",
    icon: "/images/social/tiktok.png",
  },
  {
    label: "Email",
    href: "mailto:bevytheapp@gmail.com",
    icon: "/images/social/gmail.png",
  },
];

export default function Footer() {
  return (
    <footer className="relative min-h-[88vh] overflow-hidden bg-[#060606]">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/illustration5.png"
          alt=""
          fill
          sizes="100vw"
          className="editorial-img opacity-24"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/84 via-[#060606]/58 to-[#060606]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      <div className="site-shell relative flex min-h-[88vh] flex-col py-12 sm:py-14 lg:py-16">
        <div className="h-px bg-white/[0.08]" />

        <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logos/logo_derived_3_transparent.png"
              alt="Bevy"
              width={58}
              height={58}
              className="opacity-74"
            />
            <span className="text-[12px] font-medium uppercase tracking-[0.28em] text-white/42">
              Bevy
            </span>
          </div>

          <div className="gold-line mt-9" />

          <h2 className="mt-9 font-display text-[clamp(30px,4.5vw,56px)] font-normal leading-[1.12] text-white/90">
            Your night
            <br />
            deserves more.
          </h2>

          <p className="mt-6 max-w-[460px] text-[16px] font-light leading-[1.75] text-white/44">
            Available on the App Store.
          </p>

          <a
            href="https://apps.apple.com/app/id1553693490"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/images/social/appstore.png"
              alt="Download on the App Store"
              width={170}
              height={54}
              className="h-[46px] w-auto opacity-78 transition-opacity hover:opacity-100"
            />
          </a>

          <div className="mt-9 flex items-center gap-4">
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
        </div>

        <div className="flex flex-col items-center gap-8 pb-2 pt-10">
          <div className="h-px w-full bg-white/[0.06]" />

          <nav className="flex max-w-[840px] flex-wrap justify-center gap-x-8 gap-y-5 text-center sm:gap-x-10">
            {legalLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-[11px] font-medium uppercase tracking-[0.17em] text-white/36 transition-colors duration-300 hover:text-white/70"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="text-[11px] tracking-[0.06em] text-white/22">
            &copy; 2026 Anant Jain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
