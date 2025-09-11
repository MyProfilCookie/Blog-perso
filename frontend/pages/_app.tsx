import "@/styles/globals.css";
import type { AppProps } from "next/app";

import dynamic from "next/dynamic";

// Chargement dynamique des composants non-critiques
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then(mod => ({ default: mod.SpeedInsights })), { ssr: false });
const ToasterThemeAware = dynamic(() => import("@/components/toaster-theme-aware"), { ssr: false });
import clsx from "clsx";

import { Providers } from "@/app/providers";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeColorManager } from "@/components/theme-color-manager";

import { fontSans } from "@/config/fonts";
import { RevisionProvider } from "@/app/RevisionContext";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <PerformanceOptimizer />
      <ThemeColorManager />
      <RevisionProvider>
        <div
          className={clsx(
            "min-h-screen font-sans antialiased transition-colors duration-300",
            "bg-cream text-gray-900 dark:bg-gray-900 dark:text-gray-100",
            fontSans.variable,
          )}
        >
          <Providers
            themeProps={{
              attribute: "class",
              defaultTheme: "system",
              enableSystem: true,
              storageKey: "theme",
            }}
          >
            <div className="flex flex-col min-h-screen bg-cream dark:bg-gray-900">
              <div style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
                <Navbar />
              </div>
              <main className="flex-grow pt-0 mx-auto max-w-7xl w-full">
                <Component {...pageProps} />
                <SpeedInsights />
              </main>
              <Footer />
            </div>

            <ToasterThemeAware />
          </Providers>
        </div>
      </RevisionProvider>
    </>
  );
}
