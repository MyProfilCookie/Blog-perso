/* eslint-disable prettier/prettier */
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "sonner";

import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

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
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased transition-colors duration-300",
          "bg-cream text-gray-900 dark:bg-gray-900 dark:text-gray-100",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "system" }}>
          {/* Utilisation de flex-col + min-h-screen pour assurer que la page prend toute la hauteur */}
          <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
            <Navbar />
            <main className="flex-grow px-6 pt-16 mx-auto max-w-7xl w-full">
              {children}
            </main>
            {/* Correction : Footer bien collé en bas */}
            <Footer />
          </div>
          {/* Intégration du composant Toaster de Sonner avec les thèmes sombre/clair */}
          <Toaster
            theme={
              typeof window !== 'undefined' &&
                window.document.documentElement.classList.contains('dark')
                ? 'dark'
                : 'light'
            }
            position="bottom-right"
            closeButton
            richColors
          />
        </Providers>
      </body>
    </html>
  );
}
