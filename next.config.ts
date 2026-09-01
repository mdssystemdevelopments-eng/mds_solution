import type { NextConfig } from "next";
import path from "path";

const renderApi = process.env.RENDER_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  experimental: {
    devtoolSegmentExplorer: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**", "**/System Volume Information/**"],
      };
    }
    return config;
  },
  /** Encaminha /api/* para o backend no Render (mesmo domínio no browser = cookies funcionam). */
  async rewrites() {
    if (!renderApi) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${renderApi}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
