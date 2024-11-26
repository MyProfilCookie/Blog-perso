/* eslint-disable react/jsx-sort-props */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from "react";
import { Button, Input, Avatar, Tooltip } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faHeadset, faClock } from "@fortawesome/free-solid-svg-icons";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

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

    // const saveOrder = async (items: any[], total: number, transactionId: string) => {
    //     const token = localStorage.getItem("userToken");

    //     if (!token) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Utilisateur non authentifié. Veuillez vous reconnecter.",
    //             icon: "error",
    //             confirmButtonText: "OK",
    //         });
    //         return;
    //     }

    //     try {
    //         // Récupération des données utilisateur
    //         const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });

    //         if (!userResponse.ok) throw new Error("Erreur lors de la récupération des informations utilisateur.");
    //         const userData = (await userResponse.json()).user;

    //         // Préparation des données de la commande
    //         const orderData = {
    //             items: items.map((item: { productId: any; title: any; quantity: any; price: any; weight: any; }) => ({
    //                 productId: item.productId,
    //                 title: item.title,
    //                 quantity: item.quantity,
    //                 price: item.price,
    //                 weight: item.weight,
    //             })),
    //             totalAmount: total,
    //             transactionId,
    //             paymentMethod: "card",
    //             deliveryCost: 5,
    //             deliveryAddress: {
    //                 street: userData.deliveryAddress?.street || "Adresse inconnue",
    //                 city: userData.deliveryAddress?.city || "Ville inconnue",
    //                 postalCode: userData.deliveryAddress?.postalCode || "Code postal inconnu",
    //                 country: userData.deliveryAddress?.country || "France",
    //             },
    //             phone: userData.phone || "Numéro inconnu",
    //             email: userData.email || "Email inconnu",
    //             firstName: userData.firstName || "Prénom inconnu",
    //             lastName: userData.lastName || "Nom inconnu",
    //         };

    //         console.log("Données envoyées à l'API /orders :", JSON.stringify(orderData, null, 2));

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
    //         if (!orderId) throw new Error("Aucun orderId retourné.");

    //         // Préparation des données pour la confirmation de paiement
    //         const paymentConfirmationData = {
    //             orderId,
    //             userId: userData._id,
    //             transactionId,
    //             paymentMethod: 'Credit Card',
    //             paymentStatus: 'Paid',
    //             amount: total,
    //         };

    //         console.log("Données pour la confirmation de paiement :", JSON.stringify(paymentConfirmationData, null, 2));

    //         // Envoi de la confirmation de paiement
    //         const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify(paymentConfirmationData),
    //         });

    //         const paymentResponseData = await paymentResponse.json();

    //         if (!paymentResponse.ok) {
    //             console.error("Erreur API /payment-confirmations :", paymentResponseData);
    //             throw new Error("Erreur lors de la confirmation de paiement.");
    //         }

    //         console.log("Confirmation de paiement enregistrée :", paymentResponseData);

    //         // Sauvegarde de l'_id de la confirmation dans le localStorage
    //         localStorage.setItem("confirmationId", paymentResponseData.confirmation._id);

    //         Swal.fire({
    //             title: "Commande enregistrée",
    //             text: "Votre commande et le paiement ont été enregistrés avec succès.",
    //             icon: "success",
    //             confirmButtonText: "OK",
    //         });

    //         return { orderId, confirmationId: paymentResponseData.confirmation._id };
    //     } catch (error) {
    //         console.error("Erreur lors de l'enregistrement de la commande ou de la confirmation :", error);
    //         Swal.fire({
    //             title: "Erreur",
    //             text: "Impossible d'enregistrer votre commande et le paiement.",
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

        try {
            // Récupération des données utilisateur
            const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!userResponse.ok) {
                throw new Error("Erreur lors de la récupération des informations utilisateur.");
            }

            const userData = (await userResponse.json()).user;

            // Vérifications supplémentaires des données utilisateur
            const deliveryAddress = userData.deliveryAddress || {};
            const orderData = {
                items: items.map((item: { productId: any; title: any; quantity: any; price: any; weight: any }) => ({
                    productId: item.productId,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.price,
                    weight: item.weight,
                })),
                totalAmount: total,
                transactionId,
                paymentMethod: "card",
                deliveryCost: 5,
                deliveryAddress: {
                    street: deliveryAddress.street || "Adresse inconnue",
                    city: deliveryAddress.city || "Ville inconnue",
                    postalCode: deliveryAddress.postalCode || "Code postal inconnu",
                    country: deliveryAddress.country || "France",
                },
                phone: userData.phone || "Numéro inconnu",
                email: userData.email || "Email inconnu",
                firstName: userData.firstName || "Prénom inconnu",
                lastName: userData.lastName || "Nom inconnu",
            };

            console.log("Données envoyées à l'API /orders :", JSON.stringify(orderData, null, 2));

            // Création de la commande
            const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const orderResponseData = await orderResponse.json();

            if (!orderResponse.ok) {
                console.error("Erreur API /orders :", orderResponseData);
                throw new Error(orderResponseData.message || "Erreur lors de la création de la commande.");
            }

            const orderId = orderResponseData.order?._id;
            if (!orderId) throw new Error("Aucun orderId retourné.");

            // Préparation des données pour la confirmation de paiement
            const paymentConfirmationData = {
                orderId,
                userId: userData._id,
                transactionId,
                paymentMethod: "Credit Card",
                paymentStatus: "Paid",
                amount: total,
            };

            console.log("Données pour la confirmation de paiement :", JSON.stringify(paymentConfirmationData, null, 2));

            // Envoi de la confirmation de paiement
            const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-confirmations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(paymentConfirmationData),
            });

            const paymentResponseData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                console.error("Erreur API /payment-confirmations :", paymentResponseData);
                throw new Error("Erreur lors de la confirmation de paiement.");
            }

            console.log("Confirmation de paiement enregistrée :", paymentResponseData);

            // Sauvegarde de l'_id de la confirmation dans le localStorage
            localStorage.setItem("confirmationId", paymentResponseData.confirmation._id);

            Swal.fire({
                title: "Commande enregistrée",
                text: "Votre commande et le paiement ont été enregistrés avec succès.",
                icon: "success",
                confirmButtonText: "OK",
            });

            return { orderId, confirmationId: paymentResponseData.confirmation._id };
        } catch (error: any) {
            console.error("Erreur lors de l'enregistrement de la commande ou de la confirmation :", error);
            Swal.fire({
                title: "Erreur",
                text: error.message || "Impossible d'enregistrer votre commande et le paiement.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <form className="mt-6" onSubmit={handleSubmit}>
            <div className="bg-gray-50 border rounded-lg shadow-md p-4">
                <label className="block text-lg font-semibold mb-2 text-gray-700" htmlFor="card-element">
                    Informations de Carte Bancaire
                </label>
                <div className="border p-4 rounded-lg bg-gray-50 shadow-sm mb-4">
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
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg mt-4" type="submit">
                Payer {totalToPay} €
            </Button>
        </form>
    );
};

const PaymentPage = () => {
    const [user, setUser] = useState<any>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalToPay, setTotalToPay] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(4);
    const [selectedTransporter, setSelectedTransporter] = useState<string>(""); const [promoCode, setPromoCode] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(900); // 15 minutes
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                Swal.fire({
                    title: "Erreur",
                    text: "Vous devez être connecté pour accéder à cette page.",
                    icon: "error",
                    confirmButtonText: "OK",
                }).then(() => router.push("/users/login"));

                return;
            }

            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Échec de la récupération des données utilisateur");
                }

                const { user } = await response.json();

                setUser(user);
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur :", error);
                Swal.fire({
                    title: "Erreur",
                    text: "Impossible de récupérer vos informations utilisateur.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        };

        const loadCartData = () => {
            const storedCartItems = localStorage.getItem("cartItems");
            const storedTotalPrice = localStorage.getItem("totalPrice");

            const items = storedCartItems ? JSON.parse(storedCartItems) : [];
            const total = storedTotalPrice ? parseFloat(storedTotalPrice) : 0;

            setCartItems(items);
            setTotalAmount(total);
            setTotalToPay(total - discount);
        };

        fetchUserData();
        loadCartData();
        setIsLoading(false);

        // Décrémenter le temps restant
        const timer = setInterval(() => {
            setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [API_URL, router, discount]);
    const handleTransporterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const transporter = event.target.value;
        const weight = cartItems.reduce((sum, item) => sum + item.weight, 0);
        const cost = calculateDeliveryCost(transporter, weight);
        setSelectedTransporter(transporter);
        setDeliveryCost(cost);
    };

    useEffect(() => {
        const loadCartData = () => {
            const storedCartItems = localStorage.getItem("cartItems");
            setCartItems(storedCartItems ? JSON.parse(storedCartItems) : []);
        };

        loadCartData();
    }, []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function validatePromoCode(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="container mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Paiement de vos Cours</h1>
            {/* Transporter Selection */}
            <div className="mt-4 mb-4">
                <label htmlFor="transporter" className="block mb-2 font-semibold">Choisissez un transporteur :</label>
                <select id="transporter" className="w-full p-3 border rounded-lg" onChange={handleTransporterChange}>
                    <option value="">Sélectionnez un transporteur</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Colissimo">Colissimo</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations utilisateur */}
                <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar
                            size="lg"
                            src={user?.image || "/assets/default-avatar.webp"}
                            alt={`Avatar de ${user?.prenom || "Utilisateur"}`}
                        />
                        <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user?.prenom || "Utilisateur"} !</h2>
                    </div>
                    <div className="space-y-4">
                        <p>
                            <strong>Email :</strong> {user?.email}
                        </p>
                        <p>
                            <strong>Adresse :</strong> {user?.deliveryAddress?.street}, {user?.deliveryAddress?.city},{" "}
                            {user?.deliveryAddress?.postalCode}, {user?.deliveryAddress?.country}
                        </p>
                    </div>
                </div>

                {/* Récapitulatif de la commande */}
                <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Résumé de votre commande</h2>
                    <ul className="mb-4">
                        {cartItems.map((item: any, index: number) => (
                            <li key={index} className="mb-2">
                                <strong>{item.title}</strong> - {item.price} € x {item.quantity}
                            </li>
                        ))}
                    </ul>
                    <p>
                        <strong>Total des cours :</strong> {totalAmount} €
                    </p>
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
                <input type="text" id="promoCode" className="w-full p-3 border rounded-lg" onChange={(e) => setPromoCode(e.target.value)} />
            </div>

            {/* Promo Code Validation */}
            <div className="mt-4 mb-4">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg" onClick={validatePromoCode}>Valider le code promo</button>
            </div>

            {/* Timer */}
            <div className="mt-4 mb-4">
                <p>Temps restant pour payer : {Math.floor(remainingTime / 60)} minutes {remainingTime % 60} secondes</p>
            </div>

            {/* Formulaire de paiement */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalToPay={parseFloat((totalAmount - discount + deliveryCost).toFixed(2))} cartItems={cartItems} onPaymentSuccess={() => console.log("Paiement terminé")} />
                </Elements>
            </div>


        </div>
    );
};

export default PaymentPage;















