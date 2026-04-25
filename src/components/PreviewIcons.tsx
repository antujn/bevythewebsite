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
  gradient?: "gunmetal" | "charcoal";
};

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
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-teal",
    label: "Dark Teal",
    fileBase: "BevyDarkTealIcon",
    tileBackground: "#1A3A3D",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-royal",
    label: "Dark Royal",
    fileBase: "BevyDarkRoyalIcon",
    tileBackground: "#001F2A",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-black",
    label: "Dark Black",
    fileBase: "BevyDarkBlackIcon",
    tileBackground: "#000000",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-orange",
    label: "Dark Orange",
    fileBase: "BevyDarkOrangeIcon",
    tileBackground: "#B3371C",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-plum",
    label: "Dark Plum",
    fileBase: "BevyDarkPlumIcon",
    tileBackground: "#3A0D1C",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-night",
    label: "Dark Night",
    fileBase: "BevyDarkNightIcon",
    tileBackground: "#0D0D18",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-pink",
    label: "Dark Pink",
    fileBase: "BevyDarkPinkIcon",
    tileBackground: "#8C1F43",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-navy",
    label: "Dark Navy",
    fileBase: "BevyDarkNavyIcon",
    tileBackground: "#00002A",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-green",
    label: "Dark Green",
    fileBase: "BevyDarkGreenIcon",
    tileBackground: "#002B00",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "dark-silver",
    label: "Dark Silver",
    fileBase: "BevyDarkSilverIcon",
    tileBackground: "#444444",
    logoSrc: "/images/icons/app-icons/logo-red-512.png",
  },
  {
    id: "premium-gunmetal",
    label: "Premium Gunmetal Noir",
    fileBase: "BevyDarkGunmetalNoirIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #2b313a 0%, #1d2128 55%, #13161b 100%)",
    logoSrc: "/images/icons/app-icons/logo-gunmetal.png",
    premium: true,
    gradient: "gunmetal",
  },
  {
    id: "premium-charcoal",
    label: "Premium Charcoal Platinum",
    fileBase: "BevyDarkCharcoalPlatinumIcon",
    tileBackground:
      "radial-gradient(120% 120% at 30% 20%, #32383f 0%, #20242b 55%, #15181d 100%)",
    logoSrc: "/images/icons/app-icons/logo-offwhite.png",
    premium: true,
    gradient: "charcoal",
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

      if (variant.gradient === "gunmetal") {
        const g = ctx.createRadialGradient(
          EXPORT_SIZE * 0.3,
          EXPORT_SIZE * 0.2,
          EXPORT_SIZE * 0.08,
          EXPORT_SIZE * 0.45,
          EXPORT_SIZE * 0.55,
          EXPORT_SIZE * 0.95,
        );
        g.addColorStop(0, "#2b313a");
        g.addColorStop(0.55, "#1d2128");
        g.addColorStop(1, "#13161b");
        ctx.fillStyle = g;
      } else if (variant.gradient === "charcoal") {
        const g = ctx.createRadialGradient(
          EXPORT_SIZE * 0.3,
          EXPORT_SIZE * 0.2,
          EXPORT_SIZE * 0.08,
          EXPORT_SIZE * 0.45,
          EXPORT_SIZE * 0.55,
          EXPORT_SIZE * 0.95,
        );
        g.addColorStop(0, "#32383f");
        g.addColorStop(0.55, "#20242b");
        g.addColorStop(1, "#15181d");
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
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

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
        {ICON_VARIANTS.map((icon) => (
          <figure key={icon.id} className="preview-icon-card">
            <div
              className={`preview-icon-tile${icon.premium ? " is-premium" : ""}`}
              style={{ background: icon.tileBackground }}
            >
              <div className="preview-icon-tile__sheen" aria-hidden="true" />
              <div className="preview-icon-logo-wrap">
                <Image
                  src={icon.logoSrc}
                  alt={`${icon.label} app icon`}
                  fill
                  sizes="(max-width: 900px) 38vw, 180px"
                  className="preview-icon-logo"
                />
              </div>
            </div>
            <figcaption className="preview-icon-name">{icon.fileBase}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
