import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"],
    remotePatterns: [
      new URL("https://lh3.googleusercontent.com/**"),
      new URL("http://localhost/"),
    ],
  },
};

export default nextConfig;
