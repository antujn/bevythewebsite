// MARK: - Imports

import type { LegalBlock, LegalDoc, LegalRun } from "./content";

// MARK: - LegalDocRenderer
//
// Renders a `LegalDoc` (from ./content.ts) as JSX styled to match
// the prior hand-written legal pages exactly. Both this file and
// the parallel `LegalPdf.tsx` consume the same `LegalDoc` shape so
// any clause edited in `content.ts` flows to both surfaces with no
// drift.
//
// Visual fidelity rule: this renderer must produce HTML that the
// existing `.legal-copy` stylesheet styles as if it had been authored
// by hand. That means using the same tag set the original pages
// used: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`, `<strong>`, `<a>`.

export function LegalDocRenderer({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <p>
        <strong>
          {doc.effectiveDateLabel}: {doc.effectiveDate}
        </strong>
      </p>

      {/*
        Disclaimer-style intro paragraphs sit above the first
        numbered section. Other docs leave `intro` undefined and
        skip this block entirely.
      */}
      {doc.intro?.map((block, index) => {
        // The Disclaimer's first intro line is its all-caps preamble
        // ("BEVY WAIVER AND RELEASE OF LIABILITY..."), which the
        // original handwritten page rendered as an `<h3>`. Subsequent
        // intro lines are styled paragraphs.
        const Tag = index === 0 && doc.intro!.length > 1 ? "h3" : "p";
        return (
          <Tag key={`intro-${index}`}>
            <RenderBlock block={block} />
          </Tag>
        );
      })}

      {doc.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((item, index) => {
            const key = `${section.heading}-item-${index}`;
            switch (item.type) {
              case "paragraph":
                return (
                  <p key={key}>
                    <RenderBlock block={item.block} />
                  </p>
                );
              case "subheading":
                return <h3 key={key}>{item.text}</h3>;
              case "bullets":
                return (
                  <ul key={key}>
                    {item.blocks.map((bulletBlock, bulletIndex) => (
                      <li key={`${key}-bullet-${bulletIndex}`}>
                        <RenderBlock block={bulletBlock} />
                      </li>
                    ))}
                  </ul>
                );
            }
          })}
        </section>
      ))}
    </>
  );
}

/// Renders a sequence of inline runs (bold / link / plain) inside a
/// block. Newline characters in plain text are preserved by mapping
/// them to `<br />` tags so multi-line addresses render the way the
/// original hand-written pages did with `<br />` interspersed.
function RenderBlock({ block }: { block: LegalBlock }) {
  return (
    <>
      {block.map((run, index) => (
        <RenderRun key={index} run={run} />
      ))}
    </>
  );
}

function RenderRun({ run }: { run: LegalRun }) {
  // External links open in a new tab; internal links (those that
  // start with "/") use the default in-page behaviour. The
  // `rel="noopener noreferrer"` is a security default; without it,
  // the linked page can manipulate the window opener.
  if (run.href) {
    const isExternal = !run.href.startsWith("/");
    const content = renderTextWithLineBreaks(run.text);
    return (
      <a
        href={run.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {run.bold ? <strong>{content}</strong> : content}
      </a>
    );
  }

  const content = renderTextWithLineBreaks(run.text);
  return run.bold ? <strong>{content}</strong> : <>{content}</>;
}

/// Splits a string on `\n` and inserts `<br />` between segments.
/// Used so the address blocks ("By email: ...\nOperator: ...\n
/// Location: ...") render as three lines just like the originals.
function renderTextWithLineBreaks(text: string) {
  if (!text.includes("\n")) return text;
  const parts = text.split("\n");
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 ? <br /> : null}
    </span>
  ));
}
