// pages/500.tsx

import { useRouter } from "next/router";
import { useEffect } from "react";

const ServerErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirigez où vous voulez, ici l'accueil
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>500 - Erreur Interne du Serveur</h1>
      <p>
        Vous serez redirigé vers la page d&apos;accueil dans quelques
        secondes...
      </p>
    </div>
  );
};

export default ServerErrorPage;
