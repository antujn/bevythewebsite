import type { ReactNode } from "react";
import Image from "next/image";

type FeatureSectionProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureSectionProps) {
  const copyBlock = (
    <article className="copy-column">
      <p className="kicker">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <div className="gold-line mt-4" />
      <p className="section-body">{body}</p>
    </article>
  );

  const mediaBlock = (
    <div className="media-column">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="editorial-img"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-black/8" />
    </div>
  );

  return (
    <section id={id} className="section-space">
      <div className={`site-shell split-layout${reverse ? " reverse" : ""}`}>
        {reverse ? (
          <>
            {mediaBlock}
            {copyBlock}
          </>
        ) : (
          <>
            {copyBlock}
            {mediaBlock}
          </>
        )}
      </div>
    </section>
  );
}
