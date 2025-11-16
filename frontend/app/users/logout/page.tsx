"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const keys = [
        "user",
        "userToken",
        "accessToken",
        "refreshToken",
        "userRole",
        "userInfo",
        "token",
      ];
      keys.forEach((k) => {
        try {
          localStorage.removeItem(k);
          sessionStorage.removeItem(k);
        } catch {}
      });

      const evt = new CustomEvent("userUpdate", { detail: null });
      window.dispatchEvent(evt);
    } catch {}

    setDone(true);

    try {
      router.replace("/");
    } catch {}

    const hardRedirect = setTimeout(() => {
      try {
        window.location.replace("/");
      } catch {}
    }, 1200);

    return () => clearTimeout(hardRedirect);
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white dark:bg-gray-900">
      <div className="max-w-sm w-full text-center">
        <div className="mx-auto mb-4 h-6 w-6 rounded-full border-b-2 border-blue-600 animate-spin" />
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Déconnexion en cours…</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {done ? "Nettoyage terminé. Redirection vers l’accueil." : "Merci de patienter un instant."}
        </p>
        <a href="/" className="mt-4 inline-block text-sm font-medium text-violet-600 dark:text-violet-400">
          Retour à l’accueil
        </a>
      </div>
    </div>
  );
}
