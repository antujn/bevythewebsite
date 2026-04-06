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
      className={`inline-block transition-transform hover:scale-105 active:scale-95 ${className}`}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <Image
        src="/images/icons/appstore-dark.png"
        alt="Download on the App Store"
        width={width}
        height={height}
      />
    </button>
  );
}
