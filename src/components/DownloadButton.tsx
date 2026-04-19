"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
    <motion.button
      onClick={triggerDownload}
      className={`inline-flex cursor-pointer items-center justify-center border border-white/24 bg-white/[0.09] p-[5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${className}`}
      style={{ borderRadius: 9999 }}
      whileHover={{
        scale: 1.05,
        borderColor: "rgba(255, 255, 255, 0.38)",
        backgroundColor: "rgba(255, 255, 255, 0.14)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 22,
      }}
    >
      <span className="block overflow-hidden" style={{ borderRadius: 9999 }}>
        <Image
          src="/images/icons/appstore-dark.png"
          alt="Download on the App Store"
          width={width}
          height={height}
          draggable={false}
        />
      </span>
    </motion.button>
  );
}
