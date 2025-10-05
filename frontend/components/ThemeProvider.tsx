"use client";

import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Synchroniser le thème au chargement
    const syncTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const themeMode = localStorage.getItem('themeMode');
      
      if (savedTheme && !themeMode) {
        // Mode manuel
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else if (themeMode === 'auto') {
        // Mode automatique
        const autoModeHours = localStorage.getItem('autoModeHours');
        if (autoModeHours) {
          const hours = JSON.parse(autoModeHours);
          const currentHour = new Date().getHours();
          const shouldBeDark = currentHour >= hours.start || currentHour < hours.end;
          document.documentElement.classList.toggle('dark', shouldBeDark);
        }
      }
    };

    syncTheme();
    
    // Écouter les changements de localStorage depuis d'autres onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'themeMode') {
        syncTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  );
};
