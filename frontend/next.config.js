/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  experimental: {
    // Désactiver toutes les optimisations expérimentales pour éviter les erreurs
    optimizePackageImports: ['@nextui-org/react', 'lucide-react', 'framer-motion'],
  },
  
  // Compression
  compress: true,
  
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 an
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  
  // Optimisation du bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimisation pour la production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          nextui: {
            test: /[\\/]node_modules[\\/]@nextui-org[\\/]/,
            name: 'nextui',
            chunks: 'all',
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
          },
        },
      };
    }
    
    // Configuration webpack standard
    
    return config;
  },
  
  // Headers de performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // CSP avec support Stripe
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://js.stripe.com https://blog-perso.onrender.com https://*.onrender.com; frame-src https://js.stripe.com https://hooks.stripe.com;"
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Optimisation des pages
  async rewrites() {
    return [
      {
        source: '/controle/:path*',
        destination: '/controle/:path*',
      },
    ];
  },
  
  // Configuration TypeScript - DÉSACTIVÉ temporairement
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuration ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimisation des polices
  optimizeFonts: true,
  
  // Configuration de la production
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
