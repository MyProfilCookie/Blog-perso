import { Suspense } from "react";
import Loading from "@/components/loading";
import { fallbackProducts } from "./fallback-products";
import ArticlesClient from "./articles-client";

// Fonction pour fetcher les produits côté serveur avec ISR
async function getProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://blog-perso.onrender.com'}/products`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { 
          revalidate: 300, // Revalider toutes les 5 minutes
        },
      }
    );

    if (!response.ok) {
      console.error(`API Error: ${response.status}`);
      return fallbackProducts;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors du fetch des produits:", error);
    return fallbackProducts;
  }
}

// Page component avec ISR
export default async function ShopPage() {
  // Pré-charger les produits côté serveur
  const initialProducts = await getProducts();

  return (
    <Suspense fallback={<Loading />}>
      <ArticlesClient initialProducts={initialProducts} />
    </Suspense>
  );
}

// Configuration ISR
export const revalidate = 300; // Revalider toutes les 5 minutes

