"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { UserProvider } from "@/context/UserContext"; // Importer le UserProvider

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        storageKey="theme" // Sauvegarde le dernier thème choisi
        {...themeProps}
      >
        <UserProvider>{children}</UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
