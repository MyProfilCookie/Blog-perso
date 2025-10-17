"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeProvider } from "@/components/StripeProvider";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { saveOrderService, confirmPaymentService } from "@/services/paymentService";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Truck, 
  CreditCard, 
  ShoppingCart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Vérifier si la clé Stripe est disponible
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
console.log("✅ Clé Stripe chargée :", stripeKey);

const CheckoutForm = ({ 
  totalToPay, 
  cartItems, 
  onPaymentSuccess, 
  selectedTransporter, 
  deliveryCost 
}: { 
  totalToPay: number; 
  cartItems: any[]; 
  onPaymentSuccess: () => void; 
  selectedTransporter: string; 
  deliveryCost: number; 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [, setCartItems] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Détecter le mode sombre
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        
        return () => observer.disconnect();
    }, []);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isProcessing) return;

        if (!selectedTransporter) {
            Swal.fire({
                title: "Erreur",
                text: "Veuillez sélectionner un transporteur avant de continuer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!stripe || !elements) {
            Swal.fire({
                title: "Erreur",
                text: "Stripe n'est pas encore prêt.",
                icon: "error",
                confirmButtonText: "Réessayer",
            });
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            Swal.fire({
                title: "Erreur",
                text: "L'élément de carte est introuvable.",
                icon: "error",
                confirmButtonText: "Réessayer",
            });
            return;
        }

        try {
            setIsProcessing(true);
            
            let receiptEmail: string | undefined = undefined;
            try {
                const token = localStorage.getItem("userToken");
                if (token) {
                    const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (meRes.ok) {
                        const meData = await meRes.json();
                        receiptEmail = meData?.user?.email || undefined;
                    }
                }
            } catch (e) {
                console.warn("Impossible de récupérer l'email utilisateur pour le reçu Stripe", e);
            }

            const intentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: totalToPay, currency: "eur", email: receiptEmail })
            });

            if (!intentRes.ok) {
                const errData = await intentRes.json().catch(() => ({}));
                throw new Error(errData.message || "Impossible de créer l'intention de paiement.");
            }

            const { clientSecret } = await intentRes.json();
            if (!clientSecret) {
                throw new Error("Client secret manquant pour le paiement.");
            }

            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (confirmError) {
                Swal.fire({
                    title: "Erreur",
                    text: confirmError.message || "Le paiement a échoué.",
                    icon: "error",
                    confirmButtonText: "Réessayer",
                });
                return;
            }

            if (!paymentIntent || paymentIntent.status !== "succeeded") {
                Swal.fire({
                    title: "Paiement non confirmé",
                    text: "Le paiement n'a pas pu être confirmé.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
                return;
            }

            const orderData = await saveOrder(cartItems, totalToPay, paymentIntent.id);
            
            const storedId = localStorage.getItem("orderId");
            console.log("Vérification après saveOrder - ID stocké dans localStorage:", storedId);
            
            if (!storedId) {
                console.error("ALERTE: ID de commande non trouvé dans localStorage après saveOrder");
            }
            
            if (user && orderData && (orderData._id || orderData.id || (orderData.order && orderData.order._id))) {
                const orderId = orderData._id || orderData.id || orderData.order._id;
                await confirmPayment(
                    user,
                    orderId,
                    paymentIntent.id || "unknown",
                    totalToPay,
                    "card"
                );
            }
    
            Swal.fire({
                title: "Paiement réussi",
                text: "Merci pour votre achat !",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                const finalStoredId = localStorage.getItem("orderId");
                console.log("🔍 Vérification avant redirection - ID stocké:", finalStoredId);
                
                if (!finalStoredId) {
                    console.error("❌ ALERTE: ID de commande manquant avant redirection !");
                    if (orderData && orderData.order && orderData.order._id) {
                        localStorage.setItem("orderId", orderData.order._id);
                        console.log("✅ ID de commande récupéré et stocké:", orderData.order._id);
                    }
                }
                
                onPaymentSuccess();
                
                // Déclencher l'événement userUpdate pour mettre à jour la navbar
                if (typeof window !== "undefined") {
                    const event = new CustomEvent("userUpdate");
                    window.dispatchEvent(event);
                    console.log("✅ Événement userUpdate déclenché - navbar va se mettre à jour");
                }
                
                const orderIdForUrl = localStorage.getItem("orderId");
                if (orderIdForUrl) {
                    router.push(`/payment-confirmations?orderId=${orderIdForUrl}`);
                } else {
                    router.push("/payment-confirmations");
                }
            });
        } catch (err) {
            console.error("Erreur lors du paiement :", err);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue lors du paiement.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        finally {
            setIsProcessing(false);
        }
    };
    
    const saveOrder = async (items: any[], total: number, transactionId: string) => {
        try {
            const result = await saveOrderService({
                items,
                total,
                transactionId,
                selectedTransporter,
                deliveryCost,
                router,
            });
            if (result && result.user) {
                setUser(result.user);
            }
            setCartItems([]);
            return result ? result.createdOrder : null;
        } catch (error) {
            return null;
        }
    };
    
    useEffect(() => {
        if (!user) return;
    
        const updateCart = () => {
            console.log("🔄 Mise à jour du panier après paiement...");
            
            localStorage.removeItem(`cartItems_${user.pseudo}`);
            localStorage.removeItem("totalPrice");
    
            setCartItems([]);
        };
    
        window.addEventListener("cartUpdated", updateCart);
    
        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, [user]);

    const confirmPayment = async (
        user: any,
        orderId: string,
        transactionId: string,
        amount: number,
        paymentMethod: string
    ) => {
        return await confirmPaymentService(user, orderId, transactionId, amount, paymentMethod);
    };
    
    return (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6" 
          onSubmit={handleSubmit}
        >
            <Card className={`${!selectedTransporter ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informations de Carte Bancaire
                  </h3>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <CardElement
                        id="card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: isDarkMode ? "#ffffff" : "#32325d",
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                    fontSmoothing: "antialiased",
                                    "::placeholder": { 
                                        color: isDarkMode ? "#9ca3af" : "#aab7c4" 
                                    },
                                    iconColor: isDarkMode ? "#ffffff" : "#32325d",
                                },
                                invalid: { 
                                    color: "#fa755a",
                                    iconColor: "#fa755a"
                                },
                            },
                            disabled: isProcessing || !selectedTransporter,
                        }}
                    />
                </div>
                
                {!selectedTransporter && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Veuillez sélectionner un transporteur pour activer le paiement.</span>
                    </div>
                )}
              </CardContent>
            </Card>
            
            <Button 
                className="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                type="submit"
                disabled={isProcessing || !selectedTransporter}
            >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement en cours...
                  </span>
                ) : (
                  `Payer ${totalToPay.toFixed(2)} €`
                )}
            </Button>
        </motion.form>
    );
};

const PaymentPage = () => {
    const [user, setUser] = useState<any>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalToPay, setTotalToPay] = useState<number>(0);
    const [deliveryCost, setDeliveryCost] = useState<number>(4);
    const [selectedTransporter, setSelectedTransporter] = useState<string>("");
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const router = useRouter();

    const calculateTotalWeight = (items: any[]) => {
        return items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
    };

    const calculateDeliveryCost = (weight: number, transporter: string) => {
        const pricing = {
            Colissimo: weight <= 1 ? 4 : weight <= 3 ? 6 : weight <= 5 ? 8 : 12,
            UPS: weight <= 1 ? 6 : weight <= 3 ? 8 : weight <= 5 ? 10 : 15,
            DHL: weight <= 1 ? 8 : weight <= 3 ? 10 : weight <= 5 ? 12 : 18,
        } as Record<string, number>;
        return pricing[transporter] || 0;
    };

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("userToken");

        if (!token) {
            console.log("🔴 Aucun token trouvé. Redirection vers la page de connexion.");
            router.push("/users/login");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("🔴 Erreur lors de la vérification du token.");
                localStorage.removeItem("userToken");
                router.push("/users/login");
                return;
            }

            const userData = await response.json();
            console.log("✅ Utilisateur authentifié :", userData);
            setUser(userData.user);

            const missingFields = [];
            
            if (!userData.user.phone || userData.user.phone.trim() === "") {
                missingFields.push("numéro de téléphone");
            }
            
            if (!userData.user.deliveryAddress) {
                missingFields.push("adresse de livraison");
            } else {
                const address = userData.user.deliveryAddress;
                if (!address.street || !address.city || !address.postalCode || !address.country) {
                    missingFields.push("adresse de livraison complète");
                }
            }
            
            if (missingFields.length > 0) {
                const fieldsText = missingFields.join(" et ");
                Swal.fire({
                    title: "Informations manquantes",
                    html: `
                        <p>Pour passer une commande, vous devez compléter votre profil avec :</p>
                        <ul style="text-align: left; margin: 10px 0;">
                            ${missingFields.map(field => `<li>• ${field}</li>`).join('')}
                        </ul>
                        <p>Vous serez redirigé vers votre <strong>profil utilisateur</strong>.</p>
                    `,
                    icon: "warning",
                    confirmButtonText: "Aller au profil",
                    allowOutsideClick: false,
                }).then(() => {
                    router.push("/profile");
                });
                return;
            }

            const userCartKey = `cartItems_${userData.user.pseudo}`;
            const storedCart = localStorage.getItem(userCartKey);

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);

                const weight = calculateTotalWeight(parsedCart);
                setTotalWeight(weight);

                const cost = calculateDeliveryCost(weight, selectedTransporter);
                setDeliveryCost(cost);

                const total = parsedCart.reduce(
                    (sum: number, item: any) => sum + item.price * item.quantity,
                    0
                );
                setTotalToPay(total + cost);
            } else {
                console.log("🛒 Aucun panier trouvé.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
            localStorage.removeItem("userToken");
            router.push("/users/login");
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [router, selectedTransporter]);

    const handleTransporterChange = (transporter: string) => {
        setSelectedTransporter(transporter);

        const cost = calculateDeliveryCost(totalWeight, transporter);
        setDeliveryCost(cost);

        const totalCartAmount = cartItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        setTotalToPay(totalCartAmount + cost);
    };

    const transporters = [
        {
            id: "Colissimo",
            name: "Colissimo",
            description: "Livraison standard 3-5 jours",
            icon: "📦",
            price: calculateDeliveryCost(totalWeight, "Colissimo")
        },
        {
            id: "UPS",
            name: "UPS",
            description: "Livraison express 2-3 jours",
            icon: "📮",
            price: calculateDeliveryCost(totalWeight, "UPS")
        },
        {
            id: "DHL",
            name: "DHL",
            description: "Livraison rapide 1-2 jours",
            icon: "✈️",
            price: calculateDeliveryCost(totalWeight, "DHL")
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
        <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Finaliser votre commande
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Vérifiez vos informations et procédez au paiement
                    </p>
                </motion.div>

                {user && (
                    <>
                        {/* User Information Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Informations utilisateur
                                        </h2>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                                            <Image
                                                src={user.avatar || "/assets/default-avatar.webp"}
                                                alt={user.nom}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <User className="w-4 h-4" />
                                                    <span><strong>Nom :</strong> {user.nom} {user.prenom}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Mail className="w-4 h-4" />
                                                    <span><strong>Email :</strong> {user.email}</span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Phone className="w-4 h-4" />
                                                    <span>
                                                        <strong>Téléphone :</strong>{" "}
                                                        {user.phone && user.phone.trim() !== "" ? 
                            user.phone : 
                                                            <span className="text-red-500">⚠️ Manquant</span>
                                                        }
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 md:col-span-2">
                                                    <MapPin className="w-4 h-4 mt-1" />
                                                    <span>
                                                        <strong>Adresse :</strong>{" "}
                                                        {user.deliveryAddress ? 
                                                            `${user.deliveryAddress.street}, ${user.deliveryAddress.city}, ${user.deliveryAddress.postalCode}, ${user.deliveryAddress.country}` :
                                                            <span className="text-red-500">⚠️ Manquante</span>
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                    {(!user.phone || user.phone.trim() === "" || !user.deliveryAddress || 
                      !user.deliveryAddress.street || !user.deliveryAddress.city || 
                      !user.deliveryAddress.postalCode || !user.deliveryAddress.country) && (
                                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                                                                Certaines informations sont manquantes pour la livraison.
                            </p>
                            <Button 
                                size="sm"
                                onClick={() => router.push("/profile")}
                                                                className="bg-yellow-600 hover:bg-yellow-700"
                            >
                                Compléter mon profil
                            </Button>
                                                        </div>
                                                    </div>
                        </div>
                    )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                </motion.div>

                        {/* Cart Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Récapitulatif du panier
                                        </h2>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Package className="w-4 h-4" />
                                                <span>Poids total</span>
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {totalWeight.toFixed(2)} kg
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-700 dark:text-gray-300">Total avant livraison</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {(totalToPay - deliveryCost).toFixed(2)} €
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Truck className="w-4 h-4" />
                                                <span>Frais de livraison</span>
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {deliveryCost.toFixed(2)} €
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg px-4 mt-4">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                Total à payer
                                            </span>
                                            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                                {totalToPay.toFixed(2)} €
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
            </motion.div>

                        {/* Transporter Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Sélectionnez un transporteur
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {transporters.map((transporter) => (
                                            <div
                                                key={transporter.id}
                                                onClick={() => handleTransporterChange(transporter.id)}
                                                className={`
                                                    relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-300
                                                    ${selectedTransporter === transporter.id
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                                                    }
                                                `}
                                            >
                                                {selectedTransporter === transporter.id && (
                                                    <div className="absolute -top-2 -right-2">
                                                        <CheckCircle className="w-6 h-6 text-blue-600 bg-white dark:bg-gray-900 rounded-full" />
                                                    </div>
                                                )}

                                                <div className="text-center">
                                                    <div className="text-3xl mb-2">{transporter.icon}</div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                                        {transporter.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                        {transporter.description}
                                                    </p>
                                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {transporter.price.toFixed(2)} €
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
            </motion.div>

                        {/* Payment Form */}
                        {stripeKey ? (
                    <StripeProvider stripeKey={stripeKey}>
                        <CheckoutForm
                            totalToPay={totalToPay}
                            cartItems={cartItems}
                            onPaymentSuccess={() => console.log("Paiement terminé")}
                            selectedTransporter={selectedTransporter}
                            deliveryCost={deliveryCost}
                        />
                    </StripeProvider>
                        ) : (
                            <Card className="border-red-200 dark:border-red-800">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                                        <AlertCircle className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <p className="font-semibold mb-1">Erreur de configuration</p>
                                            <p className="text-sm">Impossible de charger Stripe. Veuillez réessayer plus tard.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
                    </div>
    );
};

export default PaymentPage;