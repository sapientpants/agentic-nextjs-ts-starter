import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone', // For Docker deployment
  // Stable features (no longer experimental in Next.js 16.x)
  typedRoutes: true, // Type-safe routing — [source](https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links)
};

export default config;
