import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/critical.css";
import "@/styles/globals.css";
import "@/styles/cls-optimization.css";
import "@/styles/sweetalert2-safari.css";
import "@/styles/sweetalert2-safari-patch.css";
import "@/styles/safari-compatibility.css";
import "@/lib/polyfills";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeColorManager } from "@/components/theme-color-manager";
import LCPOptimizer from "@/components/LCPOptimizer";
import ErrorBoundary from "@/components/ErrorBoundary";
import IOSErrorHandler from "@/components/IOSErrorHandler";
import PerformanceMonitor from "@/components/PerformanceMonitor";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "AutiStudy - Apprentissage adapté pour enfants autistes",
  description:
    "Plateforme éducative spécialisée pour les enfants autistes, offrant des ressources adaptées et un accompagnement personnalisé.",
  keywords:
    "autisme, éducation, enfants, apprentissage, ressources, accompagnement",
  authors: [{ name: "AutiStudy Team" }],
  creator: "AutiStudy",
  publisher: "AutiStudy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://autistudy.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AutiStudy - Apprentissage adapté pour enfants autistes",
    description: "Plateforme éducative spécialisée pour les enfants autistes",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://autistudy.com",
    siteName: "AutiStudy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AutiStudy - Plateforme éducative",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutiStudy - Apprentissage adapté pour enfants autistes",
    description: "Plateforme éducative spécialisée pour les enfants autistes",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="fr" suppressHydrationWarning>
      <head>
        {/* Préchargement conditionnel des ressources critiques pour LCP */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Précharger seulement si on est sur la page d'accueil
              if (window.location.pathname === '/' || window.location.pathname === '') {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = '/assets/home/home.webp';
                link.type = 'image/webp';
                link.fetchPriority = 'high';
                document.head.appendChild(link);
              }
            `,
          }}
        />
        {/* Préchargement conditionnel des images de famille */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Précharger les images de famille seulement sur les pages qui les utilisent
              if (window.location.pathname === '/' || 
                  window.location.pathname === '/about' || 
                  window.location.pathname === '/about/') {
                const chantalLink = document.createElement('link');
                chantalLink.rel = 'preload';
                chantalLink.as = 'image';
                chantalLink.href = '/assets/family/chantal.webp';
                chantalLink.type = 'image/webp';
                chantalLink.fetchPriority = 'high';
                document.head.appendChild(chantalLink);
                
                const familyLink = document.createElement('link');
                familyLink.rel = 'preload';
                familyLink.as = 'image';
                familyLink.href = '/assets/family/family.webp';
                familyLink.type = 'image/webp';
                document.head.appendChild(familyLink);
              }
            `,
          }}
        />
        {/* Preload supprimé - géré dynamiquement ci-dessus */}

        {/* Resource hints avancés pour LCP - DNS prefetch seulement */}

        {/* Préconnexions DNS pour les domaines externes */}
        <link href="//fonts.googleapis.com" rel="dns-prefetch" />
        <link href="//fonts.gstatic.com" rel="dns-prefetch" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.googleapis.com"
          rel="preconnect"
        />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />

        {/* Préchargement des polices critiques avec Next.js Font */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-inter: ${inter.style.fontFamily};
            }
          `
        }} />

        {/* Meta tags pour les performances et iPhone avec encoche */}
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
          name="viewport"
        />
        <meta content="on" httpEquiv="x-dns-prefetch-control" />
        <meta content="telephone=no" name="format-detection" />

        {/* Meta tags pour le mode sombre iOS */}
        <meta content="light dark" name="color-scheme" />
        <meta
          content="#f8faff"
          media="(prefers-color-scheme: light)"
          name="theme-color"
        />
        <meta
          content="#111827"
          media="(prefers-color-scheme: dark)"
          name="theme-color"
        />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="AutiStudy" name="apple-mobile-web-app-title" />

        {/* Support du mode sombre pour Safari */}
        <meta content="light dark" name="supported-color-schemes" />

        {/* CSS critique inline pour LCP optimisé */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* CSS critique pour LCP */
            body { 
              font-family: Inter, system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f8faff;
              line-height: 1.6;
            }
            .dark body { background-color: #111827; }
            html { background-color: #f8faff; }
            .dark html { background-color: #111827; }
            
            /* Layout critique */
            .min-h-screen { min-height: 100vh; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            
            /* Hero section critique */
            .hero-section {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            /* Images critiques */
            .hero-image {
              width: 100%;
              height: auto;
              max-width: 600px;
              border-radius: 16px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            
            /* Force la couleur de l'encoche iPhone */
            @media (prefers-color-scheme: light) {
              body { background-color: #f8faff !important; }
              html { background-color: #f8faff !important; }
            }
            
            /* Force la couleur cream pour l'encoche */
            :not(.dark) body { background-color: #f8faff !important; }
            :not(.dark) html { background-color: #f8faff !important; }
            
            /* Suppression forcée des bordures navbar */
            .nextui-navbar,
            .nextui-navbar-container,
            [data-nextui-navbar],
            nav,
            header,
            .navbar,
            .navigation {
              border: none !important;
              border-bottom: none !important;
              border-top: none !important;
              border-left: none !important;
              border-right: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
            
            /* Suppression sur tous les enfants de la navbar */
            .nextui-navbar *,
            nav *,
            header * {
              border: none !important;
              border-bottom: none !important;
              outline: none !important;
            }
            
            /* Suppression ultra-agressive de toutes les bordures */
            .nextui-navbar,
            .nextui-navbar *,
            .nextui-navbar::before,
            .nextui-navbar::after,
            [data-nextui-navbar],
            [data-nextui-navbar] * {
              border: 0 !important;
              border-bottom: 0 !important;
              border-top: 0 !important;
              border-left: 0 !important;
              border-right: 0 !important;
              outline: 0 !important;
              box-shadow: none !important;
              border-width: 0 !important;
              border-style: none !important;
            }
            
            /* Suppression des pseudo-éléments */
            .nextui-navbar::after,
            .nextui-navbar::before {
              display: none !important;
              content: none !important;
            }
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LCPOptimizer />
        <ThemeColorManager />
        <IOSErrorHandler />
        <ErrorBoundary>
          <Providers>
            <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
              <Navbar />
              <main className="flex-grow w-full">{children}</main>
              <Footer />
            </div>
            <Toaster
              closeButton
              duration={4000}
              position="top-right"
              richColors
            />
            <PerformanceMonitor
              enableReporting={false}
              showDebugInfo={process.env.NODE_ENV === "development"}
            />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
