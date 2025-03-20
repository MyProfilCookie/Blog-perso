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
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
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
  } catch (error: any) {
    console.error("Erreur API:", error);
    throw error;
  }
};

// Improved error display function
const showError = (error: any, title = "Erreur") => {
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

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderId = localStorage.getItem("orderId");

        if (!orderId) {
          setError(
            "Aucun ID de commande trouvé. Veuillez passer une commande.",
          );
          setLoading(false);

          return;
        }

        console.log("Récupération de la commande avec ID:", orderId);

        // Use the apiRequest utility function
        const orderData = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        );

        console.log("Données de commande récupérées:", orderData);
        setOrder(orderData);

        // Ne pas supprimer l'orderId pour permettre le rafraîchissement de la page
        // localStorage.removeItem("orderId");
      } catch (error: any) {
        console.error("Erreur lors de la récupération de la commande:", error);
        setError(
          error.message ||
            "Une erreur s'est produite lors de la récupération de la commande.",
        );

        // Display error using the showError utility
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
      <div className="flex justify-center items-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto my-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Erreur</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">{error || "Commande introuvable."}</p>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
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
    switch (status.toLowerCase()) {
      case "payé":
      case "complété":
      case "paid":
      case "completed":
        return <Badge className="ml-2 bg-green-500">✅ {status}</Badge>;
      case "en attente":
      case "pending":
        return <Badge className="ml-2 bg-yellow-500">⏳ {status}</Badge>;
      case "annulé":
      case "cancelled":
      case "canceled":
        return <Badge className="ml-2 bg-red-500">❌ {status}</Badge>;
      default:
        return <Badge className="ml-2 bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto my-12 px-4 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-yellow-400 animate-bounce mb-2">
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
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.productId || item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <Badge className="mr-2" variant="outline">
                      {item.quantity}
                    </Badge>
                    <span>{item.title}</span>
                  </div>
                  <span className="font-medium">
                    {item.price?.toFixed(2)} €
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
                <div className="flex justify-between items-center">
                  <span className="font-medium">✅ Statut du Paiement:</span>
                  {getStatusBadge(paymentStatus)}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-yellow-500">Total:</span>
                  <span className="text-yellow-500">
                    {totalAmount.toFixed(2)} € 🎯
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-400 text-center">
              Aucun article trouvé dans la commande.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transform transition-transform hover:scale-105"
          onClick={handleBack}
        >
          🔙 Retourner à l&#39;accueil
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
