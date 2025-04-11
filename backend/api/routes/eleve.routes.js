const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Obtenir le profil d'un élève
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

// Ajouter une note pour une page
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

// Obtenir les statistiques d'un élève pour une matière spécifique
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

// Obtenir toutes les statistiques d'un élève
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
    
    res.json({
      userId,
      scores,
      overallAverage
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les notes d'un élève dans une matière
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

// Supprimer une note spécifique
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

module.exports = router; 