/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button, Input } from "@nextui-org/react";
import { loadStripe } from "@stripe/stripe-js";

// Charger la clé publique Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentPage() {
    const [total, setTotal] = useState(0);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [address, setAddress] = useState("");
    const [parcelWeight, setParcelWeight] = useState(1); // Simuler le poids du colis en kg
    const [deliveryOption, setDeliveryOption] = useState(""); // Pour le relais colis
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();

    const deliveryOptions = [
        { label: "Relais 1 - Max 2 kg", value: "relais1", maxWeight: 2 },
        { label: "Relais 2 - Max 5 kg", value: "relais2", maxWeight: 5 },
        { label: "Relais 3 - Max 10 kg", value: "relais3", maxWeight: 10 },
    ];

    // Charger le total depuis le localStorage ou via une API
    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");

        if (storedCart) {
            const cartItems = JSON.parse(storedCart);
            const totalAmount = cartItems.reduce((total: number, item: any) => total + item.price, 0);
            const totalWeight = cartItems.reduce((total: number, item: any) => total + item.weight, 0); // Simuler le poids

            setTotal(totalAmount.toFixed(2));
            setParcelWeight(totalWeight); // Stocker le poids total du colis
        }
    }, []);

    // Filtrer les options de relais colis en fonction du poids du colis
    const filteredDeliveryOptions = deliveryOptions.filter(option => parcelWeight <= option.maxWeight);

    const handlePayment = async () => {
        if (!name || !surname || !address || !deliveryOption) {
            Swal.fire({
                title: "Erreur",
                text: "Veuillez remplir toutes les informations requises.",
                icon: "error",
                confirmButtonText: "OK",
            });

            return;
        }

        const stripe = await stripePromise;

        if (!stripe) {
            Swal.fire({
                title: "Erreur",
                text: "Problème de configuration Stripe.",
                icon: "error",
                confirmButtonText: "OK",
            });

            return;
        }

        // Vous devrez configurer un backend qui génère un sessionId pour Stripe Checkout
        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                surname,
                address,
                deliveryOption,
                totalAmount: total,
            }),
        });

        const session = await response.json();

        // Redirection vers la page de paiement Stripe
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            Swal.fire({
                title: "Erreur",
                text: result.error.message,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="container mx-auto my-12">
            <h1 className="text-4xl font-bold text-center mb-8">Page de paiement</h1>

            <div className="border rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Total à payer : {total} €</h2>

                {/* Nom et prénom */}
                <Input
                    fullWidth
                    className="mb-4"
                    label="Prénom"
                    placeholder="Entrez votre prénom"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
                <Input
                    fullWidth
                    className="mb-4"
                    label="Nom"
                    placeholder="Entrez votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {/* Adresse */}
                <Input
                    fullWidth
                    className="mb-4"
                    label="Adresse de livraison"
                    placeholder="Entrez votre adresse complète"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                {/* Relais colis */}
                <label className="mb-2 font-semibold">Choisir un relais colis</label>
                <select
                    className="w-full mb-4 p-2 border rounded-md"
                    value={deliveryOption}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                >
                    <option value="">Sélectionner un relais colis</option>
                    {filteredDeliveryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Bouton de paiement */}
                <Button
                    className="w-full mt-8"
                    color="primary"
                    onPress={handlePayment}
                >
                    Procéder au paiement
                </Button>
            </div>
        </div>
    );
}

