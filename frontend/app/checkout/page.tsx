/* eslint-disable prettier/prettier */
"use client";
import { useEffect } from "react";
import { StripeProvider } from "@/components/StripeProvider";

import CheckoutForm from "@/components/checkoutForm";

// Récupérer la clé Stripe
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

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

            {stripeKey && (
                <StripeProvider stripeKey={stripeKey}>
                    <CheckoutForm />
                </StripeProvider>
            )}
            {!stripeKey && (
                <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
                    <p className="text-red-800">Erreur : Configuration Stripe manquante.</p>
                </div>
            )}
            </div>
        </section>
    );
}
