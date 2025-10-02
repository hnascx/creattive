import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ["localhost", "cdn.awsli.com.br"],
  },
}

export default nextConfig
