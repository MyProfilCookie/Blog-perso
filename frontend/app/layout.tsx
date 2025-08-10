/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
// 📌 1. Import du fichier CSS global
import "@/styles/globals.css";

// 📌 2. Imports de bibliothèques tierces
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 📌 3. Imports de fichiers absolus (du projet)
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

// Import des optimisations de performance
import "@/styles/performance.css";

// 📌 4. Import du composant Providers
import { Providers } from "./providers";

// 📌 5. Import du composant ToasterThemeAware
import ToasterThemeAware from "@/components/toaster-theme-aware";

import { RevisionProvider } from "./RevisionContext";
import PerformanceMonitor from "@/components/PerformanceMonitor";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" }, // Fond crème en mode clair
    { media: "(prefers-color-scheme: dark)", color: "#111827" }, // Fond sombre adapté
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased transition-colors duration-300",
          "bg-cream text-gray-900 dark:bg-gray-900 dark:text-gray-100",
          fontSans.variable
        )}
      >
        <RevisionProvider>
          <Providers
            themeProps={{
              attribute: "class",
              defaultTheme: "system",
              enableSystem: true,
              storageKey: "theme",
            }}
          >
            {/* Utilisation de flex-col + min-h-screen pour assurer que la page prend toute la hauteur */}
            <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
              <Navbar />
              <main className="flex-grow px-6 pt-16 mx-auto max-w-7xl w-full">
                {children}
                <SpeedInsights />
              </main>
              <Footer />
            </div>
            <ToasterThemeAware />
            <PerformanceMonitor />
          </Providers>
        </RevisionProvider>
      </body>
    </html>
  );
}
