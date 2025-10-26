/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Dropdown } from '@nextui-org/react'
import { DropdownTrigger } from '@nextui-org/react'
import { DropdownMenu } from '@nextui-org/react'
import { DropdownItem } from '@nextui-org/react'
import { Button } from '@nextui-org/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

const Footer = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? "system" : resolvedTheme ?? "light";

  return (
    <footer className="border-t dark:bg-gray-900 border-violet-200 dark:border-violet-800 mt-16 performance-optimized">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 performance-optimized">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 grid-cls-optimized performance-optimized grid-cls-optimized grid-cls-optimized grid-cls-optimized">
          {/* Logo et Description */}
          <div className="col-span-1 lg:col-span-2 text-center sm:text-left performance-optimized">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent mb-3 performance-optimized">
              AutiStudy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto sm:mx-0 performance-optimized">
              Une plateforme éducative adaptée, favorisant l&apos;apprentissage et l&apos;épanouissement des enfants autistes.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 text-center sm:text-left performance-optimized">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 performance-optimized">
              Navigation
            </h4>
            <nav className="flex flex-col space-y-2 performance-optimized">
              <NextLink href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors performance-optimized">
                Blog
              </NextLink>
              <NextLink href="/about" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors performance-optimized">
                À propos
              </NextLink>
              <NextLink href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors performance-optimized">
                Contact
              </NextLink>
            </nav>
          </div>

          {/* Thème et Paramètres */}
          <div className="space-y-3 text-center sm:text-left performance-optimized">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 performance-optimized">
              Paramètres
            </h4>
            <div className="flex justify-center sm:justify-start performance-optimized">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-none button-cls-optimized performance-optimized button-cls-optimized button-cls-optimized button-cls-optimized focus-visible:outline-none"
                  >
                    <span className="text-xs font-medium performance-optimized">Thème</span>
                    {mounted ? (
                      currentTheme === "dark" ? (
                        <MoonFilledIcon className="text-blue-300 performance-optimized" size={16} />
                      ) : currentTheme === "system" ? (
                        <FontAwesomeIcon icon={faMoon} className="text-gray-500 performance-optimized" />
                      ) : (
                        <SunFilledIcon className="text-yellow-500 performance-optimized" size={16} />
                      )
                    ) : (
                      <SunFilledIcon className="text-yellow-500 performance-optimized" size={16} />
                    )}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Options de thème">
                  <DropdownItem
                    key="light"
                    onClick={() => {
                      setTheme("light");
                      localStorage.setItem("theme", "light");
                      localStorage.setItem("themeMode", "manual");
                    }}
                  >
                    <div className="flex items-center gap-2 performance-optimized">
                      <SunFilledIcon className="text-yellow-500 performance-optimized" size={16} />
                      <span>Mode clair</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="dark"
                    onClick={() => {
                      setTheme("dark");
                      localStorage.setItem("theme", "dark");
                      localStorage.setItem("themeMode", "manual");
                    }}
                  >
                    <div className="flex items-center gap-2 performance-optimized">
                      <MoonFilledIcon className="text-blue-300 performance-optimized" size={16} />
                      <span>Mode sombre</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="auto"
                    onClick={() => {
                      localStorage.setItem("themeMode", "auto");
                      localStorage.setItem("theme", "system");
                      setTheme("system");
                    }}
                  >
                    <div className="flex items-center gap-2 performance-optimized">
                      <FontAwesomeIcon icon={faMoon} className="text-gray-500 performance-optimized" />
                      <span>Mode automatique</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Copyright - Séparé en bas */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center performance-optimized">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 performance-optimized">
            © {new Date().getFullYear()} AutiStudy | Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
