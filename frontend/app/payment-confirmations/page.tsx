/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

// Importation des composants shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoadingAnimation from "@/components/loading";

// Utility function for API requests with error handling
const apiRequest = async (url: RequestInfo | URL, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Handle common status codes
      if (response.status === 401) {
        localStorage.removeItem("userToken");
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      if (response.status === 404) {
        throw new Error("Ressource introuvable.");
      }

      const errorData = await response.json().catch(() => ({}));

      throw new Error(
        errorData.message ||
          `Erreur ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// Improved error display function
const showError = (error: unknown, title = "Erreur") => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Une erreur inattendue s'est produite.";

  Swal.fire({
    title,
    text: errorMessage,
    icon: "error",
    confirmButtonText: "OK",
  });
};

// Interface pour les items de commande
interface OrderItem {
  productId?: string;
  _id?: string;
  quantity: number;
  title: string;
  price: number;
}

// Interface pour la commande
interface Order {
  items: OrderItem[];
  status: string;
  totalAmount: number;
  deliveryCost: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderIdFromUrl = searchParams ? searchParams.get("orderId") : null;
        const orderId = orderIdFromUrl || localStorage.getItem("orderId");

        console.log("🔍 Récupération de la commande avec ID:", orderId);
        console.log("🔍 Contenu complet du localStorage:", {
          orderId: localStorage.getItem("orderId"),
          userToken: localStorage.getItem("userToken") ? "Présent" : "Absent",
          cartItems: localStorage.getItem("cartItems") ? "Présent" : "Absent"
        });

        if (!orderId) {
          console.error("❌ Aucun ID de commande trouvé dans localStorage");
          setError(
            "Aucun ID de commande trouvé. Veuillez passer une commande."
          );
          setLoading(false);
          return;
        }

        // Use the apiRequest utility function
        const orderData = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        );

        console.log("✅ Données de commande récupérées:", orderData);
        setOrder(orderData as Order);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de la commande:", error);
        const errorMessage = error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors de la récupération de la commande.";
        setError(errorMessage);
        showError(error, "Erreur de récupération");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [router, searchParams]);

  const handleBack = () => {
    // Nettoyer les données de commande lors du retour à l'accueil
    console.log("🧹 Nettoyage du localStorage avant retour à l'accueil");
    localStorage.removeItem("orderId");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");
    
    // Nettoyer également les paniers utilisateur spécifiques
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      try {
        // Essayer de récupérer les informations utilisateur pour nettoyer le bon panier
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then(response => response.json())
        .then(userData => {
          if (userData.user && userData.user.pseudo) {
            localStorage.removeItem(`cartItems_${userData.user.pseudo}`);
            console.log("🧹 Panier utilisateur nettoyé:", `cartItems_${userData.user.pseudo}`);
          }
        })
        .catch(error => {
          console.log("⚠️ Impossible de récupérer les infos utilisateur pour le nettoyage:", error);
        });
      } catch (error) {
        console.log("⚠️ Erreur lors du nettoyage du panier utilisateur:", error);
      }
    }
    
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container px-4 mx-auto my-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">{error || "Commande introuvable."}</p>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              variant="default"
              onClick={handleBack}
            >
              Retourner à l&rsquo;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    firstName = "Non spécifié",
    lastName = "Non spécifié",
    email = "Non spécifié",
    phone = "Non spécifié",
    deliveryAddress = {
      street: "Adresse inconnue",
      city: "Ville inconnue",
      postalCode: "Code postal inconnu",
      country: "Pays inconnu",
    },
    items = [],
    deliveryCost = 0,
    totalAmount = 0,
    deliveryMethod = "Standard",
    paymentMethod = "Non spécifiée",
    paymentStatus = "Inconnu",
  } = order;

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();

    if (["payé", "complété", "paid", "completed"].includes(statusLower)) {
      return (
        <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-white border-green-500" variant="default">
          ✅ {status}
        </Badge>
      );
    } else if (["en attente", "pending"].includes(statusLower)) {
      return (
        <Badge className="ml-2 bg-violet-500 hover:bg-violet-600 text-white border-violet-500" variant="default">
          ⏳ {status}
        </Badge>
      );
    } else if (["annulé", "cancelled", "canceled"].includes(statusLower)) {
      return (
        <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white border-red-500" variant="default">
          ❌ {status}
        </Badge>
      );
    } else {
      return (
        <Badge className="ml-2 bg-gray-500 hover:bg-gray-600 text-white border-gray-500" variant="default">
          {status}
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900">
      {/* Header avec gradient violet/purple */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-700 dark:to-purple-700 py-8 md:py-12">
        <div className="container px-4 mx-auto text-center">
          <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
            🎉 Commande Confirmée !
          </h1>
          <p className="text-lg md:text-xl text-violet-100 max-w-2xl mx-auto">
            Merci pour votre achat ! Votre commande a été traitée avec succès.
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Informations Client */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardTitle className="flex items-center text-violet-700 dark:text-violet-300">
                <span className="mr-2">👤</span>
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Prénom:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-semibold">{firstName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Nom:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-semibold">{lastName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-semibold">{email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Téléphone:</span>
                  <span className="text-violet-600 dark:text-violet-400 font-semibold">{phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse de Livraison */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
              <CardTitle className="flex items-center text-violet-700 dark:text-violet-300">
                <span className="mr-2">📦</span>
                Adresse de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-medium text-violet-600 dark:text-violet-400">{deliveryAddress.street}</span>
                  <br />
                  <span className="text-gray-600 dark:text-gray-400">
                    {deliveryAddress.city}, {deliveryAddress.postalCode}
                  </span>
                  <br />
                  <span className="text-gray-600 dark:text-gray-400">{deliveryAddress.country}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails de la Commande */}
        <Card className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center text-violet-700 dark:text-violet-300">
              <span className="mr-2">🛒</span>
              Détails de la Commande
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {order?.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.productId || item._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Badge className="mr-3 bg-violet-600 text-white" variant="default">
                        {item.quantity}
                      </Badge>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                    </div>
                    <span className="font-bold text-violet-600 dark:text-violet-400">
                      {(item.price || 0).toFixed(2)} €
                    </span>
                  </div>
                ))}
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300">🚚 Méthode de Livraison:</span>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">{deliveryMethod}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300">💸 Frais de Livraison:</span>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">{deliveryCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-medium text-gray-700 dark:text-gray-300">💳 Méthode de Paiement:</span>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">{paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">✅ Statut du Paiement:</span>
                    {getStatusBadge(paymentStatus)}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg">
                    <span className="text-xl font-bold text-violet-700 dark:text-violet-300">Total:</span>
                    <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {totalAmount.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-red-400 text-lg">Aucun article trouvé dans la commande.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bouton de retour */}
        <div className="mt-12 text-center">
          <Button
            className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
            variant="default"
            onClick={handleBack}
          >
            <span className="mr-2">🏠</span>
            Retourner à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
