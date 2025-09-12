import type { NextApiRequest, NextApiResponse } from 'next';
import quizData from '../../../../autistudy_quizzes_52.json';

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  _id: string;
  week: number;
  title: string;
  questions: Question[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { week } = req.query;
      const weekNumber = parseInt(week as string);
      
      if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
        return res.status(400).json({
          success: false,
          message: 'Numéro de semaine invalide (1-52)'
        });
      }

      // Trouver le quiz pour la semaine demandée
      const quiz = quizData.find((q: any) => q.week === weekNumber);
      
      if (!quiz) {
        return res.status(404).json({
          success: false,
          message: `Aucun quiz trouvé pour la semaine ${weekNumber}`
        });
      }

      const formattedQuiz: Quiz = {
        _id: `quiz-${quiz.week}`,
        week: quiz.week,
        title: quiz.title,
        questions: quiz.questions
      };

      res.status(200).json({
        success: true,
        data: formattedQuiz
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération du quiz',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Méthode ${req.method} non autorisée`
    });
  }
}
