import dynamic from 'next/dynamic';
"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@nextui-org/react'
import { CardBody } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import { Chip } from '@nextui-org/react'
import { Progress } from '@nextui-org/react';
const motion = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion })), { ssr: false });
import { useRevision } from "@/app/RevisionContext";
import { toast } from "sonner";

const RevisionPage: React.FC = () => {
  const { errors, getErrorsByCategory } = useRevision();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  const [stats, setStats] = useState({
    totalErrors: 0,
    categories: {} as Record<string, number>,
    mostErrors: "",
    leastErrors: "",
  });

  useEffect(() => {
    const errorsByCategory = getErrorsByCategory();
    const totalErrors = errors.length;
    const categories = Object.entries(errorsByCategory).reduce((acc, [category, errors]) => {
      acc[category] = errors.length;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const mostErrors = sortedCategories[0]?.[0] || "";
    const leastErrors = sortedCategories[sortedCategories.length - 1]?.[0] || "";

    setStats({
      totalErrors,
      categories,
      mostErrors,
      leastErrors,
    });
  }, [errors, getErrorsByCategory]);

  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case "mathématiques":
      case "maths":
        return "📐";
      case "français":
        return "📚";
      case "histoire":
        return "🏛️";
      case "géographie":
        return "🌍";
      case "sciences":
        return "🔬";
      case "anglais":
        return "🇬🇧";
      case "espagnol":
        return "🇪🇸";
      case "allemand":
        return "🇩🇪";
      case "art":
        return "🎨";
      case "musique":
        return "🎵";
      case "technologie":
        return "💻";
      default:
        return "📝";
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    toast.info(`Filtrage des erreurs : ${category}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">
            Centre de Révision
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Retravaillez vos erreurs pour progresser
          </p>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Total des erreurs</h3>
              <p className="text-3xl font-bold text-violet-600">{stats.totalErrors}</p>
            </CardBody>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Matière la plus difficile</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryEmoji(stats.mostErrors)}</span>
                <p className="text-xl font-bold">{stats.mostErrors}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-white dark:bg-gray-800">
            <CardBody>
              <h3 className="text-lg font-semibold mb-2">Matière la plus maîtrisée</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryEmoji(stats.leastErrors)}</span>
                <p className="text-xl font-bold">{stats.leastErrors}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Chip
            color={selectedCategory === "Tout" ? "primary" : "default"}
            variant={selectedCategory === "Tout" ? "solid" : "flat"}
            onClick={() => handleCategoryChange("Tout")}
            className="cursor-pointer"
          >
            Tout
          </Chip>
          {Object.keys(stats.categories).map((category) => (
            <Chip
              key={category}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "solid" : "flat"}
              onClick={() => handleCategoryChange(category)}
              className="cursor-pointer"
            >
              {getCategoryEmoji(category)} {category} ({stats.categories[category]})
            </Chip>
          ))}
        </div>

        {/* Progression par matière */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Progression par matière</h2>
          <div className="space-y-4">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    {getCategoryEmoji(category)} {category}
                  </span>
                  <span className="text-sm text-gray-500">{count} erreur{count > 1 ? 's' : ''}</span>
                </div>
                <Progress
                  value={(count / stats.totalErrors) * 100}
                  color="primary"
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Liste des erreurs */}
        <div className="text-center text-gray-500 py-12">
          Le composant de révision a été supprimé. Veuillez utiliser la page Contrôle &gt; Questions à Revoir pour accéder à vos erreurs.
        </div>
      </div>
    </div>
  );
};

export default RevisionPage; 