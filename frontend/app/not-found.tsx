/* eslint-disable react/no-unescaped-entities */
// app/not-found.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const NotFoundPage = () => {
  const router = useRouter();

  // Rediriger vers la page d'accueil après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirection vers la page d'accueil ou toute autre page
    }, 5000);

    return () => clearTimeout(timer); // Nettoyage du timer à la fin
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Non Trouvée</h1>
      <p>
        Vous serez redirigé vers la page d'accueil dans quelques secondes...
      </p>
      <p>
        Si vous n'êtes pas redirigé automatiquement, cliquez <a href="/">ici</a>{" "}
        pour y accéder.
      </p>
    </div>
  );
};

export default NotFoundPage;
