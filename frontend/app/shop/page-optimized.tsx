import { Suspense } from "react";
import { CardSkeleton } from "@/components/SkeletonLoaders";
import OptimizedShop from "./optimized-shop";

// Fonction pour récupérer les données côté serveur
async function getProducts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 300 }, // Revalidation toutes les 5 minutes
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ShopPageOptimized() {
  // Récupérer les données côté serveur
  const initialArticles = await getProducts();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"></div>
          <div className="relative w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Boutique{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    AutiStudy
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Chargement des produits...
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="px-2 py-6 md:px-4 lg:px-6 bg-white dark:bg-gray-900">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 max-w-7xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    }>
      <OptimizedShop initialArticles={initialArticles} />
    </Suspense>
  );
}
