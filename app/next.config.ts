import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      new URL("https://lh3.googleusercontent.com/**"),
      new URL("https://d23cxyudk0cypl.cloudfront.net/**"),
      new URL("http://localhost:9000/**"), //This should point to local s3 url
    ],
  },
};

export default nextConfig;
