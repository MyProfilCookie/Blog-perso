"use client";
import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useRevision } from "../../contexts/RevisionContext";

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
}

const RevisionPage: React.FC = () => {
  const { errors } = useRevision();

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

export default RevisionPage;