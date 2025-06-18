// next.config.ts
import type { NextConfig } from 'next';
import { withSvgr } from 'next-svgr-plugin';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
   experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
