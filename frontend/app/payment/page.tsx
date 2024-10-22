/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button, Input } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPhone, faTruck, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import { Logo } from "@/components/icons";

// Charger la clé publique Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Composant pour gérer le paiement avec Stripe
const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            Swal.fire({
                title: "Oh non!",
                text: error.message,
                icon: "error",
                confirmButtonText: "Réessayer",
            });
        } else {
            Swal.fire({
                title: "Paiement réussi",
                text: "Merci pour votre confiance !",
                icon: "success",
                confirmButtonText: "Super !",
            }).then(() => {
                router.push("/confirmation");
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="flex items-center text-lg font-bold text-green-600" htmlFor="card-element">
                    <FontAwesomeIcon className="mr-2 text-green-600 hidden md:inline-block" icon={faCreditCard} />
                    <span>Carte bancaire</span>
                </label>
                <CardElement className="p-4 border rounded-lg border-green-200 shadow-lg" id="card-element" />
            </div>
            <Button
                className="w-full mt-4 bg-green-500 text-white hover:bg-green-600 rounded-full shadow-lg text-lg"
                disabled={!stripe}
                type="submit"
            >
                Payer {totalAmount} €
            </Button>
        </form>
    );
};

export default function PaymentPage() {
    const [total, setTotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [deliveryMethod, setDeliveryMethod] = useState("Mondial Relay");
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
    const [totalToPay, setTotalToPay] = useState(0);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    const deliveryOptions = [
        { label: "Mondial Relay", cost: 2 },
        { label: "La Poste", cost: 4 },
        { label: "Chronopost", cost: 5 },
    ];

    const calculateDeliveryCost = (weight: number, method: string) => {
        let baseCost = 0;

        if (weight <= 2) {
            baseCost = method === "La Poste" ? 4 : method === "Chronopost" ? 5 : 2;
        } else if (weight > 2 && weight <= 5) {
            baseCost = method === "La Poste" ? 6 : method === "Chronopost" ? 7 : 4;
        } else if (weight > 5 && weight <= 10) {
            baseCost = method === "La Poste" ? 8 : method === "Chronopost" ? 9 : 6;
        }

        return baseCost;
    };

    // Récupérer les données du panier
    useEffect(() => {
        const storedTotalPrice = localStorage.getItem("totalPrice");
        const storedParcelWeight = localStorage.getItem("parcelWeight");
        const storedCartItems = localStorage.getItem("cartItems");

        if (storedTotalPrice && storedParcelWeight && storedCartItems) {
            const totalWeight = parseFloat(storedParcelWeight);
            const totalAmount = parseFloat(storedTotalPrice);

            setTotal(parseFloat(totalAmount.toFixed(2)));

            const deliveryCost = calculateDeliveryCost(totalWeight, deliveryMethod);

            setDeliveryCost(deliveryCost);

            const totalToPay = totalAmount + deliveryCost;

            setTotalToPay(parseFloat(totalToPay.toFixed(2)));

            const today = new Date();

            today.setDate(today.getDate() + 4);
            setEstimatedDeliveryDate(today.toLocaleDateString("fr-FR"));

            setCartItems(JSON.parse(storedCartItems));
        }
    }, [deliveryMethod]);

    const handleTransporterChange = (event: any) => {
        const selectedMethod = event.target.value;

        setDeliveryMethod(selectedMethod);
    };

    return (
        <div className="container mx-auto my-12">
            <motion.h1
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-center mb-8 text-blue-800"
                initial={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
            >
                <Logo className="w-32 mx-auto" />
                <p className="text-3xl font-semibold mb-4 text-green-600">Bonjour MyProfilCookie,</p>
                <p className="text-lg mb-4 text-gray-500">Voici votre panier, merci pour votre confiance !</p>
            </motion.h1>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-8 shadow-lg bg-white"
                initial={{ opacity: 0, scale: 0.8 }}
                style={{ maxWidth: '500px', margin: '0 auto', borderColor: '#c0e4cc' }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-green-600">Total à payer : {totalToPay} €</h2>
                <hr className="mb-4 border-dashed border-gray-300" />
                <p className="text-lg mb-4 font-semibold text-blue-500">Total du panier : {total} €</p>
                <p className="text-lg mb-4 font-semibold text-blue-500">Nombre d&apos;articles : {cartItems.length}</p>
                <p className="text-lg mb-4 font-semibold text-blue-500">Coût de livraison : {deliveryCost} €</p>
                <hr className="mb-4 border-dashed border-gray-300" />
                <p className="text-lg mb-4 text-gray-500">Estimation de la réception : {estimatedDeliveryDate}</p>
                <hr className="mb-4 border-dashed border-gray-300" />

                {/* Adresse */}
                <div className="mb-4 flex items-center">
                    <FontAwesomeIcon className="mr-2 text-green-600 hidden md:inline-block" icon={faHome} />
                    <Input
                        fullWidth
                        label="Adresse de livraison"
                        placeholder="Entrez votre adresse"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                {/* Numéro de téléphone */}
                <div className="mb-4 flex items-center">
                    <FontAwesomeIcon className="mr-2 text-green-600 hidden md:inline-block" icon={faPhone} />
                    <Input
                        fullWidth
                        label="Numéro de téléphone"
                        placeholder="Entrez votre numéro de téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                {/* Transporteur */}
                <div className="mb-6 flex items-center">
                    <FontAwesomeIcon className="mr-2 text-green-600 hidden md:inline-block" icon={faTruck} />
                    <label className="mb-2 font-semibold hidden md:inline-block" htmlFor="transporteur">
                        Choisir un transporteur
                    </label>
                    <select
                        className="w-full p-3 border rounded-md md:ml-2 bg-green-50"
                        id="transporteur"
                        value={deliveryMethod}
                        onChange={handleTransporterChange}
                    >
                        {deliveryOptions.map((option) => (
                            <option key={option.label} value={option.label}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Formulaire Stripe */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalToPay} />
                </Elements>
            </motion.div>
        </div>
    );
}




















