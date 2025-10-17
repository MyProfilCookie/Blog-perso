"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Mail, 
  MapPin, 
  User, 
  CreditCard,
  Home,
  Download,
  Calendar,
  Phone
} from "lucide-react";

// Importation des composants shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
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
  _id?: string;
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
  orderDate?: string;
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

        if (!orderId) {
          setError(
            "Aucun ID de commande trouvé. Veuillez passer une commande."
          );
          setLoading(false);
          return;
        }

        const orderData = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        );

        setOrder(orderData as Order);
        
        // Déclencher l'événement userUpdate pour mettre à jour la navbar
        if (typeof window !== "undefined") {
          const event = new CustomEvent("userUpdate");
          window.dispatchEvent(event);
          console.log("✅ Événement userUpdate déclenché depuis la page de confirmation");
        }
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
    localStorage.removeItem("orderId");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalPrice");
    
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        })
        .then(response => response.json())
        .then(userData => {
          if (userData.user && userData.user.pseudo) {
            localStorage.removeItem(`cartItems_${userData.user.pseudo}`);
          }
        })
        .catch(() => {});
      } catch (error) {
        console.log("Erreur nettoyage:", error);
      }
    }
    
    router.push("/");
  };

  const handleDownloadInvoice = () => {
    Swal.fire({
      title: "Facture",
      text: "La facture sera envoyée par email dans quelques instants.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <LoadingAnimation />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Erreur
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "Commande introuvable."}
              </p>
              <Button
                onClick={handleBack}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Retourner à l'accueil
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const {
    _id: orderId,
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
    orderDate,
  } = order;

  const subtotal = totalAmount - deliveryCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Commande confirmée !
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Merci pour votre achat ! Un email de confirmation vous a été envoyé.
          </motion.p>
          
          {orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <Badge variant="outline" className="text-sm py-1 px-3 bg-white dark:bg-gray-800">
                N° de commande : {orderId.substring(0, 12).toUpperCase()}
              </Badge>
            </motion.div>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles commandés */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Articles commandés
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.productId || item._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {item.quantity}x
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.price.toFixed(2)} € l'unité
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Récapitulatif des prix */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        Livraison ({deliveryMethod})
                      </span>
                      <span>{deliveryCost.toFixed(2)} €</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-green-600 dark:text-green-400">
                        {totalAmount.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations de livraison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2" />
                    Informations de livraison
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Adresse de livraison
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {deliveryAddress.street}<br />
                          {deliveryAddress.postalCode} {deliveryAddress.city}<br />
                          {deliveryAddress.country}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Destinataire
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {firstName} {lastName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Statut de paiement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Paiement
                    </h3>
                    <Badge className="bg-green-500 text-white mb-3">
                      {paymentStatus}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Méthode : {paymentMethod}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="border-gray-200 dark:border-gray-700">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Vos coordonnées
                  </h3>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="text-sm">
                      <p className="text-gray-500 dark:text-gray-400">Téléphone</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {phone}
                      </p>
                    </div>
                  </div>

                  {orderDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div className="text-sm">
                        <p className="text-gray-500 dark:text-gray-400">Date de commande</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(orderDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-3"
            >
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger la facture
              </Button>
              
              <Button
                onClick={handleBack}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Retourner à l'accueil
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Info supplémentaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">ℹ️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Que se passe-t-il maintenant ?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Vous recevrez un email de confirmation avec tous les détails
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Nous préparons votre commande avec soin
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Vous serez notifié dès l'expédition avec un numéro de suivi
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;