/* eslint-disable no-console */
// Import dotenv pour charger les variables d'environnement correctement
require("dotenv").config();
/* eslint-disable no-console */
require("./debug"); // Ajoutez cette ligne

// Log des variables d'environnement avec vérification de leur existence
console.log(
  "✅ NEXT_PUBLIC_API_URL:",
  process.env.NEXT_PUBLIC_API_URL || "(non défini)",
);
console.log(
  "✅ NEXT_PUBLIC_STRIPE_PUBLIC_KEY:",
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "(non défini)",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@nextui-org/react', 'framer-motion', 'chart.js', 'react-chartjs-2'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimisations de production pour réduire la taille du bundle
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        cacheGroups: {
          // Séparer les bibliothèques lourdes
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 500000, // 500KB max
          },
          // Séparer Chart.js et ses dépendances
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2|recharts)[\\/]/,
            name: 'charts',
            chunks: 'async', // Chargement asynchrone uniquement
            priority: 25,
            maxSize: 300000, // 300KB max
          },
          // Séparer Framer Motion (maintenant plus petit grâce aux optimisations)
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer',
            chunks: 'async', // Chargement asynchrone uniquement
            priority: 25,
            maxSize: 200000, // 200KB max
          },
          // Séparer NextUI
          nextui: {
            test: /[\\/]node_modules[\\/]@nextui-org[\\/]/,
            name: 'nextui',
            chunks: 'all',
            priority: 20,
            maxSize: 400000, // 400KB max
          },
          // Séparer les composants React
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            maxSize: 200000, // 200KB max
          },
          // Séparer les utilitaires
          utils: {
            test: /[\\/]node_modules[\\/](lodash|axios|date-fns|dayjs)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
            maxSize: 150000, // 150KB max
          },
          // Séparer les icônes
          icons: {
            test: /[\\/]node_modules[\\/](@fortawesome|lucide-react)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 15,
            maxSize: 200000, // 200KB max
          },
          // Chunks communs
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
            maxSize: 100000, // 100KB max
          },
        },
      };
      
      // Optimiser les modules
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      
      // Réduire la taille des chunks
      config.optimization.minimize = true;
      
      // Tree shaking plus agressif
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
