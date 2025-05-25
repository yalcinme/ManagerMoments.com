import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FPL Manager Moments Wrapped",
    short_name: "FPL Wrapped",
    description: "Your Fantasy Premier League season review in retro 16-bit style",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1b4b",
    theme_color: "#667eea",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
