import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: ['@design-system'],
};

export default nextConfig;
