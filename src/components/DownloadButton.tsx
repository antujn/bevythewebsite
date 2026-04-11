"use client";

import Image from "next/image";
import { useDownload } from "./DownloadContext";

export default function DownloadButton({
  width = 156,
  height = 52,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const { triggerDownload } = useDownload();

  return (
    <button
      onClick={triggerDownload}
      className={`inline-flex cursor-pointer items-center justify-center border border-white/24 bg-white/[0.09] p-[5px] transition-[transform,border-color,background-color] duration-200 hover:scale-105 hover:border-white/36 hover:bg-white/[0.12] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${className}`}
      style={{ borderRadius: 9999 }}
    >
      <span className="block overflow-hidden" style={{ borderRadius: 9999 }}>
        <Image
          src="/images/icons/appstore-dark.png"
          alt="Download on the App Store"
          width={width}
          height={height}
        />
      </span>
    </button>
  );
}
