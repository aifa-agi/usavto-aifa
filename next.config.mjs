// next.config.mjs

import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // ... ваш код
  ],
  publicExclude: ['!robots.txt', '!sitemap.xml'],
  buildExcludes: [/chunks\/.*\\.map/, /hot-update\\..*/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ ОТКЛЮЧИТЕ cacheComponents когда используете force-dynamic
  cacheComponents: false,

  turbopack: {
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
  },

  images: {
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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  reactStrictMode: true,
  swcMinify: true,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
            source: '/:path*(woff2|eot|ttf|otf|woff)',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },

  async rewrites() {
    return { beforeFiles: [], afterFiles: [], fallback: [] };
  },

  env: {},

  experimental: {
    optimizePackageImports: [
      'shadcn-ui',
      '@shadcn/ui',
      'lucide-react',
      '@hookform/resolvers',
    ],
  },

  productionBrowserSourceMaps: false,
  compress: true,
  generateEtags: true,

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  output: 'standalone',
};

export default pwaConfig(nextConfig);
