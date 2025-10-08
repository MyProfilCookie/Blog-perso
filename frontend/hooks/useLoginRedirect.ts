import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook pour gérer la redirection vers la page de connexion
 * en sauvegardant la page actuelle pour y retourner après connexion
 */
export function useLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLogin = useCallback(() => {
    // Sauvegarder la page actuelle
    if (typeof window !== "undefined") {
      sessionStorage.setItem("returnUrl", pathname);
    }
    
    // Rediriger vers la page de connexion avec le returnUrl
    router.push(`/users/login?returnUrl=${encodeURIComponent(pathname)}`);
  }, [router, pathname]);

  return { redirectToLogin };
}
