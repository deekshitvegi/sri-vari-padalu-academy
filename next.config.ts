import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public academy photography is already web-sized. Serving it directly keeps
  // the local Cloudflare preview from depending on production image bindings.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
