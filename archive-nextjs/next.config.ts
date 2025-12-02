import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable typedRoutes to avoid dev lookup of routes-manifest.json
  // Re-enable later if needed for typing only.
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "studiomcliv.myshopify.com",
      },
    ],
  },
};

export default nextConfig;
