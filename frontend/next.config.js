/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;
// next.config.js

module.exports = {
  async redirects() {
    return [
      {
        source: "/old-path", // L'ancienne URL
        destination: "/", // La nouvelle URL vers laquelle vous redirigez
        permanent: true, // Redirection permanente (status code 301)
      },
    ];
  },
};
