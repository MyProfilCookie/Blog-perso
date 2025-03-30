const express = require("express");
const router = express.Router();
const WeeklyReport = require("../models/WeeklyReport");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Récupérer tous les rapports (accès admin seulement)
router.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const reports = await WeeklyReport.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer tous les rapports d'un utilisateur spécifique
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    // Vérifier si l'utilisateur demande ses propres rapports ou si c'est un admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const reports = await WeeklyReport.find({ userId: req.params.userId });
    res.status(200).json(reports);
  } catch (error) {
    console.error(`❌ Error fetching reports for user ${req.params.userId}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer un rapport spécifique par utilisateur et semaine
router.get("/user/:userId/week/:weekNumber", authMiddleware, async (req, res) => {
  try {
    // Vérifier si l'utilisateur demande ses propres rapports ou si c'est un admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const report = await WeeklyReport.findOne({ 
      userId: req.params.userId,
      weekNumber: req.params.weekNumber
    });

    if (!report) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(`❌ Error fetching report for user ${req.params.userId} and week ${req.params.weekNumber}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Récupérer un rapport par son ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Vérifier si l'utilisateur est autorisé à voir ce rapport
    if (report.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(`❌ Error fetching report ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Créer un nouveau rapport
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Vérifier si l'utilisateur crée un rapport pour lui-même ou si c'est un admin
    if (req.body.userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    // Vérifier si un rapport existe déjà pour cette semaine
    const existingReport = await WeeklyReport.findOne({
      userId: req.body.userId,
      weekNumber: req.body.weekNumber
    });

    if (existingReport) {
      return res.status(400).json({ 
        message: "Un rapport existe déjà pour cette semaine",
        existingReportId: existingReport._id
      });
    }

    const newReport = new WeeklyReport(req.body);
    const savedReport = await newReport.save();

    res.status(201).json(savedReport);
  } catch (error) {
    console.error("❌ Error creating report:", error);
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
});

// Mettre à jour un rapport
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Vérifier si l'utilisateur modifie son propre rapport ou si c'est un admin
    if (report.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const updatedReport = await WeeklyReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error(`❌ Error updating report ${req.params.id}:`, error);
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
});

// Supprimer un rapport
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const report = await WeeklyReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    // Vérifier si l'utilisateur supprime son propre rapport ou si c'est un admin
    if (report.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    await WeeklyReport.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Rapport supprimé avec succès" });
  } catch (error) {
    console.error(`❌ Error deleting report ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;