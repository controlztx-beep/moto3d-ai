import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";

import { Providers } from "@/app/providers";
import { CookieBanner } from "@/components/layout/CookieBanner";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://moto3d.vercel.app'),
  title: {
    default: 'MOTO3D AI - AI-Powered 3D Motorcycle Configurator',
    template: '%s | MOTO3D AI'
  },
  description: 'The most advanced AI-powered 3D motorcycle configurator. Let your customers build their dream bike with intelligent recommendations, real-time 3D visualization, and detailed part specifications.',
  keywords: ['motorcycle configurator', '3D motorcycle', 'AI motorcycle', 'bike customization', 'motorcycle parts', 'SaaS', 'B2B motorcycle', 'configurateur moto', 'moto 3D'],
  authors: [{ name: 'MOTO3D AI' }],
  creator: 'MOTO3D AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'MOTO3D AI',
    title: 'MOTO3D AI - AI-Powered 3D Motorcycle Configurator',
    description: 'Configure any motorcycle in 3D with AI. Real-time visualization, intelligent recommendations, detailed specifications.',
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'MOTO3D AI' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOTO3D AI - AI-Powered 3D Motorcycle Configurator',
    description: 'Configure any motorcycle in 3D with AI assistance.',
    images: ['/api/og']
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' }
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
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <CookieBanner />
      </body>
    </html>
  );
}
