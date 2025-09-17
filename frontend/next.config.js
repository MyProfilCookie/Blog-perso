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
    // Désactiver toutes les optimisations expérimentales qui peuvent causer des problèmes
    // optimizeCss: true,
    // optimizePackageImports: ['lucide-react', '@nextui-org/react'],
    // optimizeServerReact: true,
    // gzipSize: true,
  },

  // Configuration webpack pour désactiver requestIdleCallback
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remplacer requestIdleCallback par setTimeout
      config.resolve.alias = {
        ...config.resolve.alias,
        'requestIdleCallback': false,
      };
      
      // Ajouter un plugin pour remplacer requestIdleCallback
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'requestIdleCallback': 'setTimeout',
          'cancelIdleCallback': 'clearTimeout',
        })
      );
    }
    return config;
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
