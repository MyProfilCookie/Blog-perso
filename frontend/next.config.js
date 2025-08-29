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
<<<<<<< HEAD
  reactStrictMode: true,
  swcMinify: true, // Utiliser SWC pour la minification (plus rapide)
  trailingSlash: true, // Ajouter des slashes pour éviter les erreurs de routing
  distDir: '.next', // Utiliser le mode serveur par défaut
  
  // Optimisations de performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Configuration des images pour l'optimisation
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Définir des valeurs par défaut pour éviter les problèmes d'undefined
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY:
      "pk_test_51PJX1EJ9cNEOCcHhPnKT4sBxvL5xs9aQN7VTmRUabgl4khJ6k7KbYIcjJsHIhesao1lhsj0YYfIAjhn9hvAPxwLw008vby1XDo",
  },

  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blogs",
        destination: "/blog",
        permanent: false,
      },
    ];
=======
  // Optimisations pour mobile
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@nextui-org/react', 'framer-motion', 'lucide-react'],
>>>>>>> restore-ancienne-version
  },
  
  // Compression et optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 an
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Optimisations de compression
  compress: true,
  
  // Headers de cache optimisés
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

<<<<<<< HEAD
  webpack: (config, { isServer, dev }) => {
    // Optimisations de performance pour la production
    if (!dev) {
      // Optimisation des chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            // Séparer les bibliothèques de graphiques
            charts: {
              name: 'charts',
              test: /[\/]node_modules[\/](chart\.js|react-chartjs-2)[\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Séparer NextUI
            nextui: {
              name: 'nextui',
              test: /[\/]node_modules[\/]@nextui-org[\/]/,
              chunks: 'all',
              priority: 25,
            },
            // Séparer Framer Motion
            framer: {
              name: 'framer',
              test: /[\/]node_modules[\/]framer-motion[\/]/,
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
=======
  // Optimisations webpack pour mobile
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour la production
    if (!dev && !isServer) {
      // Compression des bundles
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
>>>>>>> restore-ancienne-version
      };
    }
    
    // Configuration pour Chart.js - les imports dynamiques gèrent déjà le SSR
    // Pas besoin de marquer comme externe
    
    // Configuration supplémentaire si nécessaire
    // Pas de transformation d'imports pour NextUI pour éviter les erreurs de chemin
    
    return config;
  },

  // Optimisations de performance
  poweredByHeader: false,
  generateEtags: false,
  
  // Optimisations pour PWA
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/_next/static/sw.js',
      },
    ];
  },
};

module.exports = nextConfig;
