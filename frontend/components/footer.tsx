/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

const Footer = () => {
  useTheme();
  const [mounted, setMounted] = useState(false);
  const [avatarColorIndex, setAvatarColorIndex] = useState(0); // Pour être cohérent avec Navbar

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto theme updater based on time of day
  useEffect(() => {
    // Only run if mounted
    if (!mounted) return;

    // Function to update theme based on time
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

        // Force re-render
        setAvatarColorIndex(prev => prev);
      }
    };

    // Update theme immediately
    updateThemeByTime();

    // Set interval to check every minute
    const interval = setInterval(updateThemeByTime, 60000);

    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <footer className="border-t transition-colors duration-300 bg-cream/80 border-gray-300 dark:border-gray-700 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 mt-16 px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center sm:text-left">
        {/* 🏠 À propos */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            À propos
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left leading-relaxed transition-colors duration-300">
            Découvrez notre plateforme dédiée à l'apprentissage et au partage de
            connaissances.
          </p>
        </div>

        {/* 🔗 Liens rapides */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Liens rapides
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {["Blog", "Courses", "Shop", "Contact"].map((item) => (
              <li key={item}>
                <NextLink
                  className="hover:text-violet-500 transition-colors duration-300"
                  href={`/${item.toLowerCase()}`}
                >
                  {item}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        {/* 📞 Contact */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon
                className="text-violet-500"
                icon={faMapMarkerAlt}
              />
              <span className="transition-colors duration-300">
                Paris, France
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon className="text-violet-500" icon={faPhone} />
              <span className="transition-colors duration-300">
                +33 1 23 45 67 89
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon className="text-violet-500" icon={faEnvelope} />
              <span className="transition-colors duration-300">
                contact@notreplateforme.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 🎨 Theme Switch et Copyright */}
      <div className="flex flex-col items-center justify-center mt-10 space-y-4">
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <button
                aria-label="Toggle theme"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-cream dark:bg-gray-800 border border-gray-300 dark:border-gray-700 transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {mounted && (
                  <>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Thème
                    </span>
                    {document.documentElement.classList.contains("dark") ? (
                      <MoonFilledIcon className="text-blue-300" size={16} />
                    ) : (
                      <SunFilledIcon className="text-yellow-500" size={16} />
                    )}
                  </>
                )}
              </button>
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
                  // Apply theme based on current time
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
        </div>
        <p className="text-xs text-gray-500 transition-colors duration-300">
          © {new Date().getFullYear()} Tous droits réservés | AutiStudy
        </p>
      </div>
    </footer>
  );
};

export default Footer;
