import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bevytheapp.com"),
  title: "Bevy — Truth or Dare. Reimagined.",
  description:
    "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards. Designed to deepen human connection.",
  openGraph: {
    title: "Bevy — Truth or Dare. Reimagined.",
    description:
      "The modern, meaningful alternative to traditional truth or dare. AI-powered. 1000+ cards.",
    url: "https://www.bevytheapp.com",
    siteName: "Bevy",
    type: "website",
    images: [
      {
        url: "/images/illustrations/illustration3.png",
        width: 1200,
        height: 630,
        alt: "Bevy — Truth or Dare. Reimagined.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bevy — Truth or Dare. Reimagined.",
    description:
      "The modern, meaningful alternative to traditional truth or dare.",
    images: ["/images/illustrations/illustration3.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/images/icons/bevy-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
