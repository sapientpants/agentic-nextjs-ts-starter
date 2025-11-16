import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone', // For Docker deployment
  // Experimental features
  experimental: {
    typedRoutes: true, // Type-safe routing
  },
};

export default config;
