"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "./useScrollReveal";
import DownloadButton from "./DownloadButton";

export default function QuoteBreak({
  children,
  download = false,
}: {
  children: ReactNode;
  download?: boolean;
}) {
  const ref = useScrollReveal<HTMLElement>(0.3);

  return (
    <section ref={ref} className="quote-space flex items-center justify-center quote-reveal">
      <div className="mx-auto w-full max-w-[640px] px-6 text-center">
        <div className="gold-line" style={{ marginInline: "auto" }} />
        <p className="quote-copy">{children}</p>
        {download && (
          <div style={{ marginTop: 24 }}>
            <DownloadButton width={156} height={52} />
          </div>
        )}
      </div>
    </section>
  );
}
