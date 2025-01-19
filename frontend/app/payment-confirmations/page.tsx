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
                        "Aucun ID de commande trouvé. Veuillez passer une commande.",
                    );
                }

                if (!token) {
                    throw new Error(
                        "Utilisateur non authentifié. Veuillez vous reconnecter.",
                    );
                }

                console.log("Fetching order with ID:", orderId);

                // Récupération des données de la commande
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (response.status === 404) {
                    throw new Error(
                        "Commande non trouvée. Assurez-vous d'avoir passé une commande valide.",
                    );
                }

                if (!response.ok) {
                    const errorData = await response.json();

                    throw new Error(
                        errorData.message ||
                        "Erreur lors de la récupération des données de commande.",
                    );
                }

                const orderData = await response.json();

                console.log("Order data fetched successfully:", orderData);
                setOrder(orderData);
            } catch (error: any) {
                console.error(
                    "Erreur lors de la récupération des données :",
                    error.message,
                );
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
            <div className="flex justify-center items-center h-screen">
                <LoadingAnimation />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto my-12 text-center">
                <p className="text-red-500">
                    Commande introuvable. Assurez-vous d'avoir passé une commande valide.
                </p>
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

    return (
        <div className="container p-6 mx-auto my-12 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">
                Confirmation de Commande
            </h1>

            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Informations Client
                </h2>
                <p>
                    <strong>Prénom :</strong> {firstName}
                </p>
                <p>
                    <strong>Nom :</strong> {lastName}
                </p>
                <p>
                    <strong>Email :</strong> {email}
                </p>
                <p>
                    <strong>Téléphone :</strong> {phone}
                </p>
            </div>

            <div className="p-6 mt-6 bg-indigo-50 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Adresse de Livraison
                </h2>
                <p>
                    {deliveryAddress.street}, {deliveryAddress.city},{" "}
                    {deliveryAddress.postalCode}, {deliveryAddress.country}
                </p>
            </div>

            <div className="p-6 mt-6 bg-indigo-50 rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Détails de la Commande
                </h2>
                <ul>
                    {items.length > 0 ? (
                        items.map((item: any) => (
                            <li
                                key={item.productId || item._id || Math.random()}
                                className="mb-2"
                            >
                                <strong>{item.quantity}</strong> x {item.title || "Article"} -{" "}
                                {item.price?.toFixed(2)} €
                            </li>
                        ))
                    ) : (
                        <li className="text-red-500">
                            Aucun article trouvé dans la commande.
                        </li>
                    )}
                </ul>
                <p>
                    <strong>Méthode de Livraison :</strong> {deliveryMethod}
                </p>
                <p>
                    <strong>Frais de Livraison :</strong> {deliveryCost.toFixed(2)} €
                </p>
                <p>
                    <strong>Méthode de Paiement :</strong> {paymentMethod}
                </p>
                <p>
                    <strong>Statut du Paiement :</strong> {paymentStatus}
                </p>
                <p className="mt-4 text-lg font-bold text-blue-500">
                    <strong>Total :</strong> {totalAmount.toFixed(2)} €
                </p>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
