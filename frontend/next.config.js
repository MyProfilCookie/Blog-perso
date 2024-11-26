/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration générale de Next.js
  reactStrictMode: true,
  experimental: {
    turbo: {
      mode: "full",
    },
  },

  // Gestion des redirections
  async redirects() {
    return [
      {
        source: "/old-path", // Ancienne URL
        destination: "/", // Nouvelle URL
        permanent: true, // Redirection permanente (status code 301)
      },
    ];
  },

  // Webpack configuration pour ignorer certains modules côté client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Ignore le module fs dans l'environnement client
      };
    }

    return config;
  },
};

module.exports = nextConfig;
