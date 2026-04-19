import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Metadata Next.js uses when emitting the <meta property="og:image:*"> tags.
export const alt = "Bevy — Truth or Dare. Reimagined.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generates the Open Graph share card rendered when the URL is pasted
 * anywhere (iMessage, Slack, Twitter, etc.).
 *
 * Statically optimized: runs once at build time and the PNG is cached,
 * so font fetches etc. don't happen on every request.
 */
export default async function OpenGraphImage() {
  // Fonts are vendored as TrueType files under src/app/fonts so the
  // build doesn't depend on Google Fonts reachability / format negotiation.
  // Satori only decodes TTF/OTF; WOFF2 isn't supported.
  const [playfairRegular, playfairItalicBold, jakartaMedium, logoBuffer] =
    await Promise.all([
      readFile(join(process.cwd(), "src/app/fonts/PlayfairDisplay-Regular.ttf")),
      readFile(join(process.cwd(), "src/app/fonts/PlayfairDisplay-Italic.ttf")),
      readFile(join(process.cwd(), "src/app/fonts/PlusJakartaSans-Regular.ttf")),
      readFile(join(process.cwd(), "public/images/icons/bevy-logo.png")),
    ]);

  // Next.js's ImageResponse only supports data URIs / absolute URLs for <img>,
  // so inline the logo as a base64 data URI.
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 96px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(120, 20, 20, 0.28), transparent 55%), radial-gradient(circle at 80% 85%, rgba(198, 166, 120, 0.14), transparent 60%)",
          color: "#f4eee5",
          fontFamily: "Playfair Display",
          position: "relative",
        }}
      >
        {/* Logo mark top-left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 56,
          }}
        >
          <img
            src={logoDataUri}
            alt=""
            width={72}
            height={72}
            style={{ borderRadius: 8 }}
          />
          <div
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(244, 238, 229, 0.72)",
            }}
          >
            Bevy
          </div>
        </div>

        {/* Hero tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 110,
            lineHeight: 1.04,
            color: "rgba(244, 238, 229, 0.92)",
          }}
        >
          <span>Truth or Dare.</span>
          <span
            style={{
              fontFamily: "Playfair Display Italic",
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(244, 238, 229, 0.58)",
            }}
          >
            Reimagined.
          </span>
        </div>

        {/* Gold divider (brand signature) */}
        <div
          style={{
            width: 72,
            height: 2,
            marginTop: 36,
            marginBottom: 28,
            background:
              "linear-gradient(90deg, transparent 0%, #c6a678 20%, #e8c99f 50%, #c6a678 80%, transparent 100%)",
          }}
        />

        {/* Social proof. Intentionally ASCII-only — Satori has no access
            to glyphs outside the Latin subset we ship, so symbols like
            the unicode star would trigger a dynamic-font fetch that
            can't succeed at build time. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Plus Jakarta Sans",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "0.06em",
            color: "rgba(244, 238, 229, 0.56)",
          }}
        >
          <span style={{ color: "#e8c99f", fontWeight: 500 }}>4.7</span>
          <span>out of 5  ·  25K+ downloads on the App Store</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairRegular,
          style: "normal",
          weight: 500,
        },
        {
          name: "Playfair Display Italic",
          data: playfairItalicBold,
          style: "italic",
          weight: 700,
        },
        {
          name: "Plus Jakarta Sans",
          data: jakartaMedium,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}


