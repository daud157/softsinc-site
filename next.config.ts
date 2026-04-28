import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Allow HMR / dev resources when opening the site from another host (e.g. LAN IP). */
  allowedDevOrigins: ["10.198.89.121"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
