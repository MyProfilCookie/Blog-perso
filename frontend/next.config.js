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
        source: '/(.*)',
        headers: [
          // Headers de sécurité
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://blog-perso.onrender.com https://blog-perso.onrender.com/api/*; frame-src https://js.stripe.com https://hooks.stripe.com;"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
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
