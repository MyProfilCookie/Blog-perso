import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {/* Polyfill ULTIME pour Safari - AVANT React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfill ULTIME pour Safari - AVANT React
              if (!window.requestIdleCallback) {
                window.requestIdleCallback = function(callback, options) {
                  var start = Date.now();
                  return window.setTimeout(function() {
                    callback({
                      didTimeout: false,
                      timeRemaining: function() {
                        return Math.max(0, 50 - (Date.now() - start));
                      }
                    });
                  }, 1);
                };
              }
              
              if (!window.cancelIdleCallback) {
                window.cancelIdleCallback = function(id) {
                  window.clearTimeout(id);
                };
              }
              
              // Forcer la définition sur tous les contextes
              if (typeof global !== 'undefined') {
                global.requestIdleCallback = window.requestIdleCallback;
                global.cancelIdleCallback = window.cancelIdleCallback;
              }
              
              if (typeof self !== 'undefined') {
                self.requestIdleCallback = window.requestIdleCallback;
                self.cancelIdleCallback = window.cancelIdleCallback;
              }
              
              console.log('Safari polyfill ULTIME chargé - requestIdleCallback:', typeof window.requestIdleCallback);
            `,
          }}
        />
        {/* Préchargement des polices critiques */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
              })();
            `,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
            crossOrigin="anonymous"
          />
        </noscript>

        {/* Préconnexions DNS */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Manifest et PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutiStudy" />
        
        {/* Meta tags pour le mode sombre iOS */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#f8faff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
        <meta name="supported-color-schemes" content="light dark" />

        {/* Optimisations de performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}