// File: next.config.mjs

import withPWA from 'next-pwa';

// Define PWA-specific settings
const pwaConfig = withPWA({
  dest: 'public', // Destination directory for the service worker and related files
  register: true, // Automatically register the service worker on the client side
  skipWaiting: true, // Forces the waiting service worker to become the active service worker
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development to avoid caching issues
  runtimeCaching: [
    // You can add runtime caching strategies here for dynamic content or APIs
  ],
});

/** @type {import('next').NextConfig} */
// This is your base Next.js configuration

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh', // Allows images from this hostname
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // unoptimized: !isImageOptimizationOn,
  },
};

export default pwaConfig(nextConfig);
