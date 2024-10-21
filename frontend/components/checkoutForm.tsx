/* eslint-disable prettier/prettier */
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        // Simuler une requête de paiement sur votre backend (à implémenter côté serveur)
        const { error } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)!,
        });

        if (error) {
            Swal.fire("Erreur", error.message || "Erreur lors du paiement", "error");
        } else {
            Swal.fire("Succès", "Paiement réussi !", "success");
            // Rediriger ou mettre à jour l'interface après paiement
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="my-4">
                <CardElement />
            </div>
            <button
                className="w-full bg-violet-600 text-white font-bold py-2 px-4 rounded"
                disabled={!stripe || isProcessing}
                type="submit"
            >
                {isProcessing ? "Paiement en cours..." : "Payer"}
            </button>
        </form>
    );
}
