import React, { useState } from 'react';
import { Card, CardBody, Button, Accordion, AccordionItem, Input } from "@nextui-org/react";
import { useRevision } from "@/app/RevisionContext";
import { motion } from "framer-motion";

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

const RevisionErrors: React.FC = () => {
  const { errors, getErrorsByCategory, removeError } = useRevision();
  const [search, setSearch] = useState("");
  const [corrected, setCorrected] = useState<string[]>([]);
  const errorsByCategory = getErrorsByCategory();

  // Filtrage par mot-clé et erreurs non corrigées
  const filterErrors = (categoryErrors: any[]) =>
    categoryErrors.filter(
      (error) =>
        !corrected.includes(error._id) &&
        (
          error.questionText.toLowerCase().includes(search.toLowerCase()) ||
          error.selectedAnswer.toLowerCase().includes(search.toLowerCase()) ||
          error.correctAnswer.toLowerCase().includes(search.toLowerCase())
        )
    );

  if (errors.length === 0) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Aucune erreur à réviser</h2>
          <p className="text-gray-600">Continuez à travailler, vous progressez bien !</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold mb-4">Questions à réviser</h2>
      <div className="mb-4">
        <Input
          type="text"
          label="Rechercher une erreur"
          placeholder="Mot-clé, réponse, question..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>
      <Accordion>
        {Object.entries(errorsByCategory).map(([category, categoryErrors]) => {
          const filtered = filterErrors(categoryErrors);
          if (filtered.length === 0) return null;
          return (
            <AccordionItem
              key={category}
              title={
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryEmoji(category)}</span>
                  <span className="font-semibold">{category}</span>
                  <span className="text-sm text-gray-500">({filtered.length} erreur{filtered.length > 1 ? 's' : ''})</span>
                </div>
              }
            >
              <div className="space-y-4">
                {filtered.map((error) => (
                  <motion.div
                    key={error._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium">{error.questionText}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-red-500">
                          Votre réponse : {error.selectedAnswer}
                        </p>
                        <p className="text-green-500">
                          Réponse correcte : {error.correctAnswer}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 gap-2">
                        <span className="text-xs text-gray-500">
                          Tentatives : {error.attempts}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            onClick={() => setCorrected([...corrected, error._id])}
                          >
                            Corrigé
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() => removeError(error._id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default RevisionErrors; 