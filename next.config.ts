import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.mp3": {
        loaders: ["file-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
