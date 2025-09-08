"use client";

import { useEffect } from "react";

export function ControleDarkModeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Forcer le mode sombre sur le body et html pour les pages controle
    const updateDarkMode = () => {
      const isDarkMode = 
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") && 
         window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
        document.body.style.backgroundColor = "#111827";
        document.documentElement.style.backgroundColor = "#111827";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
        document.body.style.backgroundColor = "#ffffff";
        document.documentElement.style.backgroundColor = "#ffffff";
      }
    };

    // Mettre à jour au chargement
    updateDarkMode();

    // Écouter les changements de mode sombre
    const observer = new MutationObserver(() => {
      updateDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateDarkMode);
    };
  }, []);

  return <>{children}</>;
}
