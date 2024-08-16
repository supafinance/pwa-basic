import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWA } from '@/components/PWA'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: 'Supa',
  description: 'Follow, Track, and Trade Crypto With Your Friends.',
  url: 'https://getsupa.xyz',
  ogImage: '../public/supaPreview.png',
  links: {
    twitter: 'https://twitter.com/supafinance',
    github: 'https://github.com/supafinance',
  },
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [
    {
      name: 'Supa Labs',
      url: 'https://getsupa.xyz',
    },
  ],
  generator: 'Next.js',
  keywords: ['DeFi', 'Farcaster', 'Automation', 'Onchain'],
  creator: 'Supa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: '@supafinance',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/icons/supaIcon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}><PWA />{children}<Toaster /></body>
    </html>
  );
}
