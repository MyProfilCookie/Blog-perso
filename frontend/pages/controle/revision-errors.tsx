"use client";
import React from "react";
import { Card, CardBody, Spinner, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { RevisionProvider, useRevision } from "../../contexts/RevisionContext";
import { useRouter } from "next/navigation";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
}

const RevisionContent: React.FC = () => {
  const { errors, isLoading, isAuthenticated } = useRevision();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        className="max-w-4xl mx-auto p-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-bold mb-6">
          🔒 Connexion requise
        </h1>
        <p className="mb-6 text-gray-600">
          Vous devez être connecté pour accéder à vos erreurs de révision.
        </p>
        <Button 
          color="primary" 
          onClick={() => router.push("/users/login")}
        >
          Se connecter
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        📚 Questions à Revoir
      </h1>

      {errors.length === 0 ? (
        <p className="text-center text-gray-600">Aucune erreur à réviser.</p>
      ) : (
        <div className="space-y-6">
          {errors.map((err: RevisionError) => (
            <Card key={err._id}>
              <CardBody className="space-y-2">
                <p className="font-semibold">{err.questionText}</p>
                <p className="text-sm text-red-600">
                  ❌ Ta réponse : {err.selectedAnswer}
                </p>
                <p className="text-sm text-green-600">
                  ✅ Bonne réponse : {err.correctAnswer}
                </p>
                <p className="text-xs text-gray-400">
                  📅 {new Date(err.date).toLocaleDateString()}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const RevisionPage: React.FC = () => {
  return (
    <RevisionProvider>
      <RevisionContent />
    </RevisionProvider>
  );
};

export default RevisionPage; 