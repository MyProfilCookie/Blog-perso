/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia",
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === "POST") {
        const { name, surname, totalAmount } = req.body;

        try {
            // Créer une session de paiement Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: `Commande pour ${name} ${surname}`,
                            },
                            unit_amount: Math.round(totalAmount * 100), // Convertir en centimes
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/cancel`,
            });

            res.status(200).json({ id: session.id });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Une erreur inconnue s'est produite" });
            }
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}
