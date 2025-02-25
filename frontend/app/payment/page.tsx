/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect, use } from "react";
import { Button, Input, Avatar, Tooltip, user } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import mongoose from "mongoose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faHeadset, faClock, faCheckCircle, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Footer from "@/components/footer";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Définir une interface pour l'utilisateur


const CheckoutForm = ({ totalToPay, cartItems, onPaymentSuccess, selectedTransporter, deliveryCost }: { totalToPay: number; cartItems: any[]; onPaymentSuccess: () => void; selectedTransporter: string; deliveryCost: number; }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
            });

            if (error) {
                Swal.fire({
                    title: "Erreur",
                    text: error.message || "Une erreur est survenue lors du paiement.",
                    icon: "error",
                    confirmButtonText: "Réessayer",
                });

                return;
            }

            // Appeler la fonction pour enregistrer la commande après un paiement réussi
            await saveOrder(cartItems, totalToPay, paymentMethod?.id);

            Swal.fire({
                title: "Paiement réussi",
                text: "Merci pour votre achat !",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                onPaymentSuccess();
                router.push("/payment-confirmations");
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
    };
    const saveOrder = async (items: any[], total: number, transactionId: string) => {
        let token = localStorage.getItem("userToken");

        if (!selectedTransporter) {
            Swal.fire({
                title: "Erreur",
                text: "Veuillez sélectionner un transporteur avant de continuer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (!token) {
            Swal.fire({
                title: "Erreur",
                text: "Votre session a expiré. Veuillez vous reconnecter.",
                icon: "error",
                confirmButtonText: "Se reconnecter",
            }).then(() => {
                localStorage.removeItem("userToken");
                window.location.href = "/users/login";
            });
            return;
        }

        if (!items || items.length === 0) {
            Swal.fire({
                title: "Erreur",
                text: "Le panier est vide. Ajoutez des articles avant de passer commande.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        try {
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!userResponse.ok) {
                throw new Error("Erreur lors de la récupération des informations utilisateur.");
            }

            const userData = await userResponse.json();
            console.log("✅ Données utilisateur récupérées :", userData);

            const formattedItems = items.map((item) => ({
                productId: item.productId || item._id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
            }));

            const orderData = {
                firstName: userData.user.prenom,
                lastName: userData.user.nom,
                email: userData.user.email,
                phone: userData.user.phone,
                deliveryAddress: userData.user.deliveryAddress,
                items: formattedItems,
                totalAmount: total,
                transactionId,
                paymentMethod: "card",
                deliveryMethod: selectedTransporter,
                deliveryCost: deliveryCost,
            };

            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!orderResponse.ok) {
                throw new Error("Erreur lors de la création de la commande.");
            }

            const orderResponseData = await orderResponse.json();
            const orderId = orderResponseData.order?._id;
            localStorage.setItem("orderId", orderId);

            // Enregistrer la confirmation de paiement
            await confirmPayment(userData.user, orderId, transactionId, total, "card");

            localStorage.removeItem(`cartItems_${userData.user.pseudo}`);
            localStorage.removeItem("totalPrice");
            window.dispatchEvent(new Event("cartUpdated"));

            Swal.fire({
                title: "Commande enregistrée",
                text: "Votre commande et le paiement ont été enregistrés avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("❌ Erreur lors de l'enregistrement de la commande :", error);
            Swal.fire({
                title: "Erreur",
                text: (error as Error).message || "Impossible d'enregistrer votre commande et le paiement.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    // ✅ Fonction d'enregistrement de la confirmation de paiement
    const confirmPayment = async (
        user: any,
        orderId: string,
        transactionId: string,
        amount: number,
        paymentMethod: string
    ) => {
        if (!user || !user._id || !orderId || !transactionId || !amount || !paymentMethod) {
            console.error("❌ Erreur : Données manquantes pour la confirmation de paiement.");
            return;
        }

        const confirmationData = {
            orderId,
            userId: user._id,
            transactionId,
            paymentMethod: paymentMethod === "card" ? "Credit Card" : paymentMethod,  // ✅ Conversion sécurisée
            paymentStatus: "Paid",
            amount,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(confirmationData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Erreur lors de l'envoi de la confirmation de paiement :", errorData);

                throw new Error(
                    errorData.message || "Erreur lors de la confirmation du paiement."
                );
            }

            const result = await response.json();
            console.log("✅ Confirmation de paiement enregistrée avec succès :", result);
            return result; // Renvoie la confirmation pour un traitement ultérieur si nécessaire
        } catch (error: any) {
            console.error("❌ Erreur lors de l'enregistrement de la confirmation de paiement :", error.message);
            throw new Error(error.message || "Erreur inattendue lors de la confirmation du paiement.");
        }
    };
    return (
        <form className="mt-6" onSubmit={handleSubmit}>
            <div className="p-4 bg-gray-50 rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
                <label className="block mb-2 text-lg font-semibold text-gray-700 dark:text-white" htmlFor="card-element">
                    Informations de Carte Bancaire
                </label>
                <div className="p-4 mb-4 bg-gray-50 dark:bg-slate-900  rounded-lg border shadow-sm">
                    <CardElement
                        id="card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#32325d",
                                    "::placeholder": { color: "#aab7c4" },
                                },
                                invalid: { color: "#fa755a" },
                            },
                        }}
                    />
                </div>
            </div>
            <Button className="py-2 mt-4 w-full font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" type="submit">
                Payer {totalToPay} €
            </Button>
        </form>
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

    // ✅ Fonction pour calculer le poids total du colis
    const calculateTotalWeight = (items: any[]) => {
        return items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
    };

    // ✅ Fonction pour calculer les frais de livraison en fonction du poids et du transporteur
    const calculateDeliveryCost = (weight: number, transporter: string) => {
        const pricing = {
            Colissimo: weight <= 1 ? 4 : weight <= 3 ? 6 : weight <= 5 ? 8 : 12,
            UPS: weight <= 1 ? 6 : weight <= 3 ? 8 : weight <= 5 ? 10 : 15,
            DHL: weight <= 1 ? 8 : weight <= 3 ? 10 : weight <= 5 ? 12 : 18,
        } as Record<string, number>;
        return pricing[transporter] || 0;
    };

    // ✅ Vérifier l'authentification et charger les données utilisateur et panier
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

            // Charger le panier correspondant au pseudo de l'utilisateur
            const userCartKey = `cartItems_${userData.user.pseudo}`;
            const storedCart = localStorage.getItem(userCartKey);

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);

                // ✅ Calcul du poids total du colis
                const weight = calculateTotalWeight(parsedCart);
                setTotalWeight(weight);

                // ✅ Calcul du coût de livraison initial
                const cost = calculateDeliveryCost(weight, selectedTransporter);
                setDeliveryCost(cost);

                // ✅ Calcul du total
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

    // ✅ Gestion du changement de transporteur
    const handleTransporterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const transporter = event.target.value;
        setSelectedTransporter(transporter);

        // 🔥 Mise à jour du coût de livraison en fonction du poids
        const cost = calculateDeliveryCost(totalWeight, transporter);
        setDeliveryCost(cost);

        // 🔥 Mise à jour du total à payer
        const totalCartAmount = cartItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        setTotalToPay(totalCartAmount + cost);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="container p-6 mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-none"
        >
            {user && (
                <motion.h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">
                    Commande de {user.nom} {user.prenom}
                </motion.h1>
            )}

            {/* 🏠 Informations Utilisateur */}
            {user && (
                <motion.div className="mb-6 p-4 bg-indigo-50 rounded-lg dark:bg-gray-800 shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-white">Informations utilisateur</h2>
                    <Avatar src={user.avatar || "/assets/default-avatar.webp"} size="lg" />
                    <p className="text-gray-500 dark:text-white"><strong>Email :</strong> {user.email}</p>
                    <p className="text-gray-500 dark:text-white"><strong>Téléphone :</strong> {user.phone}</p>
                </motion.div>
            )}

            {/* 🛒 Détails du panier */}
            <motion.div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-white">Votre panier :</h2>
                <p><strong>Poids total :</strong> {totalWeight.toFixed(2)} kg</p>
                <p><strong>Total avant livraison :</strong> {totalToPay - deliveryCost} €</p>
                <p><strong>Frais de livraison :</strong> {deliveryCost} €</p>
                <p className="text-xl font-bold text-green-500">Total à payer : {totalToPay} €</p>
            </motion.div>

            {/* 🚚 Sélection du transporteur */}
            <motion.div className="mt-4">
                <label htmlFor="transporter" className="block mb-2 font-semibold">Sélectionnez un transporteur :</label>
                <select id="transporter" value={selectedTransporter} className="p-3 w-full rounded-lg border" onChange={handleTransporterChange}>
                    <option value="">Sélectionnez un transporteur</option>
                    <option value="Colissimo">Colissimo</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                </select>
            </motion.div>

            {/* 💳 Paiement */}
            <motion.div className="mt-6">
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        totalToPay={totalToPay}
                        cartItems={cartItems}
                        onPaymentSuccess={() => console.log("Paiement terminé")}
                        selectedTransporter={selectedTransporter}
                        deliveryCost={deliveryCost}
                    />
                </Elements>
      </motion.div>
      <Footer />
    </motion.div>
  );
};

export default PaymentPage;