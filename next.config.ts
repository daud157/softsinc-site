import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Dev origins allowed for cross-origin / middleware (add your LAN IP:port if needed). */
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "::1",
    "10.198.89.121",
    "10.201.98.121",
  ],
  /**
   * Skip the default image optimizer (`/_next/image`). It fetches each remote
   * URL from the Node server; on flaky networks that fetch hits ETIMEDOUT and
   * returns 500. Cloudinary URLs are already CDN-backed — load them directly.
   */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
