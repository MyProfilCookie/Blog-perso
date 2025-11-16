"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  useEffect(() => {
    // Rediriger vers la page des commandes
    // L'ID sera utilisé pour auto-expand la commande correspondante
    router.replace(`/orders?orderId=${params.id}`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de votre commande...</p>
      </div>
    </div>
  );
}
