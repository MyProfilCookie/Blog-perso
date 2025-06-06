import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";

import { Providers } from "@/app/providers";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import ToasterThemeAware from "@/components/toaster-theme-aware";
import { fontSans } from "@/config/fonts";
import { RevisionProvider } from "@/app/RevisionContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
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
            <Navbar />
            <main className="flex-grow px-6 pt-16 mx-auto max-w-7xl w-full">
              <Component {...pageProps} />
              <SpeedInsights />
            </main>
            <Footer />
          </div>

          <ToasterThemeAware />
        </Providers>
      </div>
    </RevisionProvider>
  );
}
