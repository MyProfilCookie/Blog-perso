const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// ✅ Envoyer un message de contact
router.post("/", async (req, res) => {
  try {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    const newContact = new Contact({ nom, email, message, lu: false, reponse: null });
    await newContact.save();
    return res.status(201).json({ message: "Message envoyé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur." });
  }
});

// ✅ Récupérer tous les messages
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
});

// ✅ Marquer un message comme lu
router.put("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndUpdate(id, { lu: true });
    return res.status(200).json({ message: "Message marqué comme lu !" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
  }
});

// ✅ Répondre à un message
router.post("/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { reponse } = req.body;

    if (!reponse) {
      return res.status(400).json({ error: "La réponse est obligatoire." });
    }

    await Contact.findByIdAndUpdate(id, { reponse });
    return res.status(200).json({ message: "Réponse envoyée avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de l'envoi de la réponse." });
  }
});

// ✅ Supprimer un message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ message: "Message supprimé avec succès !" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la suppression du message." });
  }
});

module.exports = router;