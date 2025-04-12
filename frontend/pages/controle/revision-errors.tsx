"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaTrash,
  FaSync,
  FaSignInAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
  FaArrowLeft,
} from "react-icons/fa";

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

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <Spinner color="primary" size="lg" />
        <p className="mt-4 text-gray-500">
          Chargement des erreurs de révision...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <FaSignInAlt className="text-blue-600 text-3xl" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          🔒 Connexion requise
        </h1>
        <p className="mb-6 text-gray-600 max-w-md mx-auto">
          Vous devez être connecté pour accéder à vos erreurs de révision.
        </p>
        <div className="mb-6 p-3 bg-gray-100 rounded-md text-xs text-gray-500 max-w-md mx-auto">
          {debugInfo}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            className="px-6"
            color="primary"
            startContent={<FaSignInAlt />}
            onClick={() => router.push("/users/login")}
          >
            Se connecter
          </Button>
          <Button
            className="px-6"
            color="secondary"
            startContent={<FaSync />}
            onClick={handleRefresh}
          >
            Rafraîchir
          </Button>
          <Button
            variant="flat"
            onClick={handleGoBack}
            className="px-6"
            startContent={<FaArrowLeft />}
          >
            Retour
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
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onClick={handleGoBack}
            className="text-lg"
          >
            <FaArrowLeft />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📚 Questions à Revoir
            </h1>
            <p className="text-gray-500 mt-1">
              {userErrors.length} erreur{userErrors.length !== 1 ? "s" : ""} à
              réviser
            </p>
          </div>
        </div>
        <Button
          color="primary"
          variant="flat"
          onClick={handleRefresh}
          startContent={<FaSync />}
        >
          Rafraîchir
        </Button>
      </div>

      {errorMessage && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
        >
          <FaExclamationTriangle className="text-red-500" />
          <p>{errorMessage}</p>
        </motion.div>
      )}

      {errors.length === 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-xl"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Aucune erreur à réviser
          </p>
          <p className="text-gray-500 mt-2">
            Vous avez bien répondu à toutes les questions !
          </p>
          <div className="mt-6">
            <Button
              variant="flat"
              onClick={handleGoBack}
              startContent={<FaArrowLeft />}
            >
              Retour
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {userIds.length > 1 && (
            <div className="mb-6 bg-white p-2 rounded-lg shadow-sm">
              <Tabs
                aria-label="Sélection d'utilisateur"
                classNames={{
                  tabList: "gap-6",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
                selectedKey={selectedUserId || ""}
                variant="underlined"
                onSelectionChange={(key) => handleUserChange(key as string)}
              >
                {userIds.map((userId) => (
                  <Tab
                    key={userId}
                    title={
                      <div className="flex items-center space-x-2">
                        <span>Utilisateur</span>
                        <Chip color="primary" size="sm" variant="flat">
                          {userId.substring(0, 6)}...
                        </Chip>
                      </div>
                    }
                  />
                ))}
              </Tabs>
            </div>
          )}

          <div className="space-y-6">
            {userErrors.map((err: RevisionError, index) => (
              <motion.div
                key={err._id}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardBody className="p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <FaExclamationTriangle className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">
                              {err.questionText}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {err.category && (
                                <Chip
                                  color="primary"
                                  size="sm"
                                  startContent={<FaTag className="text-xs" />}
                                  variant="flat"
                                >
                                  {err.category}
                                </Chip>
                              )}
                              <Chip color="default" size="sm" variant="flat">
                                {new Date(err.date).toLocaleDateString()}
                              </Chip>
                            </div>
                          </div>
                        </div>

                        <Divider className="my-3" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-red-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <FaTimesCircle className="text-red-500" />
                              <p className="font-medium text-red-700">
                                Ta réponse
                              </p>
                            </div>
                            <p className="text-red-600">{err.selectedAnswer}</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <FaCheckCircle className="text-green-500" />
                              <p className="font-medium text-green-700">
                                Bonne réponse
                              </p>
                            </div>
                            <p className="text-green-600">
                              {err.correctAnswer}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Tooltip content="Supprimer cette erreur">
                          <Button
                            isIconOnly
                            className="text-lg"
                            color="danger"
                            variant="light"
                            onClick={() => handleDeleteError(err._id)}
                          >
                            <FaTrash />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
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
