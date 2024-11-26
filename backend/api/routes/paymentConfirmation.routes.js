const express = require('express');
const router = express.Router();
const paymentConfirmationController = require('../controllers/paymentConfirmationController');

// Routes pour les confirmations de paiement
router.post('/', paymentConfirmationController.createPaymentConfirmation);
router.get('/:id', paymentConfirmationController.getPaymentConfirmation);
router.delete('/:id', paymentConfirmationController.deletePaymentConfirmation);

module.exports = router;
