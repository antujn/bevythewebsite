import type { MetadataRoute } from "next";

// PWA / "Add to Home Screen" manifest. Next.js App Router auto-serves
// this at /manifest.webmanifest and includes the corresponding <link>
// tag in the <head>.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bevy — Truth or Dare. Reimagined.",
    short_name: "Bevy",
    description:
      "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards. Designed to deepen human connection.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
