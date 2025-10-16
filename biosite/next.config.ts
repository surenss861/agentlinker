import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kjmnomtndntstbhpdklv.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Turbopack configuration for Vercel builds
  turbopack: {
    rules: {
      '*.node': {
        loaders: ['file-loader'],
        as: '*.js',
      },
    },
  },
  // Webpack configuration for local development
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack config in development or when not using Turbopack
    if (dev || !process.env.TURBOPACK) {
      // Exclude SendGrid from client-side bundles
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          os: false,
        };
      }
    }
    return config;
  },
};

export default nextConfig;
