import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "FPL Wrapped 2024/25 - Your Fantasy Premier League Season Review",
  description:
    "Discover your Fantasy Premier League season highlights, stats, and achievements in a beautiful FIFA 25-style experience.",
  generator: "Next.js",
  applicationName: "FPL Wrapped",
  referrer: "origin-when-cross-origin",
  keywords: ["FPL", "Fantasy Premier League", "Football", "Soccer", "Statistics", "Season Review"],
  authors: [{ name: "FPL Wrapped Team" }],
  creator: "FPL Wrapped",
  publisher: "FPL Wrapped",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fpl-wrapped.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FPL Wrapped 2024/25 - Your Fantasy Premier League Season Review",
    description:
      "Discover your Fantasy Premier League season highlights, stats, and achievements in a beautiful FIFA 25-style experience.",
    siteName: "FPL Wrapped",
    images: [
      {
        url: "/images/homepage-podium.png",
        width: 1200,
        height: 630,
        alt: "FPL Wrapped - Fantasy Premier League Season Review",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FPL Wrapped 2024/25 - Your Fantasy Premier League Season Review",
    description:
      "Discover your Fantasy Premier League season highlights, stats, and achievements in a beautiful FIFA 25-style experience.",
    images: ["/images/homepage-podium.png"],
    creator: "@fplwrapped",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fantasy.premierleague.com" />
        <link rel="dns-prefetch" href="https://fantasy.premierleague.com" />
        <link rel="preload" href="/images/homepage-podium.png" as="image" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
