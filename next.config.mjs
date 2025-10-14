// File: next.config.mjs
// Best practices: This is the single source of truth for your Next.js configuration,
// combining your project's settings with PWA capabilities and custom file tracing.

/**
 * Configuration overview:
 * 1. Import PWA wrapper for service worker generation
 * 2. Define base Next.js config with experimental features and image optimization
 * 3. Add outputFileTracingIncludes to ensure custom data files are included in Vercel deployment
 * 4. Merge all configs using withPWA wrapper
 * 
 * File tracing context:
 * - Next.js uses @vercel/nft to trace dependencies automatically
 * - Custom data files (like config/content/*) need explicit inclusion
 * - Route-specific includes ensure only necessary files are bundled per function
 */

import withPWA from 'next-pwa';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const isImageOptimizationOn = process.env.IMAGE_OPTIMIZATION_ON === 'true';

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
    '/api/menu': [
      './config/content/**/*',
    ],
    
    // If you have the route in app router with parallel routes:
    // Use the full route path without the route.ts file
    '/@right/(_server)/api/menu': [
      './config/content/**/*',
    ],
    
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
