"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

import { AutismLogo } from "@/components/icons";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";
  
  const [email, setEmail] = useState(emailFromParams);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez entrer une adresse email valide.",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      await axios.post(`${apiUrl}/users/forgot-password`, { email });

      setEmailSent(true);
      Swal.fire({
        icon: "success",
        title: "Email envoyé !",
        html: `<p>Si un compte existe avec l'adresse <strong>${email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.</p>`,
        confirmButtonText: "Ok",
      });
    } catch (error: any) {
      // On affiche toujours un message de succès pour des raisons de sécurité
      // (ne pas révéler si l'email existe ou non)
      setEmailSent(true);
      Swal.fire({
        icon: "success",
        title: "Email envoyé !",
        html: `<p>Si un compte existe avec l'adresse <strong>${email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.</p>`,
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-6 p-8 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
              Vérifiez votre boîte mail
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Si un compte existe avec l'adresse <strong>{email}</strong>, 
              vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              N'oubliez pas de vérifier vos spams !
            </p>
          </div>

          <div className="space-y-3">
            <Button
              color="primary"
              variant="light"
              onClick={() => setEmailSent(false)}
              className="w-full"
            >
              Renvoyer l'email
            </Button>
            <Button
              color="secondary"
              variant="flat"
              onClick={() => router.push("/users/login")}
              className="w-full"
            >
              Retour à la connexion
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <AutismLogo className="mx-auto mb-4" size={48} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Pas de panique ! Entrez votre adresse email et nous vous enverrons 
            un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            required
            label="Adresse email"
            placeholder="exemple@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            classNames={{
              input: "text-gray-900 dark:text-white",
              inputWrapper: "bg-white dark:bg-slate-900",
              label: "text-gray-700 dark:text-gray-300",
            }}
          />

          <Button
            className="w-full"
            color="primary"
            isLoading={loading}
            onClick={handleSubmit}
            size="lg"
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </Button>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Vous vous souvenez de votre mot de passe ?
            </p>
            <Link
              href="/users/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
