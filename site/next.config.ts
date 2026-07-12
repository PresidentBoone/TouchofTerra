import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app so Next.js doesn't infer it from the
  // stray lockfile in the home directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
