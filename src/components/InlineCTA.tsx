import Image from "next/image";

export default function InlineCTA({ text }: { text: string }) {
  return (
    <section className="inline-cta">
      <div className="site-shell">
        <div className="inline-cta-inner">
          <p className="inline-cta-text">{text}</p>
          <a
            href="https://apps.apple.com/us/app/bevy-truth-or-dare-card-game/id1553693490"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-cta-button"
          >
            <Image
              src="/images/icons/appstore-dark.png"
              alt="Download on the App Store"
              width={156}
              height={52}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
