/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import { Logo } from "@/components/icons";
import Loading from "@/components/loading";

export default function PaymentConfirmationPage() {
    const [userName, setUserName] = useState<string>("Utilisateur");
    const [firstName, setFirstName] = useState<string>("Prénom inconnu");
    const [lastName, setLastName] = useState<string>("Nom inconnu");
    const [phone, setPhone] = useState<string>("Numéro inconnu");
    const [transactionId, setTransactionId] = useState<string>("ID de transaction inconnu");
    const [deliveryAddress, setDeliveryAddress] = useState<string>("Adresse non fournie");
    const [totalPaid, setTotalPaid] = useState<number | null>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedFirstName = localStorage.getItem("firstName");
        const storedLastName = localStorage.getItem("lastName");
        const storedPhone = localStorage.getItem("phone");
        const storedAddress = localStorage.getItem("deliveryAddress");
        const storedTotalPaid = localStorage.getItem("totalPrice");
        const storedTransactionId = localStorage.getItem("transactionId");
        const storedCartItems = localStorage.getItem("cartItems");

        if (storedFirstName && storedLastName && storedPhone && storedAddress && storedTotalPaid && storedTransactionId && storedCartItems) {
            setFirstName(storedFirstName);
            setLastName(storedLastName);
            setPhone(storedPhone);
            setDeliveryAddress(storedAddress);
            setTransactionId(storedTransactionId);
            setTotalPaid(parseFloat(storedTotalPaid));
            setCartItems(JSON.parse(storedCartItems));
            setLoading(false);
        } else {
            console.warn("Données manquantes, redirection vers l'accueil.");
            router.push("/");
        }
    }, [router]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto my-12 dark:bg-gray-900">
            <motion.h1 animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-8 text-blue-800 dark:text-blue-200" initial={{ opacity: 0, y: -50 }} transition={{ duration: 0.8 }}>
                <Logo className="w-32 mx-auto" />
                <p className="text-3xl font-semibold mb-4 text-green-600 dark:text-green-400">Confirmation de paiement</p>
            </motion.h1>

            <motion.div animate={{ opacity: 1, scale: 1 }} className="border rounded-lg p-8 shadow-lg bg-white dark:bg-gray-800" initial={{ opacity: 0, scale: 0.8 }} style={{ maxWidth: "600px", margin: "0 auto", borderColor: "#c0e4cc" }} transition={{ duration: 0.8 }}>
                <div className="text-center">
                    <FontAwesomeIcon className="text-green-600 text-6xl mb-4" icon={faCheckCircle} />
                    <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Paiement réussi !</h2>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Merci pour votre achat, <span className="font-bold">{userName}</span> !</p>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Prénom: <span className="font-bold">{firstName}</span></p>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Nom: <span className="font-bold">{lastName}</span></p>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Numéro de téléphone: <span className="font-bold">{phone}</span></p>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Votre commande sera expédiée à l&apos;adresse suivante :</p>
                    <p className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4">{deliveryAddress}</p>
                    <p className="text-lg mb-4 text-gray-500 dark:text-gray-300">Numéro de transaction : <span className="font-bold">{transactionId}</span></p>
                    <p className="text-lg font-semibold text-blue-500 dark:text-blue-300 mb-4">Montant total payé : {totalPaid?.toFixed(2)} €</p>
                    <Button className="w-full mt-4 bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 rounded-full shadow-lg text-lg" onClick={() => router.push("/")}>Retour à l&apos;accueil</Button>
                </div>
            </motion.div>
        </div>
    );
}







