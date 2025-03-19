"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { UserProvider } from "@/context/UserContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  // Éviter les problèmes d'hydratation liés au thème
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        storageKey="theme"
        {...themeProps}
      >
        <UserProvider>
          {mounted ? (
            children
          ) : (
            <div style={{ visibility: "hidden" }}>{children}</div>
          )}
        </UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
