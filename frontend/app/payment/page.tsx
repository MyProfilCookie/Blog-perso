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
    //     let token = localStorage.getItem("userToken");

    //     if (!selectedTransporter) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Veuillez sélectionner un transporteur avant de continuer.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return;
    //     }

    //     if (!token) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Votre session a expiré. Veuillez vous reconnecter.",
    //             icon: "error",
    //             confirmButtonText: "Se reconnecter",
    //         }).then(() => {
    //             localStorage.removeItem("userToken"); // Supprimer le token corrompu
    //             window.location.href = "/users/login"; // Rediriger vers la connexion
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
    //         // 🔍 Vérification du token en envoyant la requête à `/users/me`
    //         const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         if (userResponse.status === 403) {
    //             console.error("❌ Token invalide ou expiré, suppression et déconnexion.");
    //             localStorage.removeItem("userToken"); // Supprime le token expiré

    //             Swal.fire({
    //                 title: "Session expirée",
    //                 text: "Votre session a expiré. Veuillez vous reconnecter.",
    //                 icon: "error",
    //                 confirmButtonText: "Se reconnecter",
    //             }).then(() => {
    //                 window.location.href = "/users/login"; // Rediriger vers la connexion
    //             });
    //             return;
    //         }

    //         if (!userResponse.ok) {
    //             const errorData = await userResponse.text();
    //             console.error("❌ Erreur API /users/me :", errorData);
    //             throw new Error("Erreur lors de la récupération des informations utilisateur.");
    //         }

    //         const userData = await userResponse.json();
    //         console.log("✅ Données utilisateur récupérées :", userData);

    //         // 🔍 Vérification et formatage des articles
    //         const formattedItems = items
    //             .map((item) => {
    //                 const productId = item.productId || item._id;
    //                 if (!productId || typeof productId !== "string") {
    //                     console.error(`❌ Erreur: L'article "${item.title}" n'a pas de productId valide !`, item);
    //                     return null;
    //                 }

    //                 return {
    //                     productId: productId.trim(),
    //                     title: String(item.title).trim(),
    //                     quantity: Number(item.quantity),
    //                     price: Number(item.price),
    //                 };
    //             })
    //             .filter((item) => item !== null);

    //         if (formattedItems.length === 0) {
    //             Swal.fire({
    //                 title: "Erreur",
    //                 text: "Tous les articles du panier sont invalides !",
    //                 icon: "error",
    //                 confirmButtonText: "OK",
    //             });
    //             return;
    //         }

    //         const orderData = {
    //             firstName: userData.user.prenom?.trim() || "Prénom inconnu",
    //             lastName: userData.user.nom?.trim() || "Nom inconnu",
    //             email: userData.user.email?.trim() || "Email inconnu",
    //             phone: userData.user.phone?.trim() || "Numéro inconnu",
    //             deliveryAddress: userData.user.deliveryAddress || {
    //                 street: "Adresse inconnue",
    //                 city: "Ville inconnue",
    //                 postalCode: "Code postal inconnu",
    //                 country: "France",
    //             },
    //             items: formattedItems,
    //             totalAmount: total,
    //             transactionId,
    //             paymentMethod: "card",
    //             deliveryMethod: selectedTransporter || "Non spécifié",
    //             deliveryCost: deliveryCost,
    //         };

    //         console.log("📦 Données envoyées à l'API :", JSON.stringify(orderData, null, 2));

    //         const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(orderData),
    //         });

    //         if (!orderResponse.ok) {
    //             const errorData = await orderResponse.json();
    //             console.error("❌ Erreur API /orders :", errorData);
    //             throw new Error(errorData.message || "Erreur lors de la création de la commande.");
    //         }

    //         const orderResponseData = await orderResponse.json();
    //         localStorage.setItem("orderId", orderResponseData.order?._id);

    //         // 🛒 **Vider le panier après paiement réussi**
    //         const userCartKey = `cartItems_${userData.user.pseudo}`;
    //         localStorage.removeItem(userCartKey);
    //         localStorage.removeItem("totalPrice"); // Supprimer aussi le total enregistré

    //         // 🔄 Déclencher un événement pour mettre à jour l'affichage du panier
    //         window.dispatchEvent(new Event("cartUpdated"));

    //         Swal.fire({
    //             title: "Commande enregistrée",
    //             text: "Votre commande et le paiement ont été enregistrés avec succès.",
    //             icon: "success",
    //             confirmButtonText: "OK",
    //         });
    //     } catch (error) {
    //         console.error("❌ Erreur lors de l'enregistrement de la commande :", error);
    //         Swal.fire({
    //             title: "Erreur",
    //             text: (error as Error).message || "Impossible d'enregistrer votre commande et le paiement.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //     }
    //     const confirmPayment = async (
    //         user: any,
    //         transactionId: string,
    //         amount: number,
    //         paymentMethod: string
    //     ) => {
    //         const confirmationData = {
    //             userId: user._id,
    //             transactionId,
    //             paymentMethod,
    //             amount,
    //         };

    //         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(confirmationData),
    //         });
    //     };
    // };
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
        <div className="container p-6 mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-none">
            <h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">
                Paiement
            </h1>

            {user && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informations utilisateur</h2>
                    <Avatar src={user.avatar || "/assets/default-avatar.webp"} size="lg" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-white mt-4">Bonjour {user.pseudo}</h3>
                    <p className="text-gray-500 dark:text-white"><strong>Nom :</strong> {user.nom}</p>
                    <p className="text-gray-500 dark:text-white"><strong>Prénom :</strong> {user.prenom}</p>
                    <p className="text-gray-500 dark:text-white"><strong>Email :</strong> {user.email}</p>
                    <p className="text-gray-500 dark:text-white"><strong>Téléphone :</strong> {user.phone}</p>

                </div>
            )}

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Votre panier :</h2>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index} className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                            <div className="flex items-center bg-white rounded-lg shadow-md p-4">
                                <div className="w-32 h-32 overflow-hidden rounded-lg">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                                <div className="ml-4">
                                    <strong className="block text-lg font-bold">{item.title}</strong>
                                    <p className="text-gray-600 mb-1">{item.description}</p>
                                    <p className="text-blue-600 font-semibold">{item.price} € x {item.quantity}</p>
                                </div>
                            </div>
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
                    deliveryCost={deliveryCost}
                />
            </Elements>
        </div>
    );
}
export default PaymentPage;