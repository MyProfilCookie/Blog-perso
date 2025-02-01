/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import LoadingAnimation from "@/components/loading";

const OrderConfirmationPage = () => {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderId = localStorage.getItem("orderId");
                const token = localStorage.getItem("userToken");

                if (!orderId) {
                    throw new Error(
                        "Aucun ID de commande trouvé. Veuillez passer une commande."
                    );
                }

                if (!token) {
                    throw new Error(
                        "Utilisateur non authentifié. Veuillez vous reconnecter."
                    );
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 404) {
                    throw new Error("Commande non trouvée.");
                }

                const orderData = await response.json();
                setOrder(orderData);

                localStorage.removeItem("cartItems");
                localStorage.removeItem("totalPrice");
            } catch (error: any) {
                Swal.fire({
                    title: "Erreur",
                    text: error.message || "Une erreur inattendue s'est produite.",
                    icon: "error",
                    confirmButtonText: "Retourner à l'accueil",
                }).then(() => router.push("/"));
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <LoadingAnimation />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto my-12 text-center text-white">
                <p className="text-red-400">Commande introuvable.</p>
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

    const handleBack = () => {
        Swal.fire({
            title: "Retour",
            text: "Vous allez être redirigé et votre panier sera vidé.",
            icon: "info",
            confirmButtonText: "Continuer",
        }).then(() => {
            localStorage.removeItem("cartItems");
            localStorage.removeItem("totalPrice");
            router.push("/");
        });
    };

    return (
        <div className="container p-6 mx-auto my-12 bg-gray-900 rounded-lg shadow-xl text-white">
            <h1 className="mb-6 text-4xl font-extrabold text-center text-yellow-400 animate-bounce">
                🎉 Confirmation de Commande 🎉
            </h1>

            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">👤 Informations Client</h2>
                <p><strong>Prénom :</strong> {firstName}</p>
                <p><strong>Nom :</strong> {lastName}</p>
                <p><strong>Email :</strong> {email}</p>
                <p><strong>Téléphone :</strong> {phone}</p>
            </div>

            <div className="p-6 mt-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">📦 Adresse de Livraison</h2>
                <p>
                    {deliveryAddress.street}, {deliveryAddress.city}, {deliveryAddress.postalCode}, {deliveryAddress.country}
                </p>
            </div>

            <div className="p-6 mt-6 bg-gray-800 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold">🛒 Détails de la Commande</h2>
                <ul>
                    {items.length > 0 ? (
                        items.map((item: any) => (
                            <li key={item.productId || item._id} className="mb-2">
                                <strong>{item.quantity}</strong> x {item.title} - {item.price?.toFixed(2)} €
                            </li>
                        ))
                    ) : (
                        <li className="text-red-400">Aucun article trouvé dans la commande.</li>
                    )}
                </ul>
                <p><strong>🚚 Méthode de Livraison :</strong> {deliveryMethod}</p>
                <p><strong>💸 Frais de Livraison :</strong> {deliveryCost.toFixed(2)} €</p>
                <p><strong>💳 Méthode de Paiement :</strong> {paymentMethod}</p>
                <p><strong>✅ Statut du Paiement :</strong> {paymentStatus}</p>
                <p className="mt-4 text-2xl font-bold text-yellow-400">
                    <strong>Total :</strong> {totalAmount.toFixed(2)} € 🎯
                </p>
            </div>

            <div className="mt-6 text-center">
                <button
                    className="py-3 px-6 font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
                    onClick={handleBack}
                >
                    🔙 Retourner à l'accueil
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;

