// MARK: - Imports

import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { LegalBlock, LegalDoc, LegalRun } from "@/app/(legal)/content";

// MARK: - LegalPdf
//
// Renders a `LegalDoc` as a real PDF using `@react-pdf/renderer`.
// Text inside the resulting PDF is selectable and searchable (a key
// requirement for legal docs — Cmd-F has to work when reviewers or
// regulators read it), and headings register as a navigable
// outline in any PDF viewer that supports it.
//
// Sized for A4 portrait with generous margins so the doc reads at
// "letter" quality on screen and prints cleanly. Typography is
// system-default (Helvetica) — keeping the PDF dependency-light
// avoids font-embedding overhead and ensures the file renders the
// same in any PDF viewer regardless of installed fonts.

// MARK: - Styles

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontSize: 10.5,
    lineHeight: 1.55,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  // Title block at the top of page 1.
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  effectiveDate: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 18,
    color: "#1a1a1a",
  },
  // Section heading and subheading.
  h2: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 6,
    color: "#1a1a1a",
  },
  h3: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#1a1a1a",
  },
  // Body paragraph.
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  // Bullet list and rows. Each row renders as a horizontal flex
  // pair (bullet + text) so long bullet text wraps correctly under
  // the bullet rather than under the whole row.
  bulletList: {
    marginBottom: 8,
    marginLeft: 6,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletMark: {
    width: 12,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    textAlign: "justify",
  },
  // Inline marks. react-pdf doesn't compose styles via cascade, so
  // every nested `Text` that needs bold / link styling must apply
  // these directly.
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  link: {
    color: "#9d2c1f",
    textDecoration: "underline",
  },
  // Footer line shown on every page — small attribution + page
  // number. Set as `fixed` so it appears on every paginated page
  // automatically.
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    fontSize: 8.5,
    color: "#6b6b6b",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// MARK: - Component

export function LegalPdf({ doc }: { doc: LegalDoc }) {
  return (
    <Document
      title={`${doc.title} \u2014 Bevy`}
      author="Anant Jain"
      subject={doc.title}
      creator="Bevy"
      producer="Bevy"
    >
      <Page size="A4" style={styles.page} wrap>
        <Text style={styles.title}>{doc.title}</Text>
        <Text style={styles.effectiveDate}>
          {doc.effectiveDateLabel}: {doc.effectiveDate}
        </Text>

        {/*
          Optional intro block (only the Disclaimer uses this).
          First line is bolded as a preamble heading; remainder
          render as paragraphs.
        */}
        {doc.intro?.map((block, index) => {
          const isPreamble = index === 0 && (doc.intro?.length ?? 0) > 1;
          return (
            <Text
              key={`intro-${index}`}
              style={isPreamble ? styles.h3 : styles.paragraph}
            >
              <RenderRuns runs={block} />
            </Text>
          );
        })}

        {doc.sections.map((section) => (
          <View
            key={section.heading}
            // wrap: false on a section keeps the heading + first
            // paragraph together when possible, but we leave wrap
            // alone so long sections still paginate sanely.
          >
            <Text style={styles.h2}>{section.heading}</Text>
            {section.body.map((item, index) => {
              const key = `${section.heading}-item-${index}`;
              switch (item.type) {
                case "paragraph":
                  return (
                    <Text key={key} style={styles.paragraph}>
                      <RenderRuns runs={item.block} />
                    </Text>
                  );
                case "subheading":
                  return (
                    <Text key={key} style={styles.h3}>
                      {item.text}
                    </Text>
                  );
                case "bullets":
                  return (
                    <View key={key} style={styles.bulletList}>
                      {item.blocks.map((bulletBlock, bulletIndex) => (
                        <View
                          key={`${key}-bullet-${bulletIndex}`}
                          style={styles.bulletRow}
                        >
                          <Text style={styles.bulletMark}>{"\u2022"}</Text>
                          <Text style={styles.bulletText}>
                            <RenderRuns runs={bulletBlock} />
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
              }
            })}
          </View>
        ))}

        {/*
          Footer fixed to every page. Attribution on the left, page
          number on the right via the dynamic render prop. Short
          identifier — "Bevy · {Doc Title}" — so a reader who only
          gets one page out of context still knows what they're
          looking at.
        */}
        <View style={styles.footer} fixed>
          <Text>{`Bevy \u00B7 ${doc.title}`}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// MARK: - Inline Runs

function RenderRuns({ runs }: { runs: LegalBlock }) {
  return (
    <>
      {runs.map((run, index) => (
        <RenderRun key={index} run={run} />
      ))}
    </>
  );
}

function RenderRun({ run }: { run: LegalRun }) {
  // Newlines in run text need to render as actual line breaks in
  // the PDF. `Text` nodes inside react-pdf preserve `\n` natively,
  // so we don't need any special handling beyond making sure the
  // string passes through.
  if (run.href) {
    // Internal links (start with "/") get prefixed with a base URL
    // so the PDF link is a real clickable URL. We hardcode the
    // canonical domain since the PDF is viewed outside of any
    // particular request context.
    const href = run.href.startsWith("/")
      ? `https://bevythewebsite.vercel.app${run.href}`
      : run.href;
    return (
      <Link src={href} style={[styles.link, run.bold ? styles.bold : {}]}>
        {run.text}
      </Link>
    );
  }

  return (
    <Text style={run.bold ? styles.bold : undefined}>{run.text}</Text>
  );
}
