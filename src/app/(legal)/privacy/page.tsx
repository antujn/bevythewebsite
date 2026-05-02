import type { Metadata } from "next";
import { privacyDoc } from "../content";
import { LegalDocRenderer } from "../LegalDocRenderer";

export const metadata: Metadata = {
  // Root layout's template wraps this as "Privacy Policy · Bevy".
  title: "Privacy Policy",
  description:
    "How Bevy collects, stores, and protects your data. GDPR / UK GDPR compliant privacy policy for the Truth or Dare card game app.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description:
      "How Bevy collects, stores, and protects your data. GDPR / UK GDPR compliant privacy policy for the Truth or Dare card game app.",
    url: "/privacy",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {
  return <LegalDocRenderer doc={privacyDoc} />;
}
