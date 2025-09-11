const express = require('express');
const router = express.Router();
const { Quiz, QuizResult } = require('../models/Quiz');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// GET /api/quiz - Récupérer tous les quiz actifs
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findActiveQuizzes();
    res.json({
      success: true,
      data: quizzes,
      count: quizzes.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des quiz',
      error: error.message
    });
  }
});

// GET /api/quiz/week/:week - Récupérer un quiz par semaine
router.get('/week/:week', async (req, res) => {
  try {
    const week = parseInt(req.params.week);
    
    if (isNaN(week) || week < 1 || week > 52) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de semaine invalide (1-52)'
      });
    }

    const quiz = await Quiz.findByWeek(week);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `Aucun quiz trouvé pour la semaine ${week}`
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du quiz',
      error: error.message
    });
  }
});

// GET /api/quiz/:id - Récupérer un quiz par ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trouvé'
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du quiz',
      error: error.message
    });
  }
});

// POST /api/quiz - Créer un nouveau quiz (Admin seulement)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { week, title, description, questions } = req.body;

    // Validation des données
    if (!week || !title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: week, title et questions sont requis'
      });
    }

    // Vérifier que la semaine n'existe pas déjà
    const existingQuiz = await Quiz.findOne({ week });
    if (existingQuiz) {
      return res.status(409).json({
        success: false,
        message: `Un quiz existe déjà pour la semaine ${week}`
      });
    }

    // Validation des questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.subject || !question.question || !question.options || !question.answer) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: subject, question, options et answer sont requis`
        });
      }
      
      if (!Array.isArray(question.options) || question.options.length < 2) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: options doit être un tableau avec au moins 2 éléments`
        });
      }

      if (!question.options.includes(question.answer)) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1}: la réponse doit être dans les options`
        });
      }
    }

    const quiz = new Quiz({
      week,
      title,
      description,
      questions,
      createdBy: req.user.id
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz créé avec succès',
      data: quiz
    });
  } catch (error) {
    console.error('Erreur lors de la création du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du quiz',
      error: error.message
    });
  }
});

// PUT /api/quiz/:id - Mettre à jour un quiz (Admin seulement)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, questions, isActive } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trouvé'
      });
    }

    // Validation des questions si fournies
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (!question.subject || !question.question || !question.options || !question.answer) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1}: subject, question, options et answer sont requis`
          });
        }
        
        if (!Array.isArray(question.options) || question.options.length < 2) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1}: options doit être un tableau avec au moins 2 éléments`
          });
        }

        if (!question.options.includes(question.answer)) {
          return res.status(400).json({
            success: false,
            message: `Question ${i + 1}: la réponse doit être dans les options`
          });
        }
      }
    }

    // Mise à jour des champs
    if (title) quiz.title = title;
    if (description !== undefined) quiz.description = description;
    if (questions) quiz.questions = questions;
    if (typeof isActive === 'boolean') quiz.isActive = isActive;

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz mis à jour avec succès',
      data: quiz
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du quiz',
      error: error.message
    });
  }
});

// DELETE /api/quiz/:id - Supprimer un quiz (Admin seulement)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trouvé'
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Quiz supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du quiz',
      error: error.message
    });
  }
});

// GET /api/quiz/stats/overview - Statistiques générales des quiz
router.get('/stats/overview', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await Quiz.getQuizStats();
    const weeklyStats = await QuizResult.getWeeklyStats();
    
    res.json({
      success: true,
      data: {
        quizStats: stats[0] || { totalQuizzes: 0, totalQuestions: 0, averageQuestionsPerQuiz: 0 },
        weeklyStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

// POST /api/quiz/:id/submit - Soumettre les réponses d'un quiz
router.post('/:id/submit', isAuthenticated, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;
    const userId = req.user.id;
    const quizId = req.params.id;

    // Récupérer le quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz non trouvé'
      });
    }

    // Validation des réponses
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de réponses incorrect'
      });
    }

    // Calculer le score
    let score = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.selectedAnswer === question.answer;
      if (isCorrect) score++;
      
      return {
        questionId: question.id,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.answer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    // Vérifier s'il existe déjà un résultat pour ce quiz
    let existingResult = await QuizResult.findOne({ userId, quizId });
    
    if (existingResult) {
      // Mettre à jour le résultat existant
      existingResult.score = score;
      existingResult.totalQuestions = quiz.questions.length;
      existingResult.percentage = percentage;
      existingResult.answers = processedAnswers;
      existingResult.timeSpent = timeSpent || 0;
      existingResult.completedAt = new Date();
      existingResult.attempts += 1;
      
      await existingResult.save();
    } else {
      // Créer un nouveau résultat
      existingResult = new QuizResult({
        userId,
        quizId,
        week: quiz.week,
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        answers: processedAnswers,
        timeSpent: timeSpent || 0,
        attempts: 1
      });
      
      await existingResult.save();
    }

    res.json({
      success: true,
      message: 'Quiz soumis avec succès',
      data: {
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        isNewRecord: !existingResult || existingResult.attempts === 1,
        answers: processedAnswers
      }
    });
  } catch (error) {
    console.error('Erreur lors de la soumission du quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la soumission du quiz',
      error: error.message
    });
  }
});

// GET /api/quiz/results/user/:userId - Récupérer les résultats d'un utilisateur
router.get('/results/user/:userId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Vérifier que l'utilisateur peut accéder à ces données
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const results = await QuizResult.findByUser(userId);
    
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des résultats',
      error: error.message
    });
  }
});

// GET /api/quiz/results/user/:userId/stats - Statistiques d'un utilisateur
router.get('/results/user/:userId/stats', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Vérifier que l'utilisateur peut accéder à ces données
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    const stats = await QuizResult.getUserStats(userId);
    
    res.json({
      success: true,
      data: stats[0] || { totalQuizzes: 0, averageScore: 0, bestScore: 0, totalTimeSpent: 0 }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques',
      error: error.message
    });
  }
});

// GET /api/quiz/results/week/:week - Résultats pour une semaine spécifique
router.get('/results/week/:week', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const week = parseInt(req.params.week);
    
    if (isNaN(week) || week < 1 || week > 52) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de semaine invalide (1-52)'
      });
    }

    const results = await QuizResult.find({ week })
      .populate('userId', 'pseudo email')
      .populate('quizId', 'title')
      .sort({ completedAt: -1 });
    
    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats de la semaine:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des résultats',
      error: error.message
    });
  }
});

module.exports = router;
