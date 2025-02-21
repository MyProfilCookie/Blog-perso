const express = require('express');
const router = express.Router();
const paymentConfirmationController = require('../controllers/paymentConfirmationController');

// Routes pour les confirmations de paiement
router.post('/', paymentConfirmationController.createPaymentConfirmation);
router.get('/', paymentConfirmationController.getAllPaymentConfirmations);
router.get('/:id', paymentConfirmationController.getPaymentConfirmation);
router.delete('/:id', paymentConfirmationController.deletePaymentConfirmation);
router.patch('/:id', paymentConfirmationController.updatePaymentConfirmation); 
router.get('/transaction/:transactionId', paymentConfirmationController.getTransactionNumber);
router.get('/test-payments', async (req, res) => {
    try {
        const payments = await PaymentConfirmation.find({});
        console.log("💾 Toutes les transactions :", payments);
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
