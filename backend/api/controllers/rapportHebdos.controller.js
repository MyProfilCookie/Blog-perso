const RapportHebdo = require('../models/rapportHebdo.model');
const { validationResult } = require('express-validator');

// Créer un nouveau rapport hebdomadaire
exports.createRapportHebdo = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rapportHebdo = new RapportHebdo({
            week: req.body.week,
            subjects: req.body.subjects
        });

        await rapportHebdo.save();
        res.status(201).json(rapportHebdo);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du rapport hebdomadaire", error: error.message });
    }
};

// Récupérer tous les rapports hebdomadaires
exports.getAllRapportsHebdos = async (req, res) => {
    try {
        const rapports = await RapportHebdo.find()
            .sort({ week: -1, createdAt: -1 });
        res.status(200).json(rapports);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rapports", error: error.message });
    }
};

// Récupérer un rapport hebdomadaire par ID
exports.getRapportHebdoById = async (req, res) => {
    try {
        const rapport = await RapportHebdo.findById(req.params.id);
        
        if (!rapport) {
            return res.status(404).json({ message: "Rapport hebdomadaire non trouvé" });
        }
        
        res.status(200).json(rapport);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du rapport", error: error.message });
    }
};

// Récupérer un rapport hebdomadaire par semaine
exports.getRapportHebdoByWeek = async (req, res) => {
    try {
        const week = parseInt(req.params.week);
        if (isNaN(week) || week < 1 || week > 53) {
            return res.status(400).json({ message: "Numéro de semaine invalide" });
        }

        const rapport = await RapportHebdo.findOne({ week });
        
        if (!rapport) {
            return res.status(404).json({ message: "Rapport hebdomadaire non trouvé pour cette semaine" });
        }
        
        res.status(200).json(rapport);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du rapport", error: error.message });
    }
};

// Mettre à jour un rapport hebdomadaire
exports.updateRapportHebdo = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updatedRapport = await RapportHebdo.findByIdAndUpdate(
            req.params.id,
            {
                week: req.body.week,
                subjects: req.body.subjects
            },
            { new: true }
        );

        if (!updatedRapport) {
            return res.status(404).json({ message: "Rapport hebdomadaire non trouvé" });
        }

        res.status(200).json(updatedRapport);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du rapport", error: error.message });
    }
};

// Supprimer un rapport hebdomadaire
exports.deleteRapportHebdo = async (req, res) => {
    try {
        const rapport = await RapportHebdo.findByIdAndDelete(req.params.id);
        
        if (!rapport) {
            return res.status(404).json({ message: "Rapport hebdomadaire non trouvé" });
        }

        res.status(200).json({ message: "Rapport hebdomadaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du rapport", error: error.message });
    }
}; 