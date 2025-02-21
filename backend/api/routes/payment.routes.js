const express = require('express');
const Payment = require('../models/payments'); // Correction de la casse pour correspondre au nom de fichier réel
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/verifyToken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Créer une intention de paiement avec Stripe
router.post('/create-payment-intent', async (req, res) => {
  const { price } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: 'eur',
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'intention de paiement', error });
  }
});
// ✅ Récupérer un paiement par orderId
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Vérifie si un paiement existe pour cet orderId
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ message: "Aucun paiement trouvé pour cette commande." });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Création d'une transaction PayPal (exemple)
router.post('/create-paypal-transaction', async (req, res) => {
  const { price } = req.body;

  try {
    // Logique pour créer la transaction PayPal
    res.status(200).json({ message: 'Transaction PayPal créée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de la transaction PayPal:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la transaction PayPal', error });
  }
});

// Enregistrement d'un paiement et suppression des articles du panier
router.post('/', async (req, res) => {
  const payment = req.body;

  try {
    const paymentResult = await Payment.create(payment);
    const cartIds = payment.cartItems.map(id => new mongoose.Types.ObjectId(id));
    // Supprime les articles du panier après paiement sécurité
    const deleteResult = await Cart.deleteMany({ _id: { $in: cartIds } });
    res.status(200).json({ paymentResult, deleteResult });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du paiement:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du paiement', error });
  }
});

// Récupére les paiements pour un utilisateur
router.get('/', async (req, res) => {
  const email = req.query.email;  // Récupére l'email depuis la requête

  try {
    const payments = await Payment.find({ email });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error });
  }
});
router.get('/:id', async (req, res) => {
  const paymentId = req.params.id;

  try {
    // 🔹 Vérifie si on cherche par orderId ou _id
    const payment = await Payment.findOne({ $or: [{ _id: paymentId }, { orderId: paymentId }] });

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

router.get('/transaction/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log(`🔍 Recherche du paiement avec transactionId: ${transactionId}`);

    if (!transactionId) {
      return res.status(400).json({ message: '⚠ Transaction ID manquant dans la requête.' });
    }

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      console.log("❌ Aucun paiement trouvé avec cet ID !");
      return res.status(404).json({ message: "Aucun paiement trouvé pour cette transaction." });
    }

    console.log("✅ Paiement trouvé :", payment);
    res.status(200).json(payment);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du paiement:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});





// Confirme le statut de paiement
router.patch('/:id', verifyToken, async (req, res) => {
  const payId = req.params.id;
  const { status } = req.body;

  try {
    const updatedStatus = await Payment.findByIdAndUpdate(
      payId,
      { status: 'confirmed' },
      { new: true, runValidators: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: 'ID de paiement non trouvé' });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error('Erreur lors de la confirmation du statut de paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la confirmation du statut de paiement', error });
  }
});

// Supprime un paiement
router.delete('/:id', verifyToken, async (req, res) => {
  const payId = req.params.id;

  try {
    const deletedPayment = await Payment.findByIdAndDelete(payId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'ID de paiement non trouvé' });
    }

    res.status(200).json(deletedPayment);
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du paiement', error });
  }
});
// Récupère tous les paiements
router.get('/all', async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.status(200).json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les paiements:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de tous les paiements', error });
  }
});

// recupère le numéro de transaction
router.get('/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  console.log("🔍 transactionId reçu :", transactionId); // Vérification

  try {
    if (!transactionId) {
      return res.status(400).json({ message: 'Transaction ID manquant' });
    }

    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      console.log("❌ Aucun paiement trouvé avec cet ID !");
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    console.log("✅ Paiement trouvé :", payment);
    res.status(200).json(payment);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du paiement:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
});


module.exports = router;