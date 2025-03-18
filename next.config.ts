import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move Pages Router into src directory
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // Set the source directory to search for pages

  // Add external packages to fix module resolution
  serverExternalPackages: ['@prisma/client', 'bcrypt'],
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Updated experimental features
  experimental: {
    // Enable features that help with NextAuth
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
