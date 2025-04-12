"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Spinner, Button, Tabs, Tab } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { RevisionProvider, useRevision } from "../../contexts/RevisionContext";

// Utiliser le type any pour éviter les erreurs de linter
type RevisionError = any;

const RevisionContent: React.FC = () => {
  const { errors, isLoading, isAuthenticated, errorMessage, removeError } =
    useRevision();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = React.useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userErrors, setUserErrors] = useState<RevisionError[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    // Afficher les informations de débogage
    const userToken = localStorage.getItem("userToken");
    const userInfo = localStorage.getItem("user");

    let userId = "non trouvé";

    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);

        userId = parsedUserInfo._id || parsedUserInfo.id || "non trouvé";
      } catch (e) {
        userId = "erreur de parsing";
      }
    }

    setDebugInfo(
      `userToken: ${userToken ? "présent" : "absent"}, userId: ${userId}`,
    );
  }, []);

  // Extraire les IDs utilisateurs uniques des erreurs
  useEffect(() => {
    if (errors.length > 0) {
      // Utiliser Array.from pour éviter les problèmes de compatibilité avec Set
      const uniqueUserIds = Array.from(
        new Set(errors.map((error) => error.userId || "unknown")),
      );

      setUserIds(uniqueUserIds);

      // Sélectionner le premier utilisateur par défaut
      if (uniqueUserIds.length > 0 && !selectedUserId) {
        setSelectedUserId(uniqueUserIds[0]);
      }
    }
  }, [errors, selectedUserId]);

  // Filtrer les erreurs par utilisateur sélectionné
  useEffect(() => {
    if (selectedUserId) {
      const filteredErrors = errors.filter(
        (error) => error.userId === selectedUserId,
      );

      setUserErrors(filteredErrors);
    } else {
      setUserErrors([]);
    }
  }, [selectedUserId, errors]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDeleteError = (id: string) => {
    removeError(id);
  };

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto p-6 text-center"
        initial={{ opacity: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6">🔒 Connexion requise</h1>
        <p className="mb-6 text-gray-600">
          Vous devez être connecté pour accéder à vos erreurs de révision.
        </p>
        <div className="mb-4 text-xs text-gray-500">{debugInfo}</div>
        <div className="flex justify-center gap-4">
          <Button color="primary" onClick={() => router.push("/users/login")}>
            Se connecter
          </Button>
          <Button color="secondary" onClick={handleRefresh}>
            Rafraîchir
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Questions à Revoir</h1>
        <Button color="secondary" size="sm" onClick={handleRefresh}>
          Rafraîchir
        </Button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}

      {errors.length === 0 ? (
        <p className="text-center text-gray-600">Aucune erreur à réviser.</p>
      ) : (
        <>
          {userIds.length > 1 && (
            <div className="mb-6">
              <Tabs
                aria-label="Sélection d'utilisateur"
                selectedKey={selectedUserId || ""}
                onSelectionChange={(key) => handleUserChange(key as string)}
              >
                {userIds.map((userId) => (
                  <Tab
                    key={userId}
                    title={`Utilisateur ${userId.substring(0, 6)}...`}
                  />
                ))}
              </Tabs>
            </div>
          )}

          <div className="space-y-6">
            {userErrors.map((err: RevisionError) => (
              <Card key={err._id} className="relative">
                <CardBody className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">{err.questionText}</p>
                      <p className="text-sm text-red-600">
                        ❌ Ta réponse : {err.selectedAnswer}
                      </p>
                      <p className="text-sm text-green-600">
                        ✅ Bonne réponse : {err.correctAnswer}
                      </p>
                      {err.category && (
                        <p className="text-xs text-blue-600">
                          📑 Catégorie : {err.category}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        📅 {new Date(err.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      color="danger"
                      size="sm"
                      variant="light"
                      onClick={() => handleDeleteError(err._id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
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
