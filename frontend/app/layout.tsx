import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/critical.css";
import "@/styles/globals.css";
import "@/styles/mobile-optimizations.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeColorManager } from "@/components/theme-color-manager";
import LCPOptimizer from "@/components/LCPOptimizer";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "AutiStudy - Apprentissage adapté pour enfants autistes",
  description: "Plateforme éducative spécialisée pour les enfants autistes, offrant des ressources adaptées et un accompagnement personnalisé.",
  keywords: "autisme, éducation, enfants, apprentissage, ressources, accompagnement",
  authors: [{ name: "AutiStudy Team" }],
  creator: "AutiStudy",
  publisher: "AutiStudy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://autistudy.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AutiStudy - Apprentissage adapté pour enfants autistes",
    description: "Plateforme éducative spécialisée pour les enfants autistes",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://autistudy.vercel.app',
    siteName: 'AutiStudy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AutiStudy - Plateforme éducative',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "AutiStudy - Apprentissage adapté pour enfants autistes",
    description: "Plateforme éducative spécialisée pour les enfants autistes",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Préchargement agressif des ressources critiques pour LCP */}
        <link rel="preload" href="/assets/home/home.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/assets/family/chantal.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/assets/family/family.webp" as="image" type="image/webp" />
        <link rel="preload" href="/assets/home/hero-bg.webp" as="image" type="image/webp" />
        
        {/* Resource hints avancés pour LCP */}
        <link rel="preload" href="/_next/static/chunks/framework.js" as="script" />
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        <link rel="preload" href="/_next/static/css/app.css" as="style" />
        
        {/* Préconnexions DNS pour les domaines externes */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Préchargement des polices critiques */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        
        {/* Meta tags pour les performances et iPhone avec encoche */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Meta tags pour le mode sombre iOS */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#f8faff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutiStudy" />
        
        {/* Support du mode sombre pour Safari */}
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* CSS critique inline pour LCP optimisé */}
        <style dangerouslySetInnerHTML={{
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
          `
        }} />
      </head>
      <body className={inter.className}>
        <LCPOptimizer />
        <ThemeColorManager />
        <Providers>
          <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow w-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  );
}
