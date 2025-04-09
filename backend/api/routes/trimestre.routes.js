const express = require("express");
const router = express.Router();
const Trimestre = require("../models/Trimestre");

// Obtenir tous les trimestres
router.get("/", async (req, res) => {
  try {
    const trimestres = await Trimestre.find();
    res.status(200).json(trimestres);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des trimestres :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Obtenir un trimestre spécifique par son numéro
router.get("/:id", async (req, res) => {
  try {
    const trimestre = await Trimestre.findOne({ numero: parseInt(req.params.id, 10) });

    if (!trimestre) {
      return res.status(404).json({ message: "Trimestre non trouvé" });
    }

    res.status(200).json(trimestre);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du trimestre :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;