import type { NextApiRequest, NextApiResponse } from 'next';
import quizData from '../../../autistudy_quizzes_52.json';

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
      // Retourner tous les quiz disponibles
      const quizzes = quizData.map((quiz: any, index: number) => ({
        _id: `quiz-${quiz.week}`,
        week: quiz.week,
        title: quiz.title,
        questions: quiz.questions
      }));

      res.status(200).json({
        success: true,
        data: quizzes,
        count: quizzes.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des quiz',
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
