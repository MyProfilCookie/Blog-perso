"use client";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";

interface RevisionError {
  _id: string;
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  category: string;
  date: string;
}

const RevisionPage: React.FC = () => {
  const [errors, setErrors] = useState<RevisionError[]>([]);

  useEffect(() => {
    const fetchErrors = async () => {
      const token = localStorage.getItem("userToken");
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user)._id : null;

      if (!userId) return;

      const response = await fetch(`/api/revision-errors?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
      }
    };

    fetchErrors();
  }, []);

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
          {errors.map((err) => (
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