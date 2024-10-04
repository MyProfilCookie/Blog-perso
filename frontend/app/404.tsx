/* eslint-disable react/no-unescaped-entities */
// pages/404.tsx

import { useRouter } from "next/router";
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
    </div>
  );
};

export default NotFoundPage;
