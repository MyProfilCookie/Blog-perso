const express = require('express');
const router = express.Router();

const RevisionError = require('../models/RevisionError'); 

// POST /api/revision-errors
router.post('/', async (req, res) => {
  const { userId, questionId, questionText, selectedAnswer, correctAnswer, category } = req.body;

  try {
    const error = new RevisionError({ userId, questionId, questionText, selectedAnswer, correctAnswer, category });
    await error.save();
    res.status(201).json({ success: true, error });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de l’enregistrement' });
  }
});

// GET /api/revision-errors?userId=...
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Paramètre userId manquant' });
  }

  try {
    const errors = await RevisionError.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, errors });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des erreurs' });
  }
});

module.exports = router;