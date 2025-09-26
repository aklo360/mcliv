import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable typedRoutes to avoid dev lookup of routes-manifest.json
  // Re-enable later if needed for typing only.
  typedRoutes: false,
};

export default nextConfig;
