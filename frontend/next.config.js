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
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
