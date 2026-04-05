import type { ReactNode } from "react";

export default function QuoteBreak({ children }: { children: ReactNode }) {
  return (
    <section className="quote-space flex items-center justify-center">
      <div className="mx-auto w-full max-w-[640px] px-6 text-center">
        <div className="gold-line" style={{ marginInline: 'auto' }} />
        <p className="quote-copy">{children}</p>
      </div>
    </section>
  );
}
