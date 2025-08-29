import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

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
  metadataBase: new URL('https://autistudy.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AutiStudy - Apprentissage adapté pour enfants autistes",
    description: "Plateforme éducative spécialisée pour les enfants autistes",
    url: 'https://autistudy.vercel.app',
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
        
        {/* Meta tags pour les performances */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow px-6 pt-16 mx-auto max-w-7xl w-full">
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
