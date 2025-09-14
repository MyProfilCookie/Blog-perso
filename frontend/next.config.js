/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    // Optimisations LCP
    unoptimized: false,
  },

  // Optimisations de performance
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Optimisations expérimentales pour LCP
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@nextui-org/react'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Optimisations LCP agressives
    optimizeServerReact: true,
    // Compression agressive
    gzipSize: true,
  },

  // Headers pour optimiser le cache
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
