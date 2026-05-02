import type { Metadata } from "next";
import { disclaimerDoc } from "../content";
import { LegalDocRenderer } from "../LegalDocRenderer";

export const metadata: Metadata = {
  title: "Legal Disclaimer",
  description:
    "Legal disclaimer, waiver, and release of liability for Bevy. How to use the app safely, age gating, and dare-related cautions.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Legal Disclaimer",
    description:
      "Legal disclaimer, waiver, and release of liability for Bevy.",
    url: "/disclaimer",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalDisclaimer() {
  return <LegalDocRenderer doc={disclaimerDoc} />;
}
