/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@nextui-org/react', 'lucide-react', 'framer-motion'],
  },
  
  // Compression
  compress: true,
  
  // Optimisation des images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // CSP temporairement désactivée pour Safari
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://blog-perso.onrender.com https://*.onrender.com;"
          // },
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