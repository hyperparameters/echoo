import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { PrivyProvider } from "@/components/privy-provider";
import "./globals.css";

// This is required for Next.js 13+ to ensure proper client-side routing
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
if (!PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID environment variable is not set');
}

// Viewport configuration
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: "Echoo - Transform your content into influence",
  description: "AI-powered influencer app for content creators",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Echoo",
  },
  icons: {
    icon: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <body>
        <PrivyProvider>
          <Providers>
            <Suspense fallback={<div>Loading...</div>}>
              <div className="min-h-screen radial-gradient-bg">{children}</div>
              <Analytics />
            </Suspense>
          </Providers>
        </PrivyProvider>
      </body>
    </html>
  );
}
