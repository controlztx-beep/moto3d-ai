import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { Providers } from "@/app/providers";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOTO3D AI - AI-Powered 3D Motorcycle Configurator",
  description:
    "The most advanced AI-powered 3D motorcycle configurator for dealerships and OEMs. Real-time WebGL configuration, intelligent recommendations, and seamless web integration.",
  keywords: [
    "motorcycle configurator",
    "3D motorcycle",
    "AI dealership",
    "WebGL",
    "motorcycle sales",
    "MOTO3D",
    "Three.js",
    "embeddable configurator",
  ],
  authors: [{ name: "MOTO3D AI" }],
  openGraph: {
    title: "MOTO3D AI - AI-Powered 3D Motorcycle Configurator",
    description:
      "Configure any motorcycle in 3D with AI. Built for dealerships, manufacturers, and riders.",
    url: "https://moto3d.ai",
    siteName: "MOTO3D AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOTO3D AI - AI-Powered 3D Motorcycle Configurator",
    description:
      "Configure any motorcycle in 3D with AI. Real-time rendering and smart recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
