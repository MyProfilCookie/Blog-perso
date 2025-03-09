/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-sort-props */
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
            <div className="flex justify-center items-center h-screen">
                <LoadingAnimation />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto my-12 text-center">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-red-400">Commande introuvable.</p>
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
                            {deliveryAddress.city}, {deliveryAddress.postalCode}<br />
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
                                <div key={item.productId || item._id} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Badge variant="outline" className="mr-2">
                                            {item.quantity}
                                        </Badge>
                                        <span>{item.title}</span>
                                    </div>
                                    <span className="font-medium">{item.price?.toFixed(2)} €</span>
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
                                    <span className="text-yellow-500">{totalAmount.toFixed(2)} € 🎯</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-400 text-center">Aucun article trouvé dans la commande.</p>
                    )}
                </CardContent>
            </Card>

            <div className="mt-8 text-center">
                <Button
                    onClick={handleBack}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transform transition-transform hover:scale-105"
                >
                    🔙 Retourner à l'accueil
                </Button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;

