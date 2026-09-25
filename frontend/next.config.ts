import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remote bike photos come from Wikipedia/Commons during catalog sync.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "thumb.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
