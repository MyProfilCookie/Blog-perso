/* eslint-disable prettier/prettier */
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
                title: "Erreur",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK",
            });
        } else {
            Swal.fire({
                title: "Paiement réussi",
                text: "Votre paiement a été accepté.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                router.push("/confirmation");
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="flex items-center" htmlFor="card-element">
                    <FontAwesomeIcon className="mr-2 text-blue-600" icon={faCreditCard} />
                    <span>Carte bancaire</span>
                </label>
                <CardElement className="p-4 border rounded" id="card-element" />
            </div>
            <Button
                className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
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
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [parcelWeight, setParcelWeight] = useState(1);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState("Mondial Relay");
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
    const router = useRouter();

    // Options de transporteurs
    const deliveryOptions = [
        { label: "Mondial Relay", baseCost: 2 },
        { label: "La Poste", baseCost: 2 + 2 },
        { label: "Chronopost", baseCost: 2 + 3 },
    ];

    // Calcul du coût de la livraison en fonction du poids et du transporteur sélectionné
    const calculateDeliveryCost = (weight: number, method: string) => {
        let baseCost = 0;

        if (weight <= 2) {
            baseCost = deliveryOptions.find(option => option.label === method)?.baseCost || 0;
        } else if (weight > 2 && weight <= 5) {
            baseCost = (deliveryOptions.find(option => option.label === method)?.baseCost || 0) + 2;
        } else if (weight > 5 && weight <= 10) {
            baseCost = (deliveryOptions.find(option => option.label === method)?.baseCost || 0) + 4;
        }

        return { cost: baseCost, label: method };
    };

    // Calcul de la date de livraison estimée (J+4)
    const calculateDeliveryDate = () => {
        const today = new Date();

        today.setDate(today.getDate() + 4);

        return today.toLocaleDateString('fr-FR');
    };

    // Charger le panier depuis le localStorage et calculer le poids total
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");

        if (storedCart) {
            const cartItems = JSON.parse(storedCart);
            const totalAmount = cartItems.reduce((total: number, item: any) => total + item.price, 0);
            const totalWeight = cartItems.reduce((total: number, item: any) => total + (item.weight || 0), 0);

            setTotal(totalAmount.toFixed(2));
            setParcelWeight(totalWeight);

            const deliveryData = calculateDeliveryCost(totalWeight, deliveryMethod);

            setDeliveryCost(deliveryData.cost);
            setEstimatedDeliveryDate(calculateDeliveryDate());
        }
    }, [deliveryMethod]);

    // Gestion de la sélection du transporteur
    const handleTransporterChange = (event: any) => {
        const selectedMethod = event.target.value;

        setDeliveryMethod(selectedMethod);
        const deliveryData = calculateDeliveryCost(parcelWeight, selectedMethod);

        setDeliveryCost(deliveryData.cost);
    };

    return (
        <div className="container mx-auto my-12">
            <motion.h1
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-center mb-8 text-blue-800"
                initial={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
            >
                MyProfilCookie, votre paiement
            </motion.h1>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="border rounded-lg p-8 shadow-lg bg-white"
                initial={{ opacity: 0, scale: 0.8 }}
                style={{ maxWidth: '400px', margin: '0 auto', borderColor: '#ccc' }}
                transition={{ duration: 0.8 }}
            >
                <h3 className="text-lg mb-4 font-semibold text-gray-700">Total du panier : {total} €</h3>
                <hr className="mb-4" />
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">Total à payer : {(Number(total) + deliveryCost).toFixed(2)} €</h2>
                <p className="text-lg mb-4 font-semibold text-gray-600">Coût de livraison : {deliveryCost} €</p>
                <p className="text-lg mb-4 text-gray-500">Estimation de la réception : {estimatedDeliveryDate}</p>

                {/* Adresse */}
                <div className="mb-4 flex items-center">
                    <FontAwesomeIcon className="mr-2 text-blue-600" icon={faHome} />
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
                    <FontAwesomeIcon className="mr-2 text-blue-600" icon={faPhone} />
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
                    <FontAwesomeIcon className="mr-2 text-blue-600" icon={faTruck} />
                    <label className="mb-2 font-semibold" htmlFor="transporteur">
                        Choisir un transporteur
                    </label>
                    <select
                        className="w-full p-3 border rounded-md ml-2"
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
                    <CheckoutForm totalAmount={parseFloat((Number(total) + deliveryCost).toFixed(2))} />
                </Elements>
            </motion.div>
        </div>
    );
}













