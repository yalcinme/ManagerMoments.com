import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FPL Manager Moments - Your Season Wrapped",
    short_name: "FPL Moments",
    description:
      "Your Fantasy Premier League season review in retro 16-bit style. Discover your manager moments, achievements, and season highlights.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1b4b",
    theme_color: "#667eea",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    categories: ["sports", "entertainment", "games"],
    screenshots: [
      {
        src: "/images/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "FPL Manager Moments on mobile",
      },
      {
        src: "/images/screenshot-desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "FPL Manager Moments on desktop",
      },
    ],
    icons: [
      {
        src: "/favicon.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    shortcuts: [
      {
        name: "Demo Mode",
        short_name: "Demo",
        description: "Try the demo experience",
        url: "/?demo=true",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400,
    },
  }
}
