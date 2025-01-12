/* eslint-disable react/jsx-sort-props */
/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutForm = ({
    totalToPay,
    cartItems,
    onPaymentSuccess,
    selectedTransporter,
    deliveryCost,
    discount,
}: {
    totalToPay: number;
    cartItems: any[];
    onPaymentSuccess: () => void;
    selectedTransporter: string;
    deliveryCost: number;
    discount: number;
}) => {
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    totalAmount: totalToPay,
                    cartItems,
                    deliveryMethod: selectedTransporter,
                    deliveryCost,
                    discount,
                }),
            });

            if (!response.ok) {
                throw new Error("Échec de l'enregistrement de la commande.");
            }

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
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [deliveryCost, setDeliveryCost] = useState<number>(5);
    const [selectedTransporter, setSelectedTransporter] = useState<string>("Colissimo");
    const [promoCode, setPromoCode] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);
    const [deliveryDate, setDeliveryDate] = useState<string>("");
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                Swal.fire({
                    title: "Non authentifié",
                    text: "Veuillez vous connecter pour accéder à cette page.",
                    icon: "warning",
                    confirmButtonText: "Se connecter",
                }).then(() => {
                    router.replace("/users/login");
                });

                return;
            }

            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();

                    setUser(data.user);
                } else {
                    throw new Error("Session invalide");
                }
            } catch {
                Swal.fire({
                    title: "Erreur",
                    text: "Votre session a expiré. Veuillez vous reconnecter.",
                    icon: "error",
                    confirmButtonText: "Se connecter",
                }).then(() => {
                    router.replace("/users/login");
                });
            }
        };

        checkAuthentication();
    }, [router]);

    useEffect(() => {
        const loadCartData = () => {
            const storedCartItems = localStorage.getItem("cartItems");
            const items = storedCartItems ? JSON.parse(storedCartItems) : [];
            const total = items.reduce((sum: number, item: { price: number; quantity: any }) => sum + item.price * (item.quantity ?? 1), 0);
            const weight = items.reduce((sum: number, item: { weight: number }) => sum + (item.weight ?? 0), 0);

            setCartItems(items);
            setTotalAmount(total);
            setTotalWeight(weight);
        };

        const calculateDeliveryDate = () => {
            const today = new Date();

            today.setDate(today.getDate() + 2);
            setDeliveryDate(today.toLocaleDateString("fr-FR"));
        };

        loadCartData();
        calculateDeliveryDate();
    }, []);

    useEffect(() => {
        const calculateDeliveryCost = () => {
            if (selectedTransporter === "Colissimo") {
                if (totalWeight <= 2) return setDeliveryCost(5);
                if (totalWeight <= 5) return setDeliveryCost(7);

                return setDeliveryCost(10);
            } else if (selectedTransporter === "UPS") {
                if (totalWeight <= 2) return setDeliveryCost(6);
                if (totalWeight <= 5) return setDeliveryCost(9);

                return setDeliveryCost(12);
            } else if (selectedTransporter === "DHL") {
                if (totalWeight <= 2) return setDeliveryCost(8);
                if (totalWeight <= 5) return setDeliveryCost(11);

                return setDeliveryCost(15);
            }
        };

        calculateDeliveryCost();
    }, [selectedTransporter, totalWeight]);

    const validatePromoCode = () => {
        if (promoCode === "PROMO10") {
            setDiscount(totalAmount * 0.1);
            Swal.fire({
                title: "Code promo appliqué !",
                text: "Vous avez bénéficié de 10% de réduction.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } else if (promoCode === "PROMO20") {
            setDiscount(totalAmount * 0.2);
            Swal.fire({
                title: "Code promo appliqué !",
                text: "Vous avez bénéficié de 20% de réduction.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } else {
            Swal.fire({
                title: "Code promo invalide",
                text: "Veuillez entrer un code valide.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setDiscount(0);
        }
    };

    const totalToPay = (totalAmount - discount + deliveryCost).toFixed(2);

    if (!user) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="container p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg">
            <h1 className="mb-6 text-4xl font-bold text-center text-indigo-600">Paiement de vos Cours</h1>
            <div className="p-6 mt-6 bg-gray-50 rounded-lg shadow-md">
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        totalToPay={parseFloat(totalToPay)}
                        cartItems={cartItems}
                        onPaymentSuccess={() => console.log("Paiement terminé")}
                        selectedTransporter={selectedTransporter}
                        deliveryCost={deliveryCost}
                        discount={discount}
                    />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentPage;