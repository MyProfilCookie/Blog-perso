"use client";
import React, { useEffect, useState } from "react";
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Spinner } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Tabs } from '@nextui-org/react'
import { Tab } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { Divider } from '@nextui-org/react'
import { Tooltip } from '@nextui-org/react'
import {  } from '@nextui-org/react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [search, setSearch] = useState("");
  const [corrected, setCorrected] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Extraire toutes les catégories présentes dans les erreurs de l'utilisateur
  const categories = Array.from(
    new Set(userErrors.map((err) => err.category || "Autre")),
  );

  // Statistiques
  const stats = {
    total: userErrors.length,
    byCategory: categories.reduce(
      (acc, cat) => {
        acc[cat] = userErrors.filter((e) => e.category === cat).length;

        return acc;
      },
      {} as Record<string, number>,
    ),
    mostErrors: (() => {
      const sorted = categories
        .slice()
        .sort(
          (a, b) =>
            userErrors.filter((e) => e.category === b).length -
            userErrors.filter((e) => e.category === a).length,
        );

      return sorted[0] || "";
    })(),
  };

  // Filtrage dynamique par matière, recherche et erreurs non corrigées
  const filteredErrors = userErrors.filter((err) => {
    const matchCategory =
      selectedCategory === "Toutes" || err.category === selectedCategory;
    const matchSearch =
      err.questionText?.toLowerCase().includes(search.toLowerCase()) ||
      err.selectedAnswer?.toLowerCase().includes(search.toLowerCase()) ||
      err.correctAnswer?.toLowerCase().includes(search.toLowerCase());
    const notCorrected = !corrected.includes(err._id);

    return matchCategory && matchSearch && notCorrected;
  });

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
          <span className="text-blue-600 text-3xl">🔒</span>
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
            onClick={() => router.push("/users/login")}
          >
            Se connecter
          </Button>
          <Button className="px-6" color="secondary" onClick={handleRefresh}>
            Rafraîchir
          </Button>
          <Button className="px-6" variant="flat" onClick={handleGoBack}>
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
            className="text-lg"
            variant="light"
            onClick={handleGoBack}
          >
            <span>←</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📚 Questions à Revoir
            </h1>
            <p className="text-gray-500 mt-1">
              {filteredErrors.length} erreur
              {filteredErrors.length !== 1 ? "s" : ""} à réviser
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {/* Barre de recherche */}
          <input
            className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            placeholder="Rechercher une question, une réponse..."
            style={{ minWidth: 220 }}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button color="primary" variant="flat" onClick={handleRefresh}>
            Rafraîchir
          </Button>
        </div>
      </div>
      {/* Filtres par matière */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          color={selectedCategory === "Toutes" ? "primary" : "default"}
          size="sm"
          variant={selectedCategory === "Toutes" ? "solid" : "flat"}
          onClick={() => setSelectedCategory("Toutes")}
        >
          Toutes
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            color={selectedCategory === cat ? "primary" : "default"}
            size="sm"
            variant={selectedCategory === cat ? "solid" : "flat"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {errorMessage && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
        >
          <span className="text-red-500">⚠️</span>
          <p>{errorMessage}</p>
        </motion.div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">Total des erreurs</h3>
            <p className="text-3xl font-bold text-violet-600">{stats.total}</p>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">
              Matière la plus difficile
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xl">📚</span>
              <p className="text-xl font-bold">{stats.mostErrors}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">Erreurs par matière</h3>
            <ul className="text-sm">
              {Object.entries(stats.byCategory).map(([cat, count]) => (
                <li key={cat}>
                  {cat} : {count as number}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {errors.length === 0 ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-xl"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-green-500 text-2xl">✅</span>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Aucune erreur à réviser
          </p>
          <p className="text-gray-500 mt-2">
            Vous avez bien répondu à toutes les questions !
          </p>
          <div className="mt-6">
            <Button variant="flat" onClick={handleGoBack}>
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
            {filteredErrors.map((err: RevisionError, index) => (
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
                            <span className="text-blue-500">⚠️</span>
                          </div>
                          <div>
                            <p className="font-semibold text-lg">
                              {err.questionText}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {err.category && (
                                <Chip color="primary" size="sm" variant="flat">
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
                              <span className="text-red-500">❌</span>
                              <p className="font-medium text-red-700">
                                Ta réponse
                              </p>
                            </div>
                            <p className="text-red-600">{err.selectedAnswer}</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-green-500">✅</span>
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

                      <div className="flex justify-end gap-2">
                        <Tooltip
                          content={<span>Corriger (masquer cette erreur)</span>}
                        >
                          <Button
                            isIconOnly
                            color="success"
                            variant="light"
                            onClick={() =>
                              setCorrected([...corrected, err._id])
                            }
                            className="text-lg"
                          >
                            <span role="img" aria-label="Corrigé">✅</span>
                          </Button>
                        </Tooltip>
                        <Tooltip content={<span>Supprimer cette erreur</span>}>
                          <Button
                            isIconOnly
                            color="danger"
                            variant="light"
                            onClick={() => handleDeleteError(err._id)}
                            className="text-lg"
                          >
                            <span role="img" aria-label="Supprimer">🗑️</span>
                          </Button>
                        </Tooltip>
                      </div>

                      {/* Champ de note personnelle */}
                      <div className="mt-4">
                        <label htmlFor={`note-${err._id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note personnelle :</label>
                        <textarea
                          id={`note-${err._id}`}
                          className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={2}
                          placeholder="Ajoutez une remarque, une astuce, un rappel..."
                          value={notes[err._id] || ""}
                          onChange={e => setNotes({ ...notes, [err._id]: e.target.value })}
                        />
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
