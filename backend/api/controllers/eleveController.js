const Eleve = require('../models/Eleve');
const User = require('../models/User');

// Obtenir le profil d'un élève
exports.getEleveProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Rechercher ou créer le profil de l'élève
    let eleve = await Eleve.findOne({ userId });
    
    if (!eleve) {
      // Créer un nouveau profil d'élève si celui-ci n'existe pas
      eleve = new Eleve({ userId });
      await eleve.save();
    }
    
    res.status(200).json(eleve);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du profil de l'élève:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Ajouter une note pour une page
exports.addPageScore = async (req, res) => {
  try {
    const { userId, subjectName, pageData } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Rechercher ou créer le profil de l'élève
    let eleve = await Eleve.findOne({ userId });
    
    if (!eleve) {
      // Créer un nouveau profil d'élève si celui-ci n'existe pas
      eleve = new Eleve({ userId });
    }
    
    // Ajouter la note de la page
    const updatedSubject = eleve.addPageScore(subjectName, pageData);
    
    // Sauvegarder les modifications
    await eleve.save();
    
    res.status(200).json({
      message: "Note ajoutée avec succès",
      subject: updatedSubject,
      overallAverage: eleve.overallAverage
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la note:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir les statistiques d'un élève pour une matière spécifique
exports.getSubjectStats = async (req, res) => {
  try {
    const { userId, subjectName } = req.params;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Rechercher le profil de l'élève
    const eleve = await Eleve.findOne({ userId });
    
    if (!eleve) {
      return res.status(404).json({ message: "Profil d'élève non trouvé" });
    }
    
    // Trouver la matière spécifique
    const subject = eleve.subjects.find(s => s.subjectName === subjectName);
    
    if (!subject) {
      return res.status(404).json({ message: "Aucune donnée trouvée pour cette matière" });
    }
    
    res.status(200).json(subject);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir toutes les statistiques d'un élève
exports.getAllStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Rechercher le profil de l'élève
    const eleve = await Eleve.findOne({ userId });
    
    if (!eleve) {
      return res.status(404).json({ message: "Profil d'élève non trouvé" });
    }
    
    res.status(200).json(eleve);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer une note spécifique
exports.deletePageScore = async (req, res) => {
  try {
    const { userId, subjectName, pageNumber } = req.params;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    
    // Rechercher le profil de l'élève
    const eleve = await Eleve.findOne({ userId });
    
    if (!eleve) {
      return res.status(404).json({ message: "Profil d'élève non trouvé" });
    }
    
    // Trouver la matière spécifique
    const subjectIndex = eleve.subjects.findIndex(s => s.subjectName === subjectName);
    
    if (subjectIndex === -1) {
      return res.status(404).json({ message: "Matière non trouvée" });
    }
    
    // Supprimer la page spécifique
    eleve.subjects[subjectIndex].pages = eleve.subjects[subjectIndex].pages.filter(
      page => page.pageNumber !== parseInt(pageNumber)
    );
    
    // Recalculer la moyenne de la matière
    const subject = eleve.subjects[subjectIndex];
    if (subject.pages.length > 0) {
      const totalScore = subject.pages.reduce((sum, page) => sum + page.score, 0);
      subject.averageScore = totalScore / subject.pages.length;
    } else {
      subject.averageScore = 0;
    }
    
    // Mettre à jour le nombre total de pages complétées
    eleve.totalPagesCompleted = eleve.subjects.reduce((sum, s) => sum + s.pages.length, 0);
    
    // Recalculer la moyenne globale
    eleve.calculateOverallAverage();
    
    // Sauvegarder les modifications
    await eleve.save();
    
    res.status(200).json({ message: "Note supprimée avec succès", eleve });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de la note:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}; 