import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
