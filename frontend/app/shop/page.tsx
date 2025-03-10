/* eslint-disable import/order */
// 📌 1. Imports de bibliothèques tierces
import { Suspense } from "react";

// 📌 2. Imports absolus (fichiers du projet avec "@/")
import Loading from "@/components/loading";

// 📌 3. Imports relatifs (fichiers locaux du projet)
import ArticlesClient from "./articles-client";

// Page component sans props personnalisées
export default function ShopPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticlesClient />
    </Suspense>
  );
}
