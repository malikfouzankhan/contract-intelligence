import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse must run as a real Node module, not be bundled, so its
  // worker file resolves correctly at runtime under Turbopack/webpack.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
