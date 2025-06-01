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
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
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
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('New version available! Reload to update?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Clear cache on version mismatch
              const currentVersion = '2.0.0';
              const storedVersion = localStorage.getItem('app-version');
              
              if (storedVersion && storedVersion !== currentVersion) {
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    names.forEach(function(name) {
                      caches.delete(name);
                    });
                  });
                }
                localStorage.clear();
                sessionStorage.clear();
              }
              
              localStorage.setItem('app-version', currentVersion);
            `,
          }}
        />
      </body>
    </html>
  )
}
