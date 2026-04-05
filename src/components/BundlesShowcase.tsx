import Image from "next/image";
import PhoneMock from "./PhoneMock";

const truthBundles = [
  {
    label: "Significant Other",
    imageSrc: "/images/screens/bundle-significant-other.png",
    imageAlt: "Significant Other bundle screen",
  },
  {
    label: "Early Dating",
    imageSrc: "/images/screens/bundle-early-dating.png",
    imageAlt: "Early Dating bundle screen",
  },
  {
    label: "The Office",
    imageSrc: "/images/screens/bundle-the-office.png",
    imageAlt: "The Office bundle screen",
  },
  {
    label: "House Party",
    imageSrc: "/images/screens/bundle-house-party.png",
    imageAlt: "House Party bundle screen",
  },
  {
    label: "No Strings Attached",
    imageSrc: "/images/screens/bundle-no-strings.png",
    imageAlt: "No Strings Attached bundle screen",
  },
];

const dareBundles = [
  {
    label: "Date Night",
    imageSrc: "/images/screens/bundle-date-night.png",
    imageAlt: "Date Night bundle screen",
  },
  {
    label: "Not Safe For Work",
    imageSrc: "/images/screens/bundle-nsfw.png",
    imageAlt: "Not Safe For Work bundle screen",
  },
  {
    label: "Safe For Work",
    imageSrc: "/images/screens/bundle-safe-for-work.png",
    imageAlt: "Safe For Work bundle screen",
  },
  {
    label: "Baby Making",
    imageSrc: "/images/screens/bundle-baby-making.png",
    imageAlt: "Baby Making bundle screen",
  },
  {
    label: "Point Break",
    imageSrc: "/images/screens/bundle-point-break.png",
    imageAlt: "Point Break bundle screen",
  },
];

export default function BundlesShowcase() {
  return (
    <section
      className="section-space relative overflow-hidden"
      style={{ paddingTop: 0, paddingBottom: 40 }}
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/illustrations/illustration3.png"
          alt=""
          fill
          className="editorial-img"
          sizes="100vw"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#050505]/90" />
      </div>
      <div className="site-shell">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
            paddingTop: 80,
          }}
        >
          <p className="kicker">Bundles</p>
          <h2 className="section-title">
            A different energy for every night.
          </h2>
          <div className="gold-line mt-4" style={{ marginInline: "auto" }} />
          <p
            className="section-body"
            style={{ maxWidth: 560, marginInline: "auto" }}
          >
            From soft truths to bold dares, each Bevy bundle sets its own tone
            so the game fits your people, your mood, and your moment.
          </p>
        </article>
      </div>

      <h3 className="bundle-section-label" style={{ marginTop: 40 }}>
        Truths
      </h3>
      <div className="bundle-strip">
        {truthBundles.map((bundle) => (
          <div key={bundle.label} className="bundle-item">
            <PhoneMock
              compact
              screenSrc={bundle.imageSrc}
              screenAlt={bundle.imageAlt}
            />
          </div>
        ))}
      </div>

      <h3 className="bundle-section-label" style={{ marginTop: 40 }}>
        Dares
      </h3>
      <div className="bundle-strip">
        {dareBundles.map((bundle) => (
          <div key={bundle.label} className="bundle-item">
            <PhoneMock
              compact
              screenSrc={bundle.imageSrc}
              screenAlt={bundle.imageAlt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
