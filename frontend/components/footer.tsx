/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <footer className="border-t bg-white dark:bg-gray-900 border-violet-200 dark:border-violet-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo et Description */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              AutiStudy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Une plateforme éducative adaptée, favorisant l&apos;apprentissage et l&apos;épanouissement des enfants autistes.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            <NextLink href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
              Blog
            </NextLink>
            <NextLink href="/about" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
              À propos
            </NextLink>
            <NextLink href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors">
              Contact
            </NextLink>
          </nav>

          {/* Bouton Theme et Copyright */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              onClick={toggleTheme}
            >
              {mounted && (
                <>
                  {theme === "dark" ? (
                    <><MoonFilledIcon size={16} /> Mode sombre</>
                  ) : (
                    <><SunFilledIcon size={16} /> Mode clair</>
                  )}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} AutiStudy | Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
