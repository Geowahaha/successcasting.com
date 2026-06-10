import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai, Space_Grotesk, Work_Sans } from "next/font/google";
import "./globals.css";
import { buildOrganizationJsonLd } from "@/lib/seo/structuredData";
import { siteConfig } from "@/lib/seo/site";

import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["300", "400", "500", "600"],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  metadataBase: new URL(process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.successcasting.com"),
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    type: "website",
    url: process.env.NEXT_PUBLIC_CANONICAL_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.successcasting.com",
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630, alt: "Success Casting industrial foundry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [siteConfig.defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const org = buildOrganizationJsonLd();
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${workSans.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="forge-surface flex min-h-full flex-col">
        <Providers>
          <main className="flex-1">{children}</main>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
          />
        </Providers>
      </body>
    </html>
  );
}
