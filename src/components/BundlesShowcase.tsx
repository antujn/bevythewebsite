"use client";

import { useState } from "react";
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

type Tab = "truths" | "dares";

export default function BundlesShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("truths");
  const bundles = activeTab === "truths" ? truthBundles : dareBundles;

  return (
    <section
      className="section-space"
      style={{ paddingTop: 0, paddingBottom: 40 }}
    >
      <div className="site-shell">
        <article
          style={{
            maxWidth: 680,
            marginInline: "auto",
            textAlign: "center",
            paddingTop: 80,
          }}
        >
          <p className="kicker">The Collection</p>
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

        <div className="bundle-tabs" style={{ marginTop: 40 }}>
          <button
            className={`bundle-tab${activeTab === "truths" ? " bundle-tab--active" : ""}`}
            onClick={() => setActiveTab("truths")}
          >
            Truths
            <span className="bundle-tab-count">{truthBundles.length}</span>
          </button>
          <button
            className={`bundle-tab${activeTab === "dares" ? " bundle-tab--active" : ""}`}
            onClick={() => setActiveTab("dares")}
          >
            Dares
            <span className="bundle-tab-count">{dareBundles.length}</span>
          </button>
        </div>
      </div>

      <div className="bundle-grid" style={{ marginTop: 32 }}>
        {bundles.map((bundle) => (
          <div key={bundle.label} className="bundle-card">
            <PhoneMock
              compact
              screenSrc={bundle.imageSrc}
              screenAlt={bundle.imageAlt}
            />
            <span className="bundle-card-label">{bundle.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
