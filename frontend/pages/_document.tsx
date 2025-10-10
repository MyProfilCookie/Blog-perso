import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
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
        <link rel="dns-prefetch" href="//blog-perso.onrender.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://blog-perso.onrender.com" crossOrigin="anonymous" />

        {/* Manifest et PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="mobile-web-app-capable" content="yes" />
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
      </Head>
      <body className="antialiased">
        {/* ⚡ POLYFILL SAFARI - SE CHARGE EN PREMIER DANS LE BODY */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window.requestIdleCallback === 'undefined') {
                  window.requestIdleCallback = function(callback, options) {
                    var start = Date.now();
                    var timeout = (options && options.timeout) || 50;
                    return window.setTimeout(function() {
                      callback({
                        didTimeout: false,
                        timeRemaining: function() {
                          return Math.max(0, timeout - (Date.now() - start));
                        }
                      });
                    }, 1);
                  };
                  window.cancelIdleCallback = function(id) {
                    window.clearTimeout(id);
                  };
                }
                
                if (typeof window.IntersectionObserver === 'undefined') {
                  window.IntersectionObserver = function(callback, options) {
                    return {
                      observe: function() {},
                      unobserve: function() {},
                      disconnect: function() {}
                    };
                  };
                }
              })();
            `,
          }}
        />

        <Main />
        <NextScript />

        {/* Service Worker désactivé - causait des problèmes avec Stripe CSP */}
        {/* Script pour désenregistrer les anciens Service Workers */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister().then(function(success) {
                      console.log('✅ Service Worker désenregistré avec succès');
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  );
}