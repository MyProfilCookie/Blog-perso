import Head from 'next/head';
import React from 'react';

const PerformanceOptimizer: React.FC = () => {
  return (
    <Head>
      {/* Préchargement des polices critiques */}
      {/* Police Inter chargée via Next.js Font, pas besoin de préchargement manuel */}
      
      {/* CSS files are automatically handled by Next.js */}
      {/* No need to manually preload them as they are bundled and optimized */}
      
      {/* DNS prefetch pour les domaines externes */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Préconnexion aux domaines critiques */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Optimisations de rendu */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#8B5CF6" />
      
      {/* Préchargement des modules critiques */}
      <link
        rel="modulepreload"
        href="/_next/static/chunks/polyfills.js"
      />
      
      {/* Optimisations de cache */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
    </Head>
  );
};

export default PerformanceOptimizer;