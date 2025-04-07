const express = require("express");
const router = express.Router();
const {
  createRapport,
  getAllRapports,
  getRapportByWeek,
  deleteRapport,
} = require("../controllers/rapportHebdosController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// ➕ Créer un nouveau rapport
router.post("/", authMiddleware, createRapport);

// 🔍 Obtenir tous les rapports (admin uniquement)
router.get("/", authMiddleware, isAdmin, getAllRapports);

// 🔍 Obtenir un rapport par semaine (lié à l'utilisateur connecté)
router.get("/week/:week", authMiddleware, getRapportByWeek);

// ❌ Supprimer un rapport (admin uniquement)
router.delete("/:id", authMiddleware, isAdmin, deleteRapport);

module.exports = router;
