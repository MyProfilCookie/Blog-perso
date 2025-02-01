/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Input, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ContactForm = () => {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [pseudo, setPseudo] = useState(""); // Pseudo récupéré
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Gérer l'affichage du composant

    // Récupérer le pseudo, email et nom depuis localStorage si l'utilisateur est connecté
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setPseudo(user.pseudo || ""); // Mettre le pseudo s'il existe
                setEmail(user.email || ""); // Mettre l'email s'il existe
                setNom(user.nom || ""); // Mettre le nom s'il existe
            } catch (error) {
                console.error("❌ Erreur de parsing du localStorage :", error);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérifier que tous les champs sont remplis
        if (!nom.trim() || !email.trim() || !message.trim() || !pseudo.trim()) {
            Swal.fire({
                title: "Erreur",
                text: "Tous les champs sont requis.",
                icon: "error",
                confirmButtonText: "OK",
            });

            return;
        }

        setLoading(true);

        const formData = { nom, email, message, pseudo };

        try {
            const response = await fetch("http://localhost:3001/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erreur lors de l'envoi du message.");
            }

            // Afficher un message de succès avec ID du message
            Swal.fire({
                title: "Message envoyé",
                html: `
                    <p>Votre message a bien été envoyé ! 📩</p>
                    <p><strong>ID du message :</strong> <span style="color:blue;">${result.id}</span></p>
                    <p>Un administrateur vous répondra sous 48h. ⏳</p>
                `,
                icon: "success",
                confirmButtonText: "OK",
            });

            // Réinitialiser le formulaire
            setNom("");
            setEmail("");
            setMessage("");

            // Masquer le formulaire pendant 3 minutes (180000 ms)
            setIsVisible(false);
            setTimeout(() => {
                setIsVisible(true);
            }, 180000); // 3 minutes en millisecondes

        } catch (error: any) {
            console.error("❌ Erreur lors de l'envoi du message :", error.message);
            Swal.fire({
                title: "Erreur",
                text: error.message || "Une erreur est survenue.",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setLoading(false);
        }
    };

    return isVisible ? (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-12 w-full max-w-lg mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 2 }}
        >
            <Card className="p-10 rounded-lg">
                <CardBody className="p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">
                        Envoyez-nous un message
                    </h2>
                    <p className="text-gray-600 text-center mb-4">
                        Nous vous répondrons sous 48h ⏳.
                    </p>
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        <Input
                            fullWidth
                            isClearable
                            aria-label="Nom"
                            color="default"
                            placeholder="Votre nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                        />
                        <Input
                            fullWidth
                            isReadOnly // Empêche la modification du pseudo récupéré
                            aria-label="Pseudo"
                            color="default"
                            placeholder="Votre pseudo"
                            value={pseudo}
                        />
                        <Input
                            fullWidth
                            isClearable
                            aria-label="Email"
                            color="default"
                            placeholder="Votre email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Textarea
                            fullWidth
                            aria-label="Message"
                            color="default"
                            placeholder="Votre message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            className="w-full mt-4 text-white bg-purple-600 hover:bg-purple-700"
                            isDisabled={loading}
                            type="submit"
                        >
                            {loading ? "Envoi en cours..." : "Envoyer votre message"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </motion.div>
    ) : (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-12 w-full max-w-lg mx-auto p-6 text-center bg-gray-100 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-lg font-bold text-gray-700">
                Merci pour votre message ! 📩
            </h2>
            <p className="text-gray-600 mt-2">
                Vous pourrez envoyer un autre message dans <strong>3 minutes</strong>.
            </p>
        </motion.div>
    );
};

export default ContactForm;