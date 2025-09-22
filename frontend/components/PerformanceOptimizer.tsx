import Head from 'next/head';
import React from 'react';

const PerformanceOptimizer: React.FC = () => {
  return (
    <Head>
      {/* Préchargement des polices critiques */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      
      {/* Préchargement des CSS critiques */}
      <link
        rel="preload"
        href="/_next/static/css/app.css"
        as="style"
      />
      
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
        href="/_next/static/chunks/framework.js"
      />
      <link
        rel="modulepreload"
        href="/_next/static/chunks/main.js"
      />
      
      {/* Optimisations de cache */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
    </Head>
  );
};

export default PerformanceOptimizer;