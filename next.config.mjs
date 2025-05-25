/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable CSS optimization that might be causing the critters error
  experimental: {
    optimizeCss: false,
    cssChunking: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable compression temporarily to avoid build issues
  compress: false,

  // Basic image optimization
  images: {
    unoptimized: true,
  },

  // Disable minification temporarily
  swcMinify: false,
  poweredByHeader: false,

  // Disable static optimization for error pages
  async rewrites() {
    return []
  },
}

export default nextConfig
