"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

import { AutismLogo } from "@/components/icons";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [success, setSuccess] = useState(false);

  // Vérifier qu'on a bien un token
  useEffect(() => {
    if (!token || !email) {
      Swal.fire({
        icon: "error",
        title: "Lien invalide",
        text: "Ce lien de réinitialisation est invalide ou incomplet.",
        confirmButtonText: "Demander un nouveau lien",
      }).then(() => {
        router.push("/forgot-password");
      });
    }
  }, [token, email, router]);

  const validatePassword = (value: string) => {
    const lengthValid = value.length >= 8;
    const specialCharValid = /[!@#$%^&*]/.test(value);

    if (!lengthValid || !specialCharValid) {
      setPasswordStrength(
        "Mot de passe faible (8 caractères minimum + un caractère spécial)"
      );
    } else {
      setPasswordStrength("Mot de passe fort ✓");
    }
  };

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit contenir au moins 8 caractères.",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Les mots de passe ne correspondent pas.",
        confirmButtonText: "Ok",
      });
      return;
    }

    setLoading(true);

    try {
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
      ).replace(/\/$/, "");

      const response = await axios.post(`${apiUrl}/users/reset-password`, {
        token,
        email,
        newPassword,
      });

      setSuccess(true);
      Swal.fire({
        icon: "success",
        title: "Mot de passe réinitialisé !",
        text: response.data.message,
        confirmButtonText: "Se connecter",
      }).then(() => {
        router.push("/users/login");
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Une erreur est survenue. Veuillez réessayer.";
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: message,
        confirmButtonText: "Ok",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-6 p-8 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
              Mot de passe réinitialisé !
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Votre mot de passe a été modifié avec succès.
            </p>
          </div>

          <Button
            color="primary"
            onClick={() => router.push("/users/login")}
            className="w-full"
            size="lg"
          >
            Se connecter
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AutismLogo size={48} />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
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
            Nouveau mot de passe
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Créez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              📧 Pour : <strong>{email}</strong>
            </p>
          </div>

          <Input
            required
            label="Nouveau mot de passe"
            placeholder="8 caractères min. + caractère spécial"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePassword(e.target.value);
            }}
            className="w-full"
            classNames={{
              input: "text-gray-900 dark:text-white",
              inputWrapper: "bg-white dark:bg-slate-900",
              label: "text-gray-700 dark:text-gray-300",
            }}
          />
          {newPassword && (
            <p
              className={`text-xs ${
                passwordStrength.includes("faible")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {passwordStrength}
            </p>
          )}

          <Input
            required
            label="Confirmer le mot de passe"
            placeholder="Retapez votre nouveau mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
            classNames={{
              input: "text-gray-900 dark:text-white",
              inputWrapper: "bg-white dark:bg-slate-900",
              label: "text-gray-700 dark:text-gray-300",
            }}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500">
              Les mots de passe ne correspondent pas
            </p>
          )}
          {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
            <p className="text-xs text-green-500">
              ✓ Les mots de passe correspondent
            </p>
          )}

          <Button
            className="w-full"
            color="primary"
            isLoading={loading}
            onClick={handleSubmit}
            size="lg"
            isDisabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            {loading ? "Réinitialisation..." : "Réinitialiser mon mot de passe"}
          </Button>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/users/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Annuler et retourner à la connexion
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
