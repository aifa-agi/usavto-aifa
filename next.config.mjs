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
  experimental: {
    ppr: true, // Enables Partial Prerendering (PPR)
  },

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

  /**
   * Output File Tracing Configuration
   * 
   * Purpose: Include custom data files in Vercel serverless deployment
   * 
   * How it works:
   * - Keys are route patterns (using picomatch glob syntax)
   * - Values are file glob patterns relative to project root
   * - Files matching these patterns will be copied to .next output
   * - Vercel will include them in the serverless function bundle
   * 
   * Route pattern syntax:
   * - /api/menu matches exact route in pages dir
   * - For app router, use the full route path without 'route.ts'
   * - Wildcards: /api/** matches all API routes
   * 
   * File pattern syntax:
   * - Relative to project root (where package.json lives)
   

   */
  outputFileTracingIncludes: {
    // Include all content data files for the menu read API route
    // This ensures config/content/* files are available in serverless environment
    '/api/menu': ['./config/content/**/*'],

    // If you have the route in app router with parallel routes:
    // Use the full route path without the route.ts file
    '/@right/(_server)/api/menu': ['./config/content/**/*'],

    // Alternative: Include for all API routes if multiple routes need these files
    // '/api/**': [
    //   './config/content/**/*',
    // ],
  },

  /**
   * Optional: outputFileTracingRoot
   *
   * Use this in monorepo setups to include files outside project directory
   * Example: if your project is in packages/web-app and you need files from root
   */
  // outputFileTracingRoot: path.join(__dirname, '../../'),

  /**
   * Optional: outputFileTracingExcludes
   *
   * Use this to exclude unnecessary files that were auto-traced
   * Helps reduce bundle size
   */
  // outputFileTracingExcludes: {
  //   '/api/menu': [
  //     './node_modules/@some-large-package/**/*',
  //   ],
  // },
};

// Export the final, merged configuration
// The `pwaConfig` function wraps your `nextConfig` and returns a new object
// with all settings combined
export default pwaConfig(nextConfig);
