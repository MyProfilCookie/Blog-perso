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


const CheckoutForm = ({ totalToPay, cartItems, onPaymentSuccess }: { totalToPay: number; cartItems: any[]; onPaymentSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

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
    //     const token = localStorage.getItem("userToken");
    //     const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
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
                throw new Error("Erreur lors de la récupération des informations utilisateur.");
            }

            const userData = await userResponse.json();
            const deliveryAddress = userData.deliveryAddress || {
                street: "Adresse inconnue",
                city: "Ville inconnue",
                postalCode: "Code postal inconnu",
                country: "France",
            };

            // Conversion des items
            const formattedItems = items.map((item) => ({
                productId: mongoose.Types.ObjectId.isValid(item.productId)
                    ? new mongoose.Types.ObjectId(item.productId)
                    : item.productId, // Laisse tel quel si c'est une chaîne
                title: String(item.title).trim(),
                quantity: Number(item.quantity),
                price: Number(item.price),
            }));

            const orderData = {
                items: formattedItems,
                totalAmount: total,
                transactionId,
                paymentMethod: "card",
                deliveryMethod: "Mondial Relay",
                deliveryCost: 5,
                deliveryAddress,
                phone: userData.phone || "Numéro inconnu",
                email: userData.email || "Email inconnu",
                firstName: userData.firstName || "Prénom inconnu",
                lastName: userData.lastName || "Nom inconnu",
            };

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
    };

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
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [totalToPay, setTotalToPay] = useState<number>(0);
    const [deliveryCost, setDeliveryCost] = useState<number>(4);
    const [selectedTransporter, setSelectedTransporter] = useState<string>("");
    const [promoCode, setPromoCode] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(900); // 15 minutes
    const [isLoading, setIsLoading] = useState(true);
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>("");

    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // recuperes les données dans la base de données
    const fetchUser = async () => {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        console.log("data :", data);
        console.log("data.user :", data.user);
        return data.user;

    };

    useEffect(() => {
        fetchUser().then(setUser);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const storedCartItems = localStorage.getItem("cartItems");
            const storedTotalPrice = localStorage.getItem("totalPrice");

            const parsedCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
            const parsedTotalPrice = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;

            const user = await fetchUser();
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                router.replace("/users/login");
            }

            setCartItems(parsedCartItems);
            setTotalAmount(parsedTotalPrice);
            setIsLoading(false);
        };

        loadData();
    }, []);

    // Écoute des mises à jour utilisateur via un événement personnalisé
    useEffect(() => {
        const handleUserUpdate = () => {
            const storedUser = localStorage.getItem("user");
            console.log("storedUser :", storedUser);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                console.log("parsedUser :", parsedUser);

                setUser({
                    ...parsedUser,
                    deliveryAddress: parsedUser.deliveryAddress || {
                        street: "Adresse inconnue",
                        city: "Ville inconnue",
                        postalCode: "Code postal inconnu",
                        country: "Pays inconnu",
                    },
                });
            } else {
                setUser(null);
                router.replace("/users/login");
            }
        };

        window.addEventListener("userUpdate", handleUserUpdate);

        return () => {
            window.removeEventListener("userUpdate", handleUserUpdate);
        };
    }, [router]);

    // Chargement des données du panier
    useEffect(() => {
        const loadCartData = () => {
            const storedCartItems = localStorage.getItem("cartItems");
            const storedTotalPrice = localStorage.getItem("totalPrice");

            const items = storedCartItems ? JSON.parse(storedCartItems) : [];
            const total = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;

            setCartItems(items);
            setTotalAmount(total);
            setTotalToPay(total - discount);
        };

        loadCartData();
        setIsLoading(false);

        // Décrémenter le temps restant
        const timer = setInterval(() => {
            setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [discount]);

    // Gestion dynamique des frais de livraison
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
    // Fonction pour calculer le total du panier
    const calculateCartTotal = (items: any[]) => {
        return items.reduce((total: number, item: { price: any; quantity: any; }) => {
            const itemTotal = (item.price || 0) * (item.quantity || 0);
            return total + itemTotal;
        }, 0);
    };

    // Gestion des changements dans le transporteur et recalcul des totaux
    useEffect(() => {
        const totalCartAmount = calculateCartTotal(cartItems);
        const updatedDeliveryCost = calculateDeliveryCost(selectedTransporter, cartItems.reduce((sum, item) => sum + item.weight, 0));
        const updatedTotalToPay = totalCartAmount - discount + updatedDeliveryCost;

        setDeliveryCost(updatedDeliveryCost);
        setTotalAmount(totalCartAmount);
        setTotalToPay(parseFloat(updatedTotalToPay.toFixed(2))); // Arrondi à 2 décimales
    }, [cartItems, discount, selectedTransporter]);
    // Gestion des réductions

    const handleTransporterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const transporter = event.target.value;
        const weight = cartItems.reduce((sum, item) => sum + item.weight, 0);
        const cost = calculateDeliveryCost(transporter, weight);
        setSelectedTransporter(transporter);
        setDeliveryCost(cost);
    };
    const calculateEstimatedDeliveryDate = (transporter: string): string => {
        const currentDate = new Date();
        let deliveryDays = 4; // Default to Colissimo
        if (transporter === "UPS") deliveryDays = 2;
        else if (transporter === "DHL") deliveryDays = 3;

        currentDate.setDate(currentDate.getDate() + deliveryDays);
        return currentDate.toLocaleDateString("fr-FR");
    };


    const handleLogout = () => {
        localStorage.removeItem("userToken");
        router.replace("/users/login");
    };

    const validatePromoCode = () => {
        if (promoCode === "PROMO10") {
            setDiscount(totalAmount * 0.1);
            Swal.fire({
                title: "Code promo appliqué !",
                text: "Vous avez bénéficié de 10% de réduction.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } if (promoCode === "PROMO20") {
            setDiscount(totalAmount * 0.2);
            Swal.fire({
                title: "Code promo appliqué !",
                text: "Vous avez bénéficié de 20% de réduction.",
                icon: "success",
                confirmButtonText: "OK",
            });
        }
        else {
            Swal.fire({
                title: "Code promo invalide",
                text: "Veuillez entrer un code valide.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };
    useEffect(() => {
        const loadUserAndCart = async () => {
            const token = localStorage.getItem("userToken");
            if (!token) {
                router.push("/users/login");
                return;
            }

            const storedCartItems = localStorage.getItem("cartItems");
            const parsedCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
            const totalWeight = parsedCartItems.reduce((sum: any, item: { weight: any; }) => sum + (item.weight || 0), 0);

            setCartItems(parsedCartItems);
            setDeliveryCost(calculateDeliveryCost(selectedTransporter, totalWeight));
        };

        loadUserAndCart();
    }, [selectedTransporter]);

    useEffect(() => {
        setEstimatedDeliveryDate(calculateEstimatedDeliveryDate(selectedTransporter));
    }, [selectedTransporter]);




    return (
        <div className="container p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
            <h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">Paiement de vos Cours</h1>
            {/* date estimée de livraison si la commande est validée en fonction du transporteur choisit, 4 jours si c'est colissimo, dhl 3 jours et 2 jours ups  */}
            <h2>Date estimée de livraison : <strong>{estimatedDeliveryDate}</strong></h2>
            {/* Transporter Selection */}
            <div className="mt-4 mb-4">
                <label htmlFor="transporter" className="block mb-2 font-semibold">Choisissez un transporteur :</label>
                <select id="transporter" className="p-3 w-full rounded-lg border" onChange={handleTransporterChange}>
                    <option value="">Sélectionnez un transporteur</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Colissimo">Colissimo</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Informations utilisateur */}
                <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                    <div className="flex gap-4 items-center mb-4">
                        <Avatar
                            size="lg"
                            src={user?.avatar || "/assets/default-avatar.webp"}
                            alt={`Avatar de ${user?.pseudo || "Utilisateur"}`}
                        />
                        <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user?.pseudo || "Utilisateur"} !</h2>
                    </div>
                    <div className="space-y-4">
                        <p>
                            <strong>Email :</strong> {user?.email}
                        </p>
                        <p>
                            <strong>Nom :</strong> {user?.nom}
                        </p>
                        <p>
                            <strong>Prénom :</strong> {user?.prenom}
                        </p>
                        <p>
                            <strong>Adresse :</strong> {user?.deliveryAddress?.street}, {user?.deliveryAddress?.city}, {user?.deliveryAddress?.postalCode}, {user?.deliveryAddress?.country}
                        </p>
                        <p>
                            <strong>Téléphone :</strong> {user?.phone}
                        </p>
                        <button className="py-2 w-full font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" onClick={handleLogout}>Déconnexion</button>
                    </div>
                </div>

                {/* Récapitulatif de la commande */}
                <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                    <h2 className="mb-4 text-xl font-semibold text-gray-800">Résumé de votre commande</h2>
                    <ul className="mb-4">
                        {cartItems.map((item: any, index: number) => (
                            <li key={index} className="mb-2">
                                <strong>{item.title}</strong> - {item.price} € x {item.quantity}
                                {/* description des articles */}
                                <p className="text-gray-600">{item.description}</p>
                                {/* image du produit */}
                                <img src={item.imageUrl} alt={item.title} className="w-10 h-10 object-cover object-center rounded-lg" />

                            </li>
                        ))}
                    </ul>
                    {/* <p>
                        <strong>Total des cours :</strong> {totalAmount} €
                    </p> */}
                    <p>
                        <strong>Réduction :</strong> {discount.toFixed(2)} €
                    </p>
                    <p>
                        <strong>Frais de livraison :</strong> {deliveryCost.toFixed(2)} €
                    </p>
                    <p>
                        <strong>Total à payer :</strong> {(totalAmount - discount + deliveryCost).toFixed(2)} €
                    </p>
                </div>
            </div>
            {/* Promo Code */}
            <div className="mt-4 mb-4">
                <label htmlFor="promoCode" className="block mb-2 font-semibold">Entrez votre code promo :</label>
                <input type="text" id="promoCode" className="p-3 w-full rounded-lg border" onChange={(e) => setPromoCode(e.target.value)} />
            </div>

            {/* Promo Code Validation */}
            <div className="mt-4 mb-4">
                <button className="py-2 w-full font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" onClick={validatePromoCode}>Valider le code promo</button>
            </div>

            {/* Timer */}
            <div className="mt-4 mb-4">
                <p>Temps restant pour payer : {Math.floor(remainingTime / 60)} minutes {remainingTime % 60} secondes</p>
            </div>

            {/* Formulaire de paiement */}
            <div className="p-6 mt-6 bg-gray-50 rounded-lg shadow-md">
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalToPay={parseFloat((totalAmount - discount + deliveryCost).toFixed(2))} cartItems={cartItems} onPaymentSuccess={() => console.log("Paiement terminé")} />
                </Elements>
            </div>


        </div>
    );
};

export default PaymentPage;

