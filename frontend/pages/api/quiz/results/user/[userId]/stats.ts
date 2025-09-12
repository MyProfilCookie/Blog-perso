import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID utilisateur requis'
        });
      }

      // Simuler les statistiques de l'utilisateur
      // Dans un vrai projet, vous récupéreriez ces données depuis la base de données
      const mockStats = {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        completedQuizzes: [],
        weeklyProgress: []
      };

      res.status(200).json({
        success: true,
        data: mockStats
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des statistiques',
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
