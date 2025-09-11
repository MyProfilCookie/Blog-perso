"use client";

import { useEffect } from "react";

export function ThemeColorManager() {
  useEffect(() => {
    const updateThemeColor = () => {
      const isDarkMode = 
        localStorage.getItem("darkMode") === "true" ||
        (!localStorage.getItem("darkMode") && 
         window.matchMedia("(prefers-color-scheme: dark)").matches);
      
      const themeColor = isDarkMode ? "#111827" : "#f8faff";
      
      // Supprimer tous les meta tags existants
      const existingThemeColor = document.querySelectorAll('meta[name="theme-color"]');
      existingThemeColor.forEach(meta => meta.remove());
      
      const existingStatusBar = document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]');
      existingStatusBar.forEach(meta => meta.remove());
      
      // Créer de nouveaux meta tags
      const themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      themeColorMeta.setAttribute('content', themeColor);
      document.head.appendChild(themeColorMeta);
      
      const statusBarMeta = document.createElement('meta');
      statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      statusBarMeta.setAttribute('content', isDarkMode ? 'black-translucent' : 'default');
      document.head.appendChild(statusBarMeta);
      
      // Forcer la mise à jour pour iOS
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        // Ajouter une classe au body pour forcer le re-rendu
        document.body.classList.toggle('ios-dark-mode', isDarkMode);
        
        // Forcer la couleur de l'encoche
        document.body.style.backgroundColor = isDarkMode ? '#111827' : '#f8faff';
        document.documentElement.style.backgroundColor = isDarkMode ? '#111827' : '#f8faff';
        
        // Forcer le reflow
        document.body.offsetHeight;
        
        // Mettre à jour le viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          const content = viewportMeta.getAttribute('content') || '';
          viewportMeta.setAttribute('content', content + ', viewport-fit=cover');
        }
      }
    };

    // Mettre à jour au chargement avec un délai pour iOS
    setTimeout(updateThemeColor, 100);

    // Écouter les changements de mode sombre
    const observer = new MutationObserver(() => {
      setTimeout(updateThemeColor, 50);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      setTimeout(updateThemeColor, 100);
    });

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', updateThemeColor);
    };
  }, []);

  return null;
}
