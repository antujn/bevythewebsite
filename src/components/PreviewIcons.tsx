"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type IconVariant = {
  id: string;
  label: string;
  fileBase: string;
  tileBackground: string;
  logoSrc: string;
  premium?: boolean;
  gradient?: "gunmetal" | "cobalt" | "palladium" | "iridium";
};

// MARK: - Premium logo palettes
//
// Each premium tier's logo is recolored at draw time with a top-to-bottom
// linear gradient — applied as a `source-in` mask onto the logo's alpha
// silhouette so the glyph reads as forged from the tier's metal. Most
// tiers use a 3-stop monochrome metal ramp; Iridium uses a 5-stop
// iridescent oil-slick ramp to honor its "alien apex" brief.
type GradientStop = [offset: number, color: string];

const PREMIUM_LOGO_STOPS: Record<NonNullable<IconVariant["gradient"]>, GradientStop[]> = {
  // Polished steel — clean monochrome, matte industrial entry.
  gunmetal: [
    [0, "#bcc4d2"],
    [0.55, "#8b95a4"],
    [1, "#50596a"],
  ],
  // Frosted blue-steel — high-tech specialist tier.
  cobalt: [
    [0, "#aac0e3"],
    [0.55, "#6f86b3"],
    [1, "#3a4868"],
  ],
  // Dark brushed graphite against bright Palladium tile (inverted
  // contrast so the glyph still reads on a near-white background).
  palladium: [
    [0, "#3a4252"],
    [0.55, "#5c6677"],
    [1, "#7e889c"],
  ],
  // Iridescent oil-slick — apex/alien tier. The hue rotation
  // (cyan → blue → violet → magenta → warm gold) mimics the way thin-
  // film interference shifts color across an iridium meteorite or a
  // gasoline puddle, giving Iridium a clearly distinct identity from
  // Gunmetal's flat steel.
  iridium: [
    [0, "#7ad8ff"],
    [0.25, "#5e7fff"],
    [0.5, "#a558ff"],
    [0.75, "#ff5fc7"],
    [1, "#ffb84a"],
  ],
};

// CSS gradient form of `PREMIUM_LOGO_STOPS`, used by the live DOM
// preview via `background-image` + `-webkit-mask` so the on-screen
// tile visually matches the canvas export.
const PREMIUM_LOGO_CSS_GRADIENT: Record<NonNullable<IconVariant["gradient"]>, string> =
  Object.fromEntries(
    Object.entries(PREMIUM_LOGO_STOPS).map(([key, stops]) => [
      key,
      `linear-gradient(180deg, ${stops
        .map(([offset, color]) => `${color} ${offset * 100}%`)
        .join(", ")})`,
    ]),
  ) as Record<NonNullable<IconVariant["gradient"]>, string>;

type PreviewIconsProps = {
  downloadAllSignal?: number;
  onDownloadStateChange?: (isDownloading: boolean) => void;
};

const EXPORT_SIZE = 1024;
const LOGO_SCALE = 0.64;

const ICON_VARIANTS: IconVariant[] = [
  {
    id: "dark-red",
    label: "Dark Red",
    fileBase: "BevyDarkRedIcon",
    tileBackground: "#610000",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  // Wraith — same maroon tile as Dark Red, but the red logo is
  // replaced with a pure-black silhouette so the glyph reads as a
  // deeper recess in the background rather than a graphic riding on
  // top of it. Named for the "shadow on blood" feel it lands with.
  {
    id: "dark-wraith",
    label: "Wraith",
    fileBase: "BevyDarkWraithIcon",
    tileBackground: "#610000",
    logoSrc: "/images/icons/bevy-logo-black.png",
  },
  {
    id: "dark-teal",
    label: "Dark Teal",
    fileBase: "BevyDarkTealIcon",
    tileBackground: "#1A3A3D",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-royal",
    label: "Dark Royal",
    fileBase: "BevyDarkRoyalIcon",
    tileBackground: "#001F2A",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-black",
    label: "Dark Black",
    fileBase: "BevyDarkBlackIcon",
    tileBackground: "#000000",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  // Ghost — pure black tile with the off-white logo, giving the
  // high-contrast monochrome treatment a clearly legible glyph
  // (the standard Dark Black uses the red logo, which can read as
  // muddy on jet black). Named for the pale silhouette floating in
  // the void.
  {
    id: "dark-ghost",
    label: "Ghost",
    fileBase: "BevyDarkGhostIcon",
    tileBackground: "#000000",
    logoSrc: "/images/icons/bevy-logo-white.png",
  },
  // Shadow — pure black tile with the gunmetal-grey logo, sitting
  // visually between Dark Black (red on black, hot) and Ghost
  // (white on black, ice-cold). The muted grey reads as a
  // half-emerged silhouette — present but receding — which is
  // exactly the "shadow" mood the name implies.
  {
    id: "dark-shadow",
    label: "Shadow",
    fileBase: "BevyDarkShadowIcon",
    tileBackground: "#000000",
    logoSrc: "/images/icons/bevy-logo-grey.png",
  },
  {
    id: "dark-orange",
    label: "Dark Orange",
    fileBase: "BevyDarkOrangeIcon",
    tileBackground: "#B3371C",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-plum",
    label: "Dark Plum",
    fileBase: "BevyDarkPlumIcon",
    tileBackground: "#3A0D1C",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-night",
    label: "Dark Night",
    fileBase: "BevyDarkNightIcon",
    tileBackground: "#0D0D18",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-pink",
    label: "Dark Pink",
    fileBase: "BevyDarkPinkIcon",
    tileBackground: "#8C1F43",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-navy",
    label: "Dark Navy",
    fileBase: "BevyDarkNavyIcon",
    tileBackground: "#00002A",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-green",
    label: "Dark Green",
    fileBase: "BevyDarkGreenIcon",
    tileBackground: "#002B00",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  {
    id: "dark-silver",
    label: "Dark Silver",
    fileBase: "BevyDarkSilverIcon",
    tileBackground: "#444444",
    logoSrc: "/images/icons/bevy-logo.png",
  },
  // Premium tiers all share the canonical Bevy silhouette
  // (`bevy-logo.png`); its color is discarded at render time and
  // replaced with a per-tier brushed-metal gradient via `source-in`
  // alpha-mask compositing.
  {
    id: "premium-gunmetal",
    label: "Premium Gunmetal",
    fileBase: "BevyDarkGunmetalIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #2b313a 0%, #1d2128 55%, #13161b 100%)",
    logoSrc: "/images/icons/bevy-logo.png",
    premium: true,
    gradient: "gunmetal",
  },
  {
    id: "premium-cobalt",
    label: "Premium Cobalt",
    fileBase: "BevyDarkCobaltIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #5b6e94 0%, #2f3a55 55%, #161b2d 100%)",
    logoSrc: "/images/icons/bevy-logo.png",
    premium: true,
    gradient: "cobalt",
  },
  {
    id: "premium-palladium",
    label: "Premium Palladium",
    fileBase: "BevyDarkPalladiumIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #fafcff 0%, #dde3ee 55%, #a8b2c4 100%)",
    logoSrc: "/images/icons/bevy-logo.png",
    premium: true,
    gradient: "palladium",
  },
  {
    id: "premium-iridium",
    label: "Premium Iridium",
    fileBase: "BevyDarkIridiumIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #3a3148 0%, #231b30 55%, #0f0918 100%)",
    logoSrc: "/images/icons/bevy-logo.png",
    premium: true,
    gradient: "iridium",
  },
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function PreviewIcons({
  downloadAllSignal,
  onDownloadStateChange,
}: PreviewIconsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  // Tracks the variant currently being exported via a single-icon
  // click. `null` when no individual download is in flight. Used to
  // gate concurrent clicks and to drive a per-tile downloading state
  // for visual feedback. Distinct from `isDownloading` (which fires
  // for the bulk Download-All path) so a single-icon click can show
  // its own subtle indicator without dimming the whole grid.
  const [downloadingVariantId, setDownloadingVariantId] = useState<string | null>(null);
  const lastSignalRef = useRef<number | null>(null);
  const imageCacheRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());

  const loadImage = useCallback((src: string) => {
    const existing = imageCacheRef.current.get(src);
    if (existing) return existing;

    const p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.decoding = "async";
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load icon image: ${src}`));
      img.src = src;
    });

    imageCacheRef.current.set(src, p);
    return p;
  }, []);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const renderIconBlob = useCallback(
    async (variant: IconVariant): Promise<Blob> => {
      const canvas = document.createElement("canvas");
      canvas.width = EXPORT_SIZE;
      canvas.height = EXPORT_SIZE;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        throw new Error("Could not create 2D context for icon export.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const radius = Math.round(EXPORT_SIZE * 0.22);
      drawRoundedRect(ctx, 0, 0, EXPORT_SIZE, EXPORT_SIZE, radius);
      ctx.save();
      ctx.clip();

      // Premium tile gradients use a shared radial geometry anchored
      // top-left so the highlight reads consistently across variants.
      // Each tier picks its own stop palette below; Iridium's tile
      // shifts violet-black to clearly distinguish it from Gunmetal.
      const premiumTileStops: Record<NonNullable<IconVariant["gradient"]>, GradientStop[]> = {
        gunmetal: [
          [0, "#2b313a"],
          [0.55, "#1d2128"],
          [1, "#13161b"],
        ],
        cobalt: [
          [0, "#5b6e94"],
          [0.55, "#2f3a55"],
          [1, "#161b2d"],
        ],
        palladium: [
          [0, "#fafcff"],
          [0.55, "#dde3ee"],
          [1, "#a8b2c4"],
        ],
        iridium: [
          [0, "#3a3148"],
          [0.55, "#231b30"],
          [1, "#0f0918"],
        ],
      };

      if (variant.gradient && variant.gradient in premiumTileStops) {
        const g = ctx.createRadialGradient(
          EXPORT_SIZE * 0.3,
          EXPORT_SIZE * 0.2,
          EXPORT_SIZE * 0.08,
          EXPORT_SIZE * 0.45,
          EXPORT_SIZE * 0.55,
          EXPORT_SIZE * 0.95,
        );
        for (const [offset, color] of premiumTileStops[variant.gradient]) {
          g.addColorStop(offset, color);
        }
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = variant.tileBackground;
      }
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);

      const topSheen = ctx.createRadialGradient(
        EXPORT_SIZE * 0.5,
        -EXPORT_SIZE * 0.1,
        EXPORT_SIZE * 0.05,
        EXPORT_SIZE * 0.5,
        -EXPORT_SIZE * 0.1,
        EXPORT_SIZE * 0.95,
      );
      topSheen.addColorStop(0, "rgba(255,255,255,0.18)");
      topSheen.addColorStop(0.58, "rgba(255,255,255,0)");
      ctx.fillStyle = topSheen;
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);

      const bottomShade = ctx.createRadialGradient(
        EXPORT_SIZE * 0.5,
        EXPORT_SIZE * 1.12,
        EXPORT_SIZE * 0.05,
        EXPORT_SIZE * 0.5,
        EXPORT_SIZE * 1.12,
        EXPORT_SIZE * 0.95,
      );
      bottomShade.addColorStop(0, "rgba(0,0,0,0.24)");
      bottomShade.addColorStop(0.6, "rgba(0,0,0,0)");
      ctx.fillStyle = bottomShade;
      ctx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);

      const logo = await loadImage(variant.logoSrc);
      const logoSize = EXPORT_SIZE * LOGO_SCALE;
      const logoX = (EXPORT_SIZE - logoSize) / 2;
      const logoY = (EXPORT_SIZE - logoSize) / 2;

      if (variant.gradient && variant.gradient in PREMIUM_LOGO_STOPS) {
        // Premium tier: render the logo into an offscreen canvas, then
        // composite a vertical brushed-metal gradient onto its alpha
        // silhouette. This makes the glyph read as forged from the
        // tier's metal rather than a flat-tinted decal.
        const off = document.createElement("canvas");
        off.width = Math.round(logoSize);
        off.height = Math.round(logoSize);
        const offCtx = off.getContext("2d", { alpha: true });
        if (!offCtx) {
          throw new Error("Could not create offscreen 2D context for logo masking.");
        }
        offCtx.imageSmoothingEnabled = true;
        offCtx.imageSmoothingQuality = "high";

        // 1. Stamp the source silhouette (its color will be discarded).
        offCtx.drawImage(logo, 0, 0, off.width, off.height);

        // 2. Replace the silhouette's pixels with the metal gradient,
        //    keeping the original alpha mask. Variable stop count so
        //    Iridium can use a 5-stop iridescent ramp while the others
        //    keep their 3-stop monochrome ramp.
        const grad = offCtx.createLinearGradient(0, 0, 0, off.height);
        for (const [offset, color] of PREMIUM_LOGO_STOPS[variant.gradient]) {
          grad.addColorStop(offset, color);
        }
        offCtx.globalCompositeOperation = "source-in";
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, off.width, off.height);
        offCtx.globalCompositeOperation = "source-over";

        ctx.drawImage(off, logoX, logoY, logoSize, logoSize);
      } else {
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
      }

      ctx.restore();

      return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Icon export failed while encoding PNG."));
            return;
          }
          resolve(blob);
        }, "image/png");
      });
    },
    [loadImage],
  );

  const downloadAllIcons = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    onDownloadStateChange?.(true);

    try {
      for (const variant of ICON_VARIANTS) {
        const blob = await renderIconBlob(variant);
        downloadBlob(blob, `${variant.fileBase}.png`);
        // Keep browser download manager responsive while dispatching
        // many files from one click.
        await wait(120);
      }
    } catch (err) {
      console.error("Downloading icons failed", err);
    } finally {
      setIsDownloading(false);
      onDownloadStateChange?.(false);
    }
  }, [downloadBlob, isDownloading, onDownloadStateChange, renderIconBlob]);

  /// Renders and downloads a single variant. Gated on the bulk
  /// download state so individual clicks during a Download-All
  /// session don't race with the queued bulk export, and gated on
  /// `downloadingVariantId` so the same variant can't be queued
  /// twice from rapid double-clicks.
  const downloadSingleIcon = useCallback(
    async (variant: IconVariant) => {
      if (isDownloading || downloadingVariantId !== null) return;

      setDownloadingVariantId(variant.id);
      try {
        const blob = await renderIconBlob(variant);
        downloadBlob(blob, `${variant.fileBase}.png`);
      } catch (err) {
        console.error(`Downloading ${variant.fileBase} failed`, err);
      } finally {
        setDownloadingVariantId(null);
      }
    },
    [downloadBlob, downloadingVariantId, isDownloading, renderIconBlob],
  );

  useEffect(() => {
    if (downloadAllSignal == null) return;
    if (lastSignalRef.current == null) {
      lastSignalRef.current = downloadAllSignal;
      return;
    }
    if (lastSignalRef.current === downloadAllSignal) return;
    lastSignalRef.current = downloadAllSignal;
    void downloadAllIcons();
  }, [downloadAllIcons, downloadAllSignal]);

  return (
    <div className="preview-icons-wrap" aria-label="Bevy icon variants">
      <div className="preview-icons-grid">
        {ICON_VARIANTS.map((icon) => {
          const isThisDownloading = downloadingVariantId === icon.id;
          const isAnyDownloading = isDownloading || downloadingVariantId !== null;
          return (
            <figure key={icon.id} className="preview-icon-card">
              {/*
                Tile is a button so each icon doubles as its own
                download trigger — clicking renders a 1024×1024 PNG
                of just that variant via the same canvas pipeline
                used by Download All. Disabled while either a bulk
                export or another single-icon export is in flight,
                so concurrent clicks can't race the canvas.
              */}
              <button
                type="button"
                onClick={() => void downloadSingleIcon(icon)}
                disabled={isAnyDownloading}
                aria-label={`Download ${icon.label} app icon`}
                aria-busy={isThisDownloading || undefined}
                className={`preview-icon-tile${icon.premium ? " is-premium" : ""}${
                  isThisDownloading ? " is-downloading" : ""
                }`}
                style={{ background: icon.tileBackground }}
              >
                <div className="preview-icon-tile__sheen" aria-hidden="true" />
                <div className="preview-icon-logo-wrap">
                  {icon.gradient && icon.gradient in PREMIUM_LOGO_CSS_GRADIENT ? (
                    // Premium tier: render the logo as a CSS mask
                    // filled with the per-tier brushed-metal
                    // gradient, mirroring the canvas export's
                    // `source-in` compositing.
                    <div
                      role="img"
                      aria-label={`${icon.label} app icon`}
                      className="preview-icon-logo preview-icon-logo--metal"
                      style={{
                        backgroundImage: PREMIUM_LOGO_CSS_GRADIENT[icon.gradient],
                        WebkitMaskImage: `url(${icon.logoSrc})`,
                        maskImage: `url(${icon.logoSrc})`,
                      }}
                    />
                  ) : (
                    <Image
                      src={icon.logoSrc}
                      alt={`${icon.label} app icon`}
                      fill
                      sizes="(max-width: 900px) 38vw, 180px"
                      className="preview-icon-logo"
                    />
                  )}
                </div>
              </button>
              <figcaption className="preview-icon-name">{icon.fileBase}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
