import { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db"; // Assure-toi d’avoir ce helper
import RevisionError from "@/models/RevisionError";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID manquant" });
    }

    const errors = await RevisionError.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ errors });
  }

  if (req.method === "POST") {
    const {
      userId,
      questionId,
      questionText,
      selectedAnswer,
      correctAnswer,
      category,
    } = req.body;

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
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}