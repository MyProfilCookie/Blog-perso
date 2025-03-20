/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderId = localStorage.getItem("orderId");

        console.log("Récupération de la commande avec ID:", orderId);

        if (!orderId) {
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

        console.log("Données de commande récupérées:", orderData);
        setOrder(orderData as Order);
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande:", error);
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
  }, [router]);

  const handleBack = () => {
    // Nettoyer les données de commande lors du retour à l'accueil
    localStorage.removeItem("orderId");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");
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
        <Badge className="ml-2 bg-green-500 text-white" variant="outline">
          ✅ {status}
        </Badge>
      );
    } else if (["en attente", "pending"].includes(statusLower)) {
      return (
        <Badge className="ml-2 bg-yellow-500 text-white" variant="outline">
          ⏳ {status}
        </Badge>
      );
    } else if (["annulé", "cancelled", "canceled"].includes(statusLower)) {
      return (
        <Badge className="ml-2 bg-red-500 text-white" variant="outline">
          ❌ {status}
        </Badge>
      );
    } else {
      return (
        <Badge className="ml-2 bg-gray-500 text-white" variant="outline">
          {status}
        </Badge>
      );
    }
  };

  return (
    <div className="container px-4 mx-auto my-12 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-extrabold text-yellow-400 animate-bounce">
          🎉 Confirmation de Commande 🎉
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Merci pour votre achat ! Voici le récapitulatif de votre commande.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              👤 Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Prénom:</span>
                <span>{firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Nom:</span>
                <span>{lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Téléphone:</span>
                <span>{phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              📦 Adresse de Livraison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              {deliveryAddress.street},<br />
              {deliveryAddress.city}, {deliveryAddress.postalCode}
              <br />
              {deliveryAddress.country}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            🛒 Détails de la Commande
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order?.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.productId || item._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Badge className="mr-2" variant="outline">
                      {item.quantity}
                    </Badge>
                    <span>{item.title}</span>
                  </div>
                  <span className="font-medium">
                    {(item.price || 0).toFixed(2)} €
                  </span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">🚚 Méthode de Livraison:</span>
                  <span>{deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">💸 Frais de Livraison:</span>
                  <span>{deliveryCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">💳 Méthode de Paiement:</span>
                  <span>{paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">✅ Statut du Paiement:</span>
                  {getStatusBadge(paymentStatus)}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-xl font-bold">
                  <span className="text-yellow-500">Total:</span>
                  <span className="text-yellow-500">
                    {totalAmount.toFixed(2)} € 🎯
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-red-400">
              Aucun article trouvé dans la commande.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button
          className="px-8 py-3 font-bold text-white transform transition-transform bg-yellow-500 rounded-lg hover:bg-yellow-600 hover:scale-105"
          variant="default"
          onClick={handleBack}
        >
          🔙 Retourner à l&apos;accueil
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
