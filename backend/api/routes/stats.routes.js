const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const statsController = require('../controllers/stats.controller');

// Route pour obtenir les statistiques
router.get('/', authMiddleware, statsController.getStats);

module.exports = router; 