import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/mobile-optimizations.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeColorManager } from "@/components/theme-color-manager";

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
        {/* Préchargement des ressources critiques */}
        <link rel="preload" href="/assets/home/home.webp" as="image" type="image/webp" />
        <link rel="preload" href="/assets/family/chantal.webp" as="image" type="image/webp" />
        
        {/* Préconnexions DNS pour les domaines externes */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Préchargement des polices critiques */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        
        {/* Meta tags pour les performances et iPhone avec encoche */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Meta tags pour le mode sombre iOS */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#111827" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AutiStudy" />
        
        {/* Support du mode sombre pour Safari */}
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* Styles inline pour forcer le mode sombre sur iOS et supprimer les bordures navbar */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (prefers-color-scheme: dark) {
              body { background-color: #111827 !important; }
              html { background-color: #111827 !important; }
            }
            .dark body { background-color: #111827 !important; }
            .dark html { background-color: #111827 !important; }
            
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
          `
        }} />
      </head>
      <body className={inter.className}>
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
