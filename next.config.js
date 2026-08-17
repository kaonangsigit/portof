/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  // ESLint 9 is not fully compatible with Next.js 14's built-in runner; lint separately
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Speed up dev compilation
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
};

module.exports = nextConfig;
