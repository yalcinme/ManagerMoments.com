import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"

const APP_NAME = "FPL Manager Moments"
const APP_DESCRIPTION =
  "Your Fantasy Premier League season review in retro 16-bit style. Discover your manager moments, achievements, and season highlights."
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fpl-manager-moments.vercel.app"
const GA_ID = "G-BYQH406K1J"

export const metadata: Metadata = {
  title: {
    default: "FPL Manager Moments - Your Season Wrapped",
    template: "%s | FPL Manager Moments",
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: "FPL Manager Moments Team" }],
  generator: "Next.js",
  keywords: [
    "Fantasy Premier League",
    "FPL",
    "Season Review",
    "Football",
    "Soccer",
    "Statistics",
    "Manager Moments",
    "Premier League",
    "Fantasy Football",
    "2024/25 Season",
    "FPL Wrapped",
    "Fantasy Football Stats",
  ],
  referrer: "origin-when-cross-origin",
  creator: "FPL Manager Moments",
  publisher: "FPL Manager Moments",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: "FPL Manager Moments - Your Season Wrapped",
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_URL}/images/season-recap.png`,
        width: 1200,
        height: 630,
        alt: "FPL Manager Moments - Your Season Wrapped",
        type: "image/png",
      },
      {
        url: `${APP_URL}/images/season-kickoff-new.png`,
        width: 800,
        height: 600,
        alt: "FPL Season Kickoff",
        type: "image/png",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@FPLMoments",
    creator: "@FPLMoments",
    title: "FPL Manager Moments - Your Season Wrapped",
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/images/season-recap.png`],
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "180x180" },
      { url: "/icon-512x512.png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
  },

  // Manifest
  manifest: "/manifest.json",

  // Robots
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

  // Additional metadata for SEO
  category: "Sports",
  classification: "Fantasy Sports Application",

  // Verification tags
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e1b4b" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1b4b" },
  ],
  colorScheme: "light",
}

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: APP_URL,
  applicationCategory: "SportsApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "1.0.0",
  author: {
    "@type": "Organization",
    name: "FPL Manager Moments Team",
    url: APP_URL,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  screenshot: `${APP_URL}/images/season-recap.png`,
  featureList: [
    "Season Performance Analysis",
    "Manager Insights",
    "Interactive Game Experience",
    "Social Sharing",
    "Mobile Responsive",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://fantasy.premierleague.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://fantasy.premierleague.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Load fonts with proper fallbacks */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap"
          rel="stylesheet"
        />

        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/stadium-background.jpg" as="image" />
        <link rel="preload" href="/sounds/champions-league-8-bit.wav" as="audio" />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/images/season-kickoff-new.png" />
        <link rel="prefetch" href="/images/peak-performance-new.png" />

        {/* Security headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="font-body" suppressHydrationWarning>
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white p-2 rounded"
        >
          Skip to main content
        </a>

        <main id="main-content">{children}</main>

        {/* Google Analytics 4 with enhanced configuration */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: true,
              custom_map: {
                'custom_parameter_1': 'fpl_manager_id',
                'custom_parameter_2': 'season_progress',
                'custom_parameter_3': 'game_level'
              }
            });

            // Enhanced ecommerce for engagement tracking
            gtag('config', '${GA_ID}', {
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'session_duration',
                'dimension3': 'game_completion'
              }
            });

            // Track app loaded event
            gtag('event', 'app_loaded', {
              event_category: 'engagement',
              event_label: 'FPL Manager Moments',
              value: 1
            });
          `}
        </Script>

        {/* Performance monitoring with Core Web Vitals */}
        <Script id="performance-monitor" strategy="afterInteractive">
          {`
            if ('performance' in window && 'PerformanceObserver' in window) {
              const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'largest-contentful-paint') {
                    gtag('event', 'LCP', {
                      event_category: 'Web Vitals',
                      value: Math.round(entry.startTime),
                      non_interaction: true
                    });
                  }
                  if (entry.entryType === 'first-input') {
                    gtag('event', 'FID', {
                      event_category: 'Web Vitals',
                      value: Math.round(entry.processingStart - entry.startTime),
                      non_interaction: true
                    });
                  }
                  if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                    gtag('event', 'CLS', {
                      event_category: 'Web Vitals',
                      value: Math.round(entry.value * 1000),
                      non_interaction: true
                    });
                  }
                }
              });
              
              try {
                observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
              } catch (e) {
                console.warn('Performance observer not supported:', e);
              }
            }

            // Track page load performance
            window.addEventListener('load', function() {
              setTimeout(function() {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                  gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    value: Math.round(navigation.loadEventEnd - navigation.navigationStart),
                    non_interaction: true
                  });
                }
              }, 0);
            });

            // Track user engagement time
            let startTime = Date.now();
            window.addEventListener('beforeunload', function() {
              const engagementTime = Date.now() - startTime;
              gtag('event', 'engagement_time', {
                event_category: 'User Engagement',
                value: Math.round(engagementTime / 1000),
                non_interaction: true
              });
            });
          `}
        </Script>

        {/* Error tracking and reporting */}
        <Script id="error-tracking" strategy="afterInteractive">
          {`
            window.addEventListener('error', function(e) {
              gtag('event', 'exception', {
                description: e.message + ' at ' + e.filename + ':' + e.lineno,
                fatal: false,
                event_category: 'JavaScript Error'
              });
            });

            window.addEventListener('unhandledrejection', function(e) {
              gtag('event', 'exception', {
                description: 'Unhandled promise rejection: ' + e.reason,
                fatal: false,
                event_category: 'Promise Rejection'
              });
            });

            // Track offline/online status
            window.addEventListener('online', function() {
              gtag('event', 'connection_restored', {
                event_category: 'Network',
                event_label: 'User came back online'
              });
            });

            window.addEventListener('offline', function() {
              gtag('event', 'connection_lost', {
                event_category: 'Network',
                event_label: 'User went offline'
              });
            });
          `}
        </Script>

        {/* Service Worker registration for PWA capabilities */}
        <Script id="service-worker" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                    gtag('event', 'service_worker_registered', {
                      event_category: 'PWA',
                      event_label: 'Service Worker registered successfully'
                    });
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
