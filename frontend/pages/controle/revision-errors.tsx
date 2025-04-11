"use client";
import React, { useEffect } from "react";
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
  const [debugInfo, setDebugInfo] = React.useState<string>("");

  useEffect(() => {
    // Afficher les informations de débogage
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    setDebugInfo(`userId: ${userId ? "présent" : "absent"}, token: ${token ? "présent" : "absent"}`);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

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
        <div className="mb-4 text-xs text-gray-500">
          {debugInfo}
        </div>
        <div className="flex justify-center gap-4">
          <Button 
            color="primary" 
            onClick={() => router.push("/users/login")}
          >
            Se connecter
          </Button>
          <Button 
            color="secondary" 
            onClick={handleRefresh}
          >
            Rafraîchir
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          📚 Questions à Revoir
        </h1>
        <Button 
          size="sm" 
          color="secondary" 
          onClick={handleRefresh}
        >
          Rafraîchir
        </Button>
      </div>

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