const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const Eleve = require('../models/Eleve');

// Obtenir le profil d'un élève (route existante améliorée)
router.get('/profile/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur est autorisé à voir ce profil
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Récupérer les statistiques de l'élève
    const stats = await Score.getStudentStats(userId);
    
    res.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// NOUVELLE ROUTE: Statistiques complètes avec données localStorage
router.get('/complete-stats/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    console.log(`📊 Récupération des statistiques complètes pour ${userId}`);

    // 1. Récupérer toutes les notes depuis Score
    const scores = await Score.find({ userId }).sort({ createdAt: -1 });
    
    // 2. Calculer les statistiques globales
    const totalExercises = scores.length;
    const totalCorrect = scores.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    const totalQuestions = scores.reduce((sum, s) => sum + (s.totalQuestions || 1), 0);
    const averageScore = totalExercises > 0 ? scores.reduce((sum, s) => sum + (s.score || 0), 0) / totalExercises : 0;

    // 3. Statistiques par matière
    const subjectsMap = {};
    scores.forEach(score => {
      if (!subjectsMap[score.subjectName]) {
        subjectsMap[score.subjectName] = {
          scores: [],
          totalCorrect: 0,
          totalQuestions: 0,
          totalTimeSpent: 0
        };
      }
      
      subjectsMap[score.subjectName].scores.push(score);
      subjectsMap[score.subjectName].totalCorrect += (score.correctAnswers || 0);
      subjectsMap[score.subjectName].totalQuestions += (score.totalQuestions || 1);
      subjectsMap[score.subjectName].totalTimeSpent += (score.timeSpent || 0);
    });

    const subjects = Object.entries(subjectsMap).map(([subjectName, data]) => {
      const subjectScores = data.scores;
      const avgScore = subjectScores.length > 0 ? 
        subjectScores.reduce((sum, s) => sum + (s.score || 0), 0) / subjectScores.length : 0;
      
      return {
        subject: subjectName,
        totalExercises: subjectScores.length,
        correctAnswers: data.totalCorrect,
        averageScore: avgScore,
        exercisesCompleted: subjectScores.length,
        progress: data.totalQuestions > 0 ? (data.totalCorrect / data.totalQuestions) * 100 : 0,
        lastActivity: subjectScores.length > 0 ? subjectScores[0].createdAt : new Date(),
        timeSpent: data.totalTimeSpent
      };
    });

    // 4. Statistiques quotidiennes (7 derniers jours)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last7Days.map(date => {
      const dayScores = scores.filter(score => 
        score.createdAt.toISOString().split('T')[0] === date
      );
      
      const dayAvg = dayScores.length > 0 ? 
        dayScores.reduce((sum, s) => sum + (s.score || 0), 0) / dayScores.length : 0;
      
      return {
        date,
        exercisesCompleted: dayScores.length,
        averageScore: dayAvg,
        timeSpent: dayScores.reduce((sum, s) => sum + (s.timeSpent || 0), 0)
      };
    });

    // 5. Statistiques par catégorie
    const categoryStats = subjects.map(subject => ({
      category: subject.subject,
      count: subject.exercisesCompleted,
      percentage: subject.averageScore
    }));

    // 6. Récupérer les infos utilisateur
    const User = require('../models/User');
    const userInfo = await User.findById(userId).select('prenom nom email');

    const response = {
      userId,
      userInfo: userInfo ? {
        prenom: userInfo.prenom,
        nom: userInfo.nom,
        email: userInfo.email
      } : null,
      totalExercises,
      totalCorrect,
      averageScore,
      subjects,
      scores: scores.map(score => ({
        _id: score._id,
        subjectName: score.subjectName,
        pageNumber: score.pageNumber,
        score: score.score,
        correctAnswers: score.correctAnswers,
        totalQuestions: score.totalQuestions,
        timeSpent: score.timeSpent,
        createdAt: score.createdAt
      })),
      dailyStats,
      categoryStats,
      globalStats: {
        totalExercises,
        totalCorrect,
        averageScore,
        totalTimeSpent: scores.reduce((sum, s) => sum + (s.timeSpent || 0), 0),
        streak: calculateStreak(scores)
      },
      subscriptionType: 'free'
    };

    console.log(`✅ Statistiques calculées:`, {
      totalExercises,
      averageScore: averageScore.toFixed(1),
      subjectsCount: subjects.length
    });

    res.json(response);

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats complètes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// NOUVELLE ROUTE: Synchroniser les données localStorage
router.post('/sync-localStorage/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const { allSubjectsData } = req.body;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    console.log(`🔄 Synchronisation localStorage pour ${userId}`);
    console.log(`📁 Matières à synchroniser:`, Object.keys(allSubjectsData));

    let totalSynced = 0;
    const syncResults = {};

    // Traiter chaque matière
    for (const [subject, data] of Object.entries(allSubjectsData)) {
      try {
        let subjectSynced = 0;

        // 1. Synchroniser les exercices validés
        if (data.validatedExercises) {
          for (const [pageId, isValidated] of Object.entries(data.validatedExercises)) {
            if (isValidated) {
              const pageNumber = parseInt(pageId.replace('page-', '')) || parseInt(pageId);
              
              // Vérifier si ce score existe déjà
              const existingScore = await Score.findOne({
                userId,
                subjectName: subject,
                pageNumber
              });

              if (!existingScore) {
                // Créer un nouveau score
                const newScore = new Score({
                  userId,
                  subjectName: subject,
                  pageNumber,
                  score: 80, // Score par défaut pour exercice validé
                  timeSpent: 120, // 2 minutes par défaut
                  correctAnswers: 4, // Estimation
                  totalQuestions: 5, // Estimation
                  createdAt: new Date()
                });

                await newScore.save();
                subjectSynced++;
              }
            }
          }
        }

        // 2. Synchroniser les résultats détaillés
        if (data.results && Array.isArray(data.results)) {
          for (let i = 0; i < data.results.length; i++) {
            const result = data.results[i];
            if (result && result.hasOwnProperty('isCorrect')) {
              const pageNumber = i + 1;

              const existingScore = await Score.findOne({
                userId,
                subjectName: subject,
                pageNumber
              });

              if (!existingScore) {
                const newScore = new Score({
                  userId,
                  subjectName: subject,
                  pageNumber,
                  score: result.score || (result.isCorrect ? 100 : 0),
                  timeSpent: result.timeSpent || 120,
                  correctAnswers: result.isCorrect ? 1 : 0,
                  totalQuestions: 1,
                  createdAt: result.completedAt ? new Date(result.completedAt) : new Date()
                });

                await newScore.save();
                subjectSynced++;
              }
            }
          }
        }

        // 3. Synchroniser les scores sauvegardés
        if (data.scores && Array.isArray(data.scores)) {
          for (const scoreData of data.scores) {
            if (scoreData && scoreData.pageNumber) {
              const existingScore = await Score.findOne({
                userId,
                subjectName: subject,
                pageNumber: scoreData.pageNumber
              });

              if (!existingScore) {
                const newScore = new Score({
                  userId,
                  subjectName: subject,
                  pageNumber: scoreData.pageNumber,
                  score: scoreData.score || 0,
                  timeSpent: scoreData.timeSpent || 120,
                  correctAnswers: scoreData.correctAnswers || 0,
                  totalQuestions: scoreData.totalQuestions || 1,
                  createdAt: scoreData.completedAt ? new Date(scoreData.completedAt) : new Date()
                });

                await newScore.save();
                subjectSynced++;
              }
            }
          }
        }

        syncResults[subject] = subjectSynced;
        totalSynced += subjectSynced;

        console.log(`✅ ${subject}: ${subjectSynced} exercices synchronisés`);

      } catch (subjectError) {
        console.error(`❌ Erreur synchronisation ${subject}:`, subjectError);
        syncResults[subject] = 0;
      }
    }

    // Calculer les nouvelles statistiques
    const newStats = await Score.find({ userId });
    const newTotalExercises = newStats.length;
    const newAverageScore = newStats.length > 0 ? 
      newStats.reduce((sum, s) => sum + (s.score || 0), 0) / newStats.length : 0;

    console.log(`✅ Synchronisation terminée: ${totalSynced} exercices au total`);

    res.json({
      success: true,
      message: `Synchronisation réussie: ${totalSynced} exercices synchronisés`,
      syncResults,
      stats: {
        totalExercises: newTotalExercises,
        averageScore: newAverageScore,
        subjectsCount: Object.keys(syncResults).length
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la synchronisation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// NOUVELLE ROUTE: Sauvegarder des données d'exercice depuis localStorage
router.post('/save-exercise-data/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const { subject, exerciseData } = req.body;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    console.log(`💾 Sauvegarde données exercice: ${subject} pour ${userId}`);

    // Utiliser la route de synchronisation existante
    const syncData = { [subject]: exerciseData };
    req.body = { allSubjectsData: syncData };

    // Réutiliser la logique de synchronisation
    const syncResponse = await handleSyncLocalStorage(userId, syncData);

    res.json({
      success: true,
      message: `Données sauvegardées pour ${subject}`,
      ...syncResponse
    });

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter une note pour une page (route existante - inchangée)
router.post('/score', isAuthenticated, async (req, res) => {
  try {
    const { userId, subjectName, pageData } = req.body;
    
    // Vérifier que l'utilisateur est autorisé à sauvegarder cette note
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Créer une nouvelle note
    const score = new Score({
      userId,
      subjectName,
      pageNumber: pageData.pageNumber,
      score: pageData.score,
      timeSpent: pageData.timeSpent,
      correctAnswers: pageData.correctAnswers,
      totalQuestions: pageData.totalQuestions
    });
    
    // Sauvegarder la note
    await score.save();
    
    res.status(201).json({ message: "Note sauvegardée avec succès", score });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la note:", error);
    
    // Gérer les erreurs de validation
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Une note existe déjà pour cette page et cette matière" 
      });
    }
    
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Obtenir les statistiques d'un élève pour une matière spécifique (route existante - inchangée)
router.get('/stats/:userId/:subjectName', isAuthenticated, async (req, res) => {
  try {
    const { userId, subjectName } = req.params;
    
    // Vérifier que l'utilisateur est autorisé à voir ces statistiques
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Récupérer les notes pour cette matière
    const scores = await Score.find({ userId, subjectName })
      .sort({ pageNumber: 1 });
    
    // Calculer la moyenne pour cette matière
    const averageScore = await Score.calculateAverage(userId, subjectName);
    
    res.json({
      subjectName,
      scores,
      averageScore
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Obtenir toutes les statistiques d'un élève (route existante améliorée)
router.get('/stats/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Vérifier que l'utilisateur est autorisé à voir ces statistiques
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Récupérer toutes les notes de l'élève
    const scores = await Score.find({ userId });
    
    // Calculer la moyenne globale
    const overallAverage = await Score.calculateOverallAverage(userId);

    // Calculs pour le frontend (améliorés)
    const totalExercises = scores.length;
    const totalCorrect = scores.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    const averageScore = overallAverage || 0;
    
    // Regrouper par matière avec plus de détails
    const subjectsMap = {};
    scores.forEach(s => {
      if (!subjectsMap[s.subjectName]) {
        subjectsMap[s.subjectName] = {
          scores: [],
          totalCorrect: 0,
          totalQuestions: 0,
          totalTimeSpent: 0
        };
      }
      subjectsMap[s.subjectName].scores.push(s);
      subjectsMap[s.subjectName].totalCorrect += (s.correctAnswers || 0);
      subjectsMap[s.subjectName].totalQuestions += (s.totalQuestions || 1);
      subjectsMap[s.subjectName].totalTimeSpent += (s.timeSpent || 0);
    });

    const subjects = Object.entries(subjectsMap).map(([subject, data]) => ({
      subject,
      averageScore: data.scores.reduce((sum, s) => sum + (s.score || 0), 0) / data.scores.length,
      totalExercises: data.scores.length,
      correctAnswers: data.totalCorrect,
      exercisesCompleted: data.scores.length,
      progress: data.totalQuestions > 0 ? (data.totalCorrect / data.totalQuestions) * 100 : 0
    }));

    res.json({
      userId,
      totalExercises,
      totalCorrect,
      averageScore,
      subjects,
      scores
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les notes d'un élève dans une matière (route existante - inchangée)
router.get('/scores/:userId/:subjectName', isAuthenticated, async (req, res) => {
  try {
    const { userId, subjectName } = req.params;
    
    // Vérifier que l'utilisateur est autorisé à voir ces notes
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Récupérer les notes
    const scores = await Score.find({ userId, subjectName })
      .sort({ pageNumber: 1 });
    
    res.json(scores);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une note spécifique (route existante - inchangée)
router.delete('/score/:userId/:subjectName/:pageNumber', isAuthenticated, async (req, res) => {
  try {
    const { userId, subjectName, pageNumber } = req.params;
    
    // Vérifier que l'utilisateur est autorisé à supprimer cette note
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }
    
    // Supprimer la note
    const result = await Score.deleteOne({
      userId,
      subjectName,
      pageNumber: parseInt(pageNumber)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Note non trouvée" });
    }
    
    res.json({ message: "Note supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Obtenir le nombre d'élèves (route existante - inchangée)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Compter le nombre total d'élèves
    const totalEleves = await Eleve.countDocuments();
    
    // Log pour debug
    console.log("📊 Nombre total d'élèves:", totalEleves);
    
    res.status(200).json({
      success: true,
      total: totalEleves,
      message: `Nombre total d'élèves: ${totalEleves}`
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du nombre d'élèves:", error);
    res.status(500).json({ 
      success: false,
      message: "Erreur lors de la récupération du nombre d'élèves",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// NOUVELLE ROUTE: Supprimer toutes les données d'un utilisateur
router.delete('/delete-all-data/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Supprimer tous les scores
    const deleteResult = await Score.deleteMany({ userId });

    console.log(`🗑️ ${deleteResult.deletedCount} scores supprimés pour l'utilisateur ${userId}`);

    res.json({
      success: true,
      message: `${deleteResult.deletedCount} scores supprimés avec succès`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Fonction utilitaire pour calculer la série de jours consécutifs
function calculateStreak(scores) {
  if (!scores || scores.length === 0) return 0;

  // Grouper par jour
  const scoresByDay = {};
  scores.forEach(score => {
    const day = score.createdAt.toISOString().split('T')[0];
    if (!scoresByDay[day]) scoresByDay[day] = 0;
    scoresByDay[day]++;
  });

  const days = Object.keys(scoresByDay).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const daysDiff = Math.floor((new Date(today) - new Date(day)) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Fonction utilitaire pour la synchronisation (réutilisable)
async function handleSyncLocalStorage(userId, allSubjectsData) {
  let totalSynced = 0;
  const syncResults = {};

  for (const [subject, data] of Object.entries(allSubjectsData)) {
    try {
      let subjectSynced = 0;

      if (data.validatedExercises) {
        for (const [pageId, isValidated] of Object.entries(data.validatedExercises)) {
          if (isValidated) {
            const pageNumber = parseInt(pageId.replace('page-', '')) || parseInt(pageId);
            
            const existingScore = await Score.findOne({ userId, subjectName: subject, pageNumber });

            if (!existingScore) {
              const newScore = new Score({
                userId,
                subjectName: subject,
                pageNumber,
                score: 80,
                timeSpent: 120,
                correctAnswers: 4,
                totalQuestions: 5,
                createdAt: new Date()
              });

              await newScore.save();
              subjectSynced++;
            }
          }
        }
      }

      syncResults[subject] = subjectSynced;
      totalSynced += subjectSynced;

    } catch (error) {
      console.error(`❌ Erreur sync ${subject}:`, error);
      syncResults[subject] = 0;
    }
  }

  return { totalSynced, syncResults };
}

module.exports = router;