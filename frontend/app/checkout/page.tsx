/* eslint-disable prettier/prettier */
"use client";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "@/components/checkoutForm";

// Charger Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
    useEffect(() => {
        if (!localStorage.getItem("userToken")) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
            window.location.href = "/login";
        }
    }, []);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen py-8">
            <div className="w-full max-w-lg p-6 bg-cream shadow-md rounded-md">
                <h1 className="text-3xl font-bold text-center">Paiement sécurisé</h1>

                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </section>
    );
}
