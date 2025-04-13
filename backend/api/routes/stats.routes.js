const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Route protégée pour obtenir les statistiques
router.get('/', authenticateToken, statsController.getStats);

module.exports = router; 