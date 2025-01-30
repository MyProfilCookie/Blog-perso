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
import { faInfoCircle, faHeadset, faClock } from "@fortawesome/free-solid-svg-icons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Définir une interface pour l'utilisateur


const CheckoutForm = ({ totalToPay, cartItems, onPaymentSuccess, selectedTransporter }: { totalToPay: number; cartItems: any[]; onPaymentSuccess: () => void; selectedTransporter: string; }) => {
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
    //         headers: { Authorization: `Bearer ${token}` },
    //     });
    //     const userData = await userResponse.json();
    //     console.log("Données utilisateur récupérées :", userData);

    //     if (!token) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Utilisateur non authentifié. Veuillez vous reconnecter.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return;
    //     }

    //     if (!items || items.length === 0) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Le panier est vide. Ajoutez des articles avant de passer commande.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return;
    //     }

    //     try {
    //         const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         if (!userResponse.ok) {
    //             throw new Error("Erreur lors de la récupération des informations utilisateur.");
    //         }

    //         const userData = await userResponse.json();
    //         const deliveryAddress = userData.deliveryAddress || {
    //             street: "Adresse inconnue",
    //             city: "Ville inconnue",
    //             postalCode: "Code postal inconnu",
    //             country: "France",
    //         };

    //         const formattedItems = items.map((item) => {
    //             if (!item.productId || typeof item.productId !== "string") {
    //                 throw new Error(`L'article "${item.title}" est invalide. Le champ "productId" est requis et doit être une chaîne.`);
    //             }
    //             return {
    //                 productId: item.productId.trim(),
    //                 title: item.title,
    //                 quantity: item.quantity,
    //                 price: item.price,
    //             };
    //         });
    //         // recuperation des données de l'utilisateur
    //         const user = await userResponse.json();
    //         console.log("Données utilisateur récupérées :", userData);
    //         const orderData = {
    //             items: formattedItems,
    //             totalAmount: total,
    //             transactionId,
    //             paymentMethod: "card",
    //             deliveryMethod: "Mondial Relay",
    //             deliveryCost: 5,
    //             deliveryAddress,
    //             phone: user.phone || "Numéro inconnu",
    //             email: user.email || "Email inconnu",
    //             firstName: user.firstname || "Prénom inconnu",
    //             lastName: user.nom || "Nom inconnu",
    //         };

    //         console.log("Données envoyées à l'API :", JSON.stringify(orderData, null, 2));

    //         const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(orderData),
    //         });

    //         const orderResponseData = await orderResponse.json();

    //         if (!orderResponse.ok) {
    //             console.error("Erreur API /orders :", orderResponseData);
    //             throw new Error(orderResponseData.message || "Erreur lors de la création de la commande.");
    //         }

    //         const orderId = orderResponseData.order?._id;
    //         if (!orderId) throw new Error("Aucun identifiant de commande n'a été retourné.");

    //         localStorage.setItem("orderId", orderId);

    //         Swal.fire({
    //             title: "Commande enregistrée",
    //             text: "Votre commande et le paiement ont été enregistrés avec succès.",
    //             icon: "success",
    //             confirmButtonText: "OK",
    //         });

    //         return { orderId };
    //     } catch (error: any) {
    //         console.error("Erreur lors de l'enregistrement de la commande :", error);

    //         Swal.fire({
    //             title: "Erreur",
    //             text: error.message || "Impossible d'enregistrer votre commande et le paiement.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //     }
    // };

    const saveOrder = async (items: any[], total: number, transactionId: string) => {
        const token = localStorage.getItem("userToken");

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
                text: "Utilisateur non authentifié. Veuillez vous reconnecter.",
                icon: "error",
                confirmButtonText: "OK",
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
                const errorData = await userResponse.text();
                console.error("Erreur API /users/me :", errorData);
                throw new Error("Erreur lors de la récupération des informations utilisateur.");
            }

            const userData = await userResponse.json();
            console.log("Données utilisateur récupérées :", userData);

            // Ajout des informations de livraison et du transporteur
            userData.deliveryAddress = userData.deliveryAddress || {
                street: "Adresse inconnue",
                city: "Ville inconnue",
                postalCode: "Code postal inconnu",
                country: "France",
            };
            const calculateDeliveryCost = (transporter: string, weight: number): number => {
                if (transporter === "Colissimo") {
                    if (weight <= 2) return 4;
                    if (weight > 2 && weight <= 5) return 6;
                    return 8;
                } else if (transporter === "UPS") {
                    if (weight <= 2) return 6;
                    if (weight > 2 && weight <= 5) return 8;
                    return 10;
                } else if (transporter === "DHL") {
                    if (weight <= 2) return 8;
                    if (weight > 2 && weight <= 5) return 10;
                    return 12;
                }
                return 0; // Default cost
            };
            // / Calcul dynamique des frais de livraison
            const weight = items.reduce((sum, item) => sum + (item.weight || 0), 0); // Ajoutez un poids pour chaque article
            const deliveryCost = calculateDeliveryCost(selectedTransporter, weight);

            // Conversion des items pour l'API
            const formattedItems = items.map((item) => ({
                productId: mongoose.Types.ObjectId.isValid(item.productId)
                    ? new mongoose.Types.ObjectId(item.productId)
                    : item.productId, // Laisse tel quel si c'est une chaîne
                title: String(item.title).trim(),
                quantity: Number(item.quantity),
                price: Number(item.price),
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await response.json();

            const orderData = {
                firstName: data.user.prenom?.trim() || "Prénom inconnu", // Utilise `prenom` pour `firstName`
                lastName: data.user.nom?.trim() || "Nom inconnu",        // Utilise `nom` pour `lastName`
                email: data.user.email?.trim() || "Email inconnu",
                phone: data.user.phone?.trim() || "Numéro inconnu",
                deliveryAddress: data.user.deliveryAddress || {
                    street: "Adresse inconnue",
                    city: "Ville inconnue",
                    postalCode: "Code postal inconnu",
                    country: "France",
                },
                items: formattedItems,
                totalAmount: total,
                transactionId,
                paymentMethod: "card",
                deliveryMethod: selectedTransporter || "Non spécifié", // Inclure le transporteur choisi
                deliveryCost,
            };
            console.log("Données utilisateur finalisées pour la commande :", JSON.stringify(orderData, null, 2));

            console.log("Données envoyées à l'API :", JSON.stringify(orderData, null, 2));

            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                console.error("Erreur API /orders :", errorData);
                throw new Error(errorData.message || "Erreur lors de la création de la commande.");
            }

            const orderResponseData = await orderResponse.json();
            localStorage.setItem("orderId", orderResponseData.order?._id);

            Swal.fire({
                title: "Commande enregistrée",
                text: "Votre commande et le paiement ont été enregistrés avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la commande :", error);
            Swal.fire({
                title: "Erreur",
                text: (error as Error).message || "Impossible d'enregistrer votre commande et le paiement.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }
    return (
        <form className="mt-6" onSubmit={handleSubmit}>
            <div className="p-4 bg-gray-50 rounded-lg border shadow-md">
                <label className="block mb-2 text-lg font-semibold text-gray-700" htmlFor="card-element">
                    Informations de Carte Bancaire
                </label>
                <div className="p-4 mb-4 bg-gray-50 rounded-lg border shadow-sm">
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
    const router = useRouter();

    useEffect(() => {
        // Charger l'utilisateur et le panier depuis le localStorage
        const storedUser = localStorage.getItem("user");
        console.log("Utilisateur stocké :", storedUser);
        // console.log("adresse de livraison :", user.deliveryAddress);
        // console.log("nom de l'utilisateur :", user.nom);
        // console.log("prenom de l'utilisateur :", user.prenom);
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Charger le panier correspondant au pseudo de l'utilisateur
            const userCartKey = `cartItems_${parsedUser.pseudo}`;
            const storedCart = localStorage.getItem(userCartKey);

            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                setCartItems(parsedCart);

                // Calculer le total du panier
                const total = parsedCart.reduce(
                    (sum: number, item: any) => sum + item.price * item.quantity,
                    0
                );
                setTotalToPay(total + deliveryCost);
            } else {
                console.log("Aucun panier trouvé pour cet utilisateur.");
            }
        } else {
            console.log("Utilisateur non connecté. Redirection vers la page de connexion.");
            router.push("/users/login");
        }
    }, [router, deliveryCost]);

    const handleTransporterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const transporter = event.target.value;
        setSelectedTransporter(transporter);

        // Ajuster les frais de livraison en fonction du transporteur
        const cost =
            transporter === "Colissimo"
                ? 4
                : transporter === "UPS"
                    ? 6
                    : transporter === "DHL"
                        ? 8
                        : 0;
        setDeliveryCost(cost);

        // Recalculer le total à payer
        const totalCartAmount = cartItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );
        setTotalToPay(totalCartAmount + cost);
    };

    return (
        <div className="container p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
            <h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">
                Paiement
            </h1>

            {user && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informations utilisateur</h2>
                    <Avatar src={user.avatar || "/assets/default-avatar.webp"} size="lg" />
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">Bonjour {user.pseudo}</h3>
                    <p><strong>Nom :</strong> {user.nom}</p>
                    <p><strong>Prénom :</strong> {user.prenom}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Téléphone :</strong> {user.phone}</p>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Votre panier :</h2>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <strong>{item.title}</strong> - {item.price} € x {item.quantity}
                        </li>
                    ))}
                </ul>
                <p><strong>Total avant livraison :</strong> {totalToPay - deliveryCost} €</p>
                <p><strong>Frais de livraison :</strong> {deliveryCost} €</p>
                <p><strong>Total à payer :</strong> {totalToPay} €</p>
            </div>

            <div className="mt-4">
                <label htmlFor="transporter" className="block mb-2 font-semibold">Sélectionnez un transporteur :</label>
                <select id="transporter" value={selectedTransporter} className="p-3 w-full rounded-lg border" onChange={handleTransporterChange}>
                    <option value="">Sélectionnez un transporteur</option>
                    <option value="Colissimo">Colissimo</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                </select>
            </div>

            <Elements stripe={stripePromise}>
                <CheckoutForm
                    totalToPay={totalToPay}
                    cartItems={cartItems}
                    onPaymentSuccess={() => console.log("Paiement terminé")}
                    selectedTransporter={selectedTransporter}
                />
            </Elements>
        </div>
    );
};

export default PaymentPage;

