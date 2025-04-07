const RapportHebdo = require("../models/RapportHebdo");

// ➕ Créer un rapport
exports.createRapport = async (req, res) => {
  try {
    const newRapport = new RapportHebdo(req.body);
    const saved = await newRapport.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Erreur création rapport :", err);
    res.status(400).json({ message: "Erreur création", error: err.message });
  }
};

// 🔍 Récupérer tous les rapports (admin)
exports.getAllRapports = async (req, res) => {
  try {
    const rapports = await RapportHebdo.find();
    res.status(200).json(rapports);
  } catch (err) {
    console.error("❌ Erreur récupération rapports :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 🔍 Récupérer un rapport par semaine et user
exports.getRapportByWeek = async (req, res) => {
  try {
    const week = parseInt(req.params.week, 10);
    const userId = req.user?.id;
    const rapport = await RapportHebdo.findOne({ week, userId });

    if (!rapport) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    res.status(200).json(rapport);
  } catch (err) {
    console.error("❌ Erreur récupération semaine :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 🧽 Supprimer un rapport (admin)
exports.deleteRapport = async (req, res) => {
  try {
    await RapportHebdo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Rapport supprimé" });
  } catch (err) {
    console.error("❌ Erreur suppression rapport :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
