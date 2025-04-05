import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db"; // Assure-toi d’avoir ce helper
import RevisionError from "@/models/RevisionError";

// Récupération des erreurs par utilisateur
export async function getAllRevisionErrors(req, res) {
  await connectToDatabase();

  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID manquant" });
  }

  try {
    const errors = await RevisionError.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ errors });
  } catch (err) {
    return res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
}

// Création d'une erreur
export async function createRevisionError(req, res) {
  await connectToDatabase();

  const {
    userId,
    questionId,
    questionText,
    selectedAnswer,
    correctAnswer,
    category,
  } = req.body;

  if (!userId || !questionId || !correctAnswer) {
    return res.status(400).json({ message: "Champs obligatoires manquants." });
  }

  try {
    const revision = new RevisionError({
      userId,
      questionId,
      questionText,
      selectedAnswer,
      correctAnswer,
      category,
      date: new Date(),
    });

    await revision.save();
    return res.status(201).json({ message: "Erreur enregistrée", revision });
  } catch (err) {
    return res.status(500).json({ message: "Erreur d'enregistrement", error: err.message });
  }
}