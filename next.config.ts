import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true, // ⚡ This disables TS errors blocking the build
  },
  // images: {
  //   domains: ["github.com"],
  // },
};

export default nextConfig;
