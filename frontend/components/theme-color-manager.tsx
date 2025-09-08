"use client";

import { useEffect } from "react";

export function ThemeColorManager() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDarkMode = 
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") && 
         window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      const themeColor = isDarkMode ? "#111827" : "#ffffff";
      
      // Mettre à jour le theme-color meta tag
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', themeColor);
      
      // Mettre à jour le status-bar-style pour iOS
      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        document.head.appendChild(statusBarMeta);
      }
      statusBarMeta.setAttribute('content', isDarkMode ? 'black-translucent' : 'default');
    };

    // Mettre à jour au chargement
    updateThemeColor();

    // Écouter les changements de mode sombre
    const observer = new MutationObserver(() => {
      updateThemeColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateThemeColor);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateThemeColor);
    };
  }, []);

  return null;
}
