const express = require("express");
const router = express.Router();
const {
  createRapportHebdo,
  getAllRapportsHebdos,
  getRapportHebdoById,
  getRapportHebdoByWeek,
  updateRapportHebdo,
  deleteRapportHebdo
} = require("../controllers/rapportHebdos.controller");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { check } = require('express-validator');

// Validation middleware
const validateRapportHebdo = [
    check('week').isInt({ min: 1, max: 53 }).withMessage('Le numéro de semaine doit être entre 1 et 53'),
    check('subjects').isArray({ min: 1 }).withMessage('Au moins une matière est requise'),
    check('titre').notEmpty().withMessage('Le titre est requis'),
    check('description').notEmpty().withMessage('La description est requise'),
    check('dateDebut').isISO8601().withMessage('La date de début doit être valide'),
    check('dateFin').isISO8601().withMessage('La date de fin doit être valide'),
    check('objectifs').isArray({ min: 1 }).withMessage('Au moins un objectif est requis'),
    check('realisations').isArray({ min: 1 }).withMessage('Au moins une réalisation est requise')
];

// Routes protégées par authentification
router.use(authMiddleware);

// ➕ Créer un nouveau rapport
router.post("/", validateRapportHebdo, createRapportHebdo);

// 🔍 Obtenir tous les rapports
router.get("/", getAllRapportsHebdos);

// 🔍 Obtenir un rapport par ID
router.get("/:id", getRapportHebdoById);

// 🔍 Obtenir un rapport par semaine
router.get("/week/:week", getRapportHebdoByWeek);

// 📝 Mettre à jour un rapport
router.put("/:id", validateRapportHebdo, updateRapportHebdo);

// ❌ Supprimer un rapport
router.delete("/:id", deleteRapportHebdo);

module.exports = router;
