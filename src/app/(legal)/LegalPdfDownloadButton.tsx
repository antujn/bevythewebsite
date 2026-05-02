"use client";

// MARK: - Imports

import { useState } from "react";
import { motion } from "motion/react";
import type { LegalDoc } from "./content";

// MARK: - LegalPdfDownloadButton
//
// Compact "Download PDF" button shown alongside the legal page
// title. Lazy-loads `@react-pdf/renderer` and the `LegalPdf`
// component on first click so the ~150KB PDF dependency doesn't
// land in the initial route bundle for the 99% of visitors who
// only want to read the page.

const SLUG_REPLACEMENTS: [RegExp, string][] = [
  [/[^\p{Letter}\p{Number}\s-]+/gu, ""],
  [/\s+/g, "-"],
  [/-+/g, "-"],
];

/// Slugs the doc title for use in the downloaded filename:
///   "Terms of Service" -> "terms-of-service"
function slugifyTitle(title: string): string {
  let result = title.trim().toLowerCase();
  for (const [pattern, replacement] of SLUG_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/^-|-$/g, "");
}

export function LegalPdfDownloadButton({ doc }: { doc: LegalDoc }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleClick = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      // Dynamic import keeps the PDF deps out of the page's static
      // bundle. `pdf()` returns a stream-like helper; `toBlob()`
      // resolves to a real Blob we can hand off to a download.
      const [{ pdf }, { LegalPdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/LegalPdf"),
      ]);

      const blob = await pdf(<LegalPdf doc={doc} />).toBlob();
      const url = URL.createObjectURL(blob);

      const filename = `bevy-${slugifyTitle(doc.title)}.pdf`;
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Slight delay before revoking the object URL — Safari
      // otherwise can race the click handler and download nothing.
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (error) {
      console.error("Failed to generate legal PDF", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={isGenerating}
      whileHover={isGenerating ? undefined : { y: -1 }}
      whileTap={isGenerating ? undefined : { y: 0, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      // All structural styles are applied inline so they always
      // beat any cascading reset (Tailwind preflight, browser
      // defaults). Hover / focus / disabled states still come from
      // the className string since those need pseudo-class selectors.
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 18,
        borderRadius: 999,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        backgroundColor: "rgba(217, 82, 58, 0.14)",
        color: "rgba(244, 238, 229, 0.92)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        cursor: isGenerating ? "progress" : "pointer",
        opacity: isGenerating ? 0.6 : 1,
        transition: "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
        whiteSpace: "nowrap",
      }}
      className={[
        "hover:border-white/25 hover:bg-[rgba(217,82,58,0.24)] hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
      ].join(" ")}
      aria-label={`Download ${doc.title} as PDF`}
      aria-busy={isGenerating || undefined}
    >
      <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>
        {isGenerating ? "\u22EF" : "\u2193"}
      </span>
      <span>{isGenerating ? "Preparing\u2026" : "Download PDF"}</span>
    </motion.button>
  );
}
