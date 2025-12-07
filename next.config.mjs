// File: next.config.mjs

import withPWA from 'next-pwa';

/**
 * PWA Configuration
 * Defines Progressive Web App settings for offline support and app-like experience
 */
const pwaConfig = withPWA({
  // Destination directory for service worker and manifest files
  dest: 'public',

  // Automatically register the service worker on client side
  register: true,

  // Force waiting service worker to become active immediately
  skipWaiting: true,

  // Disable PWA in development to prevent caching issues during development
  disable: process.env.NODE_ENV === 'development',

  /**
   * Runtime Caching Strategies
   * Define caching behavior for different types of requests
   */
  runtimeCaching: [
    // Cache API responses with Network First strategy (try network, fallback to cache)
    {
      urlPattern: /^https:\/\/api\..*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600, // 1 hour
        },
      },
    },

    // Cache static assets with Cache First strategy (use cache, update in background)
    {
      urlPattern: /\.(js|css|woff2?|ttf|otf|eot)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 2592000, // 30 days
        },
      },
    },

    // Cache images with Stale While Revalidate strategy
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 604800, // 7 days
        },
      },
    },
  ],

  // Additional PWA manifest configuration
  publicExclude: ['!robots.txt', '!sitemap.xml'],

  // Build ID for cache busting
  buildExcludes: [/chunks\/.*\\.map/, /hot-update\\..*/],
});

/**
 * Next.js Configuration
 * Production-ready configuration for Next.js 16 with App Router
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /**
   * PERFORMANCE & BUNDLING
   */

  // Enable Partial Prerendering (PPR) via cacheComponents for better performance
  cacheComponents: true,

  // Turbopack configuration (replacement for webpack in Next.js 16)
  turbopack: {
    // Path aliases for cleaner imports
    resolveAlias: {
      '@': './src',
      '@components': './src/components',
      '@lib': './src/lib',
      '@utils': './src/utils',
      '@hooks': './src/hooks',
      '@types': './src/types',
      '@constants': './src/constants',
      '@config': './src/config',
      '@styles': './src/styles',
      '@public': './public',
    },

    // Loaders for specific file types
    loaders: {
      // Add loaders if you need to handle specific file types
      // Example: '.svg': ['@svgr/webpack'],
    },
  },

  /**
   * IMAGE OPTIMIZATION
   * Configure Next.js Image component behavior
   */
  images: {
    // Allowed remote image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],

    // Image optimization settings
    formats: ['image/webp', 'image/avif'], // Prefer modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  /**
   * REACT & COMPILATION
   */

  // Enable React strict mode for development checks
  reactStrictMode: true,

  // Use SWC for minification (faster than Terser)
  swcMinify: true,

  /**
   * INTERNATIONALIZATION (i18n)
   * Configure if you're using i18n routing
   */
  // Uncomment and configure if using i18n
  // i18n: {
  //   locales: ['en', 'ru', 'de'],
  //   defaultLocale: 'en',
  // },

  /**
   * HEADERS & REDIRECTS
   * Security and SEO headers
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Cache headers for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
            source: '/:path*(woff2|eot|ttf|otf|woff)',
          },
        ],
      },
    ];
  },

  /**
   * REDIRECTS
   * Permanent redirects for URL changes
   */
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },

  /**
   * REWRITES
   * Internal rewrites for API routes and routing
   */
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites executed before checking next.json routes
        // Example:
        // {
        //   source: '/api/:path*',
        //   destination: 'http://localhost:3001/api/:path*',
        // },
      ],
      afterFiles: [
        // Fallback rewrites
      ],
      fallback: [
        // Final fallback rewrites
      ],
    };
  },

  /**
   * ENVIRONMENT VARIABLES
   * Expose specific env variables to browser
   */
  env: {
    // Make these variables available in the browser
    // Example:
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  /**
   * EXPERIMENTAL FEATURES
   * Advanced Next.js features
   */
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'shadcn-ui',
      '@shadcn/ui',
      'lucide-react',
      '@hookform/resolvers',
    ],

    // Type-safe environment variables
    // taint: true,
  },

  /**
   * BUILD CONFIGURATION
   */

  // Production source maps (can be disabled to reduce build size)
  productionBrowserSourceMaps: false,

  // Compress pages
  compress: true,

  // Generate ETags for static files
  generateEtags: true,

  /**
   * LOGGING
   * Configure build logging
   */
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  /**
   * TYPESCRIPT
   */
  typescript: {
    // Fail build on TypeScript errors
    tsconfigPath: './tsconfig.json',
  },

  /**
   * WEBPACK & BUNDLING (kept for reference, Turbopack takes precedence)
   */
  // Webpack config is superseded by Turbopack in Next.js 16
  // webpack: (config, { isServer }) => {
  //   // Custom webpack configuration (if needed)
  //   return config;
  // },

  /**
   * BUILD OUTPUT
   */
  output: 'standalone', // Use standalone mode for Docker and efficient deployments
};

// Merge PWA config with Next.js config
export default pwaConfig(nextConfig);
