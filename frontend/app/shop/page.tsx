/* eslint-disable import/order */
export const dynamic = "force-dynamic";
// 📌 1. Imports de bibliothèques tierces
import { Suspense } from "react";

// 📌 2. Imports absolus (fichiers du projet avec "@/")
import Loading from "@/components/loading";

// 📌 3. Imports relatifs (fichiers locaux du projet)
import ArticlesClient from "./articles-client";

// Page component sans props personnalisées
export default function ShopPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Boutique AutiStudy
          </h1>
          <p className="mt-3 text-blue-100 dark:text-blue-200 text-sm md:text-base max-w-2xl mx-auto mb-2">
            Produits complémentaires (sensoriel, outils, ressources numériques) pour accompagner la plateforme.
          </p>
          <p className="mt-1 text-blue-100 dark:text-blue-200 text-xs md:text-sm">
            L’abonnement donne accès aux activités personnalisées; la boutique propose des produits à l’unité.
          </p>
        </div>
      </section>
      <Suspense fallback={<Loading />}>
        <ArticlesClient />
      </Suspense>
    </>
  );
}
