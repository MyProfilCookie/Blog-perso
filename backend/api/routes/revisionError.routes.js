const express = require('express');
const router = express.Router();

const RevisionError = require('../models/RevisionError'); // ou le bon chemin vers ton modèle

// POST /api/revision-errors
router.post('/revision-errors', async (req, res) => {
  const { userId, questionId, questionText, selectedAnswer, correctAnswer, category } = req.body;

  try {
    const error = new RevisionError({ userId, questionId, questionText, selectedAnswer, correctAnswer, category });
    await error.save();
    res.status(201).json({ success: true, error });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l’enregistrement' });
  }
});

module.exports = router;