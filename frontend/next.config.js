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
  reactStrictMode: true,
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
  },
  
  // Ajoutez cette configuration pour rediriger les requêtes API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
