import type { NextConfig } from "next";

// next.config.js - Только для разработки!
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Разрешает все домены
      },
    ],
  },
}

export default nextConfig;
