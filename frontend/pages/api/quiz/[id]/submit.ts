import type { NextApiRequest, NextApiResponse } from 'next';

interface Answer {
  questionId: number;
  selectedAnswer: string;
  timeSpent: number;
}

interface SubmitQuizRequest {
  answers: Answer[];
  timeSpent: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const { answers, timeSpent }: SubmitQuizRequest = req.body;

      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Les réponses sont requises'
        });
      }

      // Simuler la sauvegarde des résultats
      // Dans un vrai projet, vous sauvegarderiez en base de données
      console.log(`Quiz ${id} soumis:`, {
        answers,
        timeSpent,
        submittedAt: new Date().toISOString()
      });

      // Calculer le score (simulation)
      const score = answers.length; // Pour simplifier, on assume que toutes les réponses sont correctes
      const totalQuestions = answers.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      res.status(200).json({
        success: true,
        data: {
          quizId: id,
          score,
          totalQuestions,
          percentage,
          timeSpent,
          submittedAt: new Date().toISOString()
        },
        message: 'Quiz soumis avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la soumission du quiz',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      message: `Méthode ${req.method} non autorisée`
    });
  }
}
