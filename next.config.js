/** @type {import('next').NextConfig} */
const nextConfig = {
  // ═══════════════════════════════════════════════════════════════
  // 🦅 EAGLE GYM — Next.js Configuration
  // ═══════════════════════════════════════════════════════════════

  // Enable React Strict Mode for development
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: [
      "localhost",
      "eaglegym.in",
      "res.cloudinary.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // PWA / Manifest
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Rewrites (if needed for API proxying)
  async rewrites() {
    return [
      {
        source: "/api/external/:path*",
        destination: "https://api.external-service.com/:path*",
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Webpack config for specific packages
  webpack: (config, { isServer }) => {
    // Handle canvas for PDF generation
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    typedRoutes: true,
  },

  // Output configuration
  // output: "standalone",

  // Powered by header
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Trailing slash
  trailingSlash: false,
};

module.exports = nextConfig;