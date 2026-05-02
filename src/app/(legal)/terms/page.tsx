import type { Metadata } from "next";
import { termsDoc } from "../content";
import { LegalDocRenderer } from "../LegalDocRenderer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms you agree to when using Bevy, the Truth or Dare card game app. Eligibility, subscriptions, content, liability, and user obligations.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service",
    description:
      "The terms you agree to when using Bevy, the Truth or Dare card game app.",
    url: "/terms",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfService() {
  return <LegalDocRenderer doc={termsDoc} />;
}
