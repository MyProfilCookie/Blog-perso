/* eslint-disable no-console */
"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@nextui-org/react";
import { CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import { Tabs } from "@nextui-org/react";
import { Tab } from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { LightAnimation } from "@/components/DynamicMotion";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  category: string;
  date: string;
  questionId?: string;
}

const RevisionPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<RevisionError[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchErrors();
  }, [currentPage, selectedCategory]);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      if (!token) {
        throw new Error("Token d&apos;authentification non trouvé");
      }

      // Récupérer l'ID utilisateur depuis l'objet user stocké
      const userData = localStorage.getItem("user");
      let userId = null;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user._id;
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur:", e);
        }
      }

      if (!userId) {
        throw new Error("ID utilisateur non trouvé");
      }
      
      console.log("🔍 ID utilisateur trouvé:", userId);

      const url =
        selectedCategory === "all"
          ? `${process.env.NEXT_PUBLIC_API_URL}/revision-errors?userId=${userId}&page=${currentPage}&limit=10`
          : `${process.env.NEXT_PUBLIC_API_URL}/revision-errors?userId=${userId}&category=${selectedCategory}&page=${currentPage}&limit=10`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setErrors(response.data.errors || []);
      setTotalPages(response.data.totalPages || 1);

      // Extraire les catégories uniques
      if (response.data.categories) {
        setCategories(["all", ...response.data.categories]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des erreurs:", err);
      setError("Erreur lors du chargement des erreurs de révision");
      setLoading(false);
    }
  };

  const handleDeleteError = async (errorId: string) => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/revision-errors/${errorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Rafraîchir la liste
      fetchErrors();
    } catch (err) {
      console.error("Erreur lors de la suppression de l&apos;erreur:", err);
      setError("Erreur lors de la suppression de l&apos;erreur");
    }
  };

  const handleRetryQuestion = async (questionId: string) => {
    if (!questionId) return;

    try {
      router.push(`/controle/exercices/${questionId}`);
    } catch (err) {
      console.error("Erreur lors de la redirection:", err);
      setError("Erreur lors de la redirection vers l&apos;exercice");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-4 text-gray-600">
            Chargement des erreurs de révision...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md text-center">
          <p className="font-bold mb-2">⚠️ Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          className="mt-4"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Révision des erreurs
          </h1>
          <Button
            color="primary"
            onClick={() => router.push("/controle/exercices")}
          >
            Nouvel exercice
          </Button>
        </div>

        <Tabs
          className="mb-8"
          selectedKey={selectedCategory}
          onSelectionChange={(key) => setSelectedCategory(key.toString())}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              title={category === "all" ? "Toutes les catégories" : category}
            />
          ))}
        </Tabs>

        {errors.length === 0 ? (
          <Card className="bg-white shadow-lg">
            <CardBody className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">
                Aucune erreur à réviser
              </h3>
              <p className="text-gray-600 mb-6">
                Vous n&apos;avez pas encore d&apos;erreurs à réviser.
              </p>
              <Button
                color="primary"
                onClick={() => router.push("/controle/exercices")}
              >
                Faire un exercice
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {errors.map((error, index) => (
                <LightAnimation key={error._id} animation="slideUp">
                  <Card className="bg-white shadow-lg">
                    <CardBody>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">Question</h3>
                          <p className="text-gray-700 mt-2">
                            {error.questionText}
                          </p>
                        </div>
                        <Chip size="sm" variant="flat">
                          {error.category}
                        </Chip>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-red-600">
                            Votre réponse
                          </h4>
                          <p className="mt-1">{error.selectedAnswer}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-600">
                            Réponse correcte
                          </h4>
                          <p className="mt-1">{error.correctAnswer}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-500">
                          {new Date(error.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          {error.questionId && (
                            <Button
                              color="primary"
                              size="sm"
                              variant="flat"
                              onClick={() =>
                                handleRetryQuestion(error.questionId!)
                              }
                            >
                              Réessayer
                            </Button>
                          )}
                          <Button
                            color="danger"
                            size="sm"
                            variant="flat"
                            onClick={() => handleDeleteError(error._id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </LightAnimation>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  color="primary"
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RevisionPage;
