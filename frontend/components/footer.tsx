/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [avatarColorIndex, setAvatarColorIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto theme updater based on time of day
  useEffect(() => {
    if (!mounted) return;

    const updateThemeByTime = () => {
      if (localStorage.getItem("themeMode") === "auto") {
        const currentHour = new Date().getHours();
        const isDayTime = currentHour >= 6 && currentHour < 18;

        if (isDayTime) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
        setAvatarColorIndex(prev => prev);
      }
    };

    updateThemeByTime();
    const interval = setInterval(updateThemeByTime, 60000);
    return () => clearInterval(interval);
  }, [mounted]);

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
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  {mounted && (
                    <>
                      <span className="text-xs font-medium">Thème</span>
                      {document.documentElement.classList.contains("dark") ? (
                        <MoonFilledIcon className="text-blue-300" size={16} />
                      ) : (
                        <SunFilledIcon className="text-yellow-500" size={16} />
                      )}
                    </>
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Options de thème">
                <DropdownItem
                  key="light"
                  onClick={() => {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                    localStorage.setItem("themeMode", "manual");
                    setAvatarColorIndex(prev => prev);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <SunFilledIcon className="text-yellow-500" size={16} />
                    <span>Mode clair</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="dark"
                  onClick={() => {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                    localStorage.setItem("themeMode", "manual");
                    setAvatarColorIndex(prev => prev);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <MoonFilledIcon className="text-blue-300" size={16} />
                    <span>Mode sombre</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="auto"
                  onClick={() => {
                    localStorage.setItem("themeMode", "auto");
                    const currentHour = new Date().getHours();
                    const isDayTime = currentHour >= 6 && currentHour < 18;

                    if (isDayTime) {
                      document.documentElement.classList.remove("dark");
                      localStorage.setItem("theme", "light");
                    } else {
                      document.documentElement.classList.add("dark");
                      localStorage.setItem("theme", "dark");
                    }
                    setAvatarColorIndex(prev => prev);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoon} className="text-gray-500" />
                    <span>Mode automatique</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

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
