const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route pour obtenir les informations d'abonnement
router.get('/info', authMiddleware, subscriptionController.getSubscriptionInfo);

// Route pour créer une session de paiement Stripe
router.post('/create-checkout-session', authMiddleware, subscriptionController.createCheckoutSession);

// Route pour le webhook Stripe
router.post('/webhook', subscriptionController.handleWebhook);

module.exports = router; 