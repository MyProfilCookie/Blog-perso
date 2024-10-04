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
      <NextThemesProvider {...themeProps}>
        <UserProvider>
          {" "}
          {/* Ajout du UserProvider pour gérer l'utilisateur globalement */}
          {children}
        </UserProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
