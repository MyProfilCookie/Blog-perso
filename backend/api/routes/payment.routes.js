const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const Payment = require('../models/payments'); // Modèle de paiement
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

/**
 * ✅ 1. Créer une intention de paiement avec Stripe
 */
router.post('/create-payment-intent', async (req, res) => {
    const { price, currency = "eur", email } = req.body;
    
    if (!price) {
        return res.status(400).json({ message: "Le prix est requis pour créer un paiement." });
    }

    try {
        console.log(`💰 Création d'une intention de paiement pour ${price} ${currency}`);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(price * 100), // Convertir en centimes
            currency,
            receipt_email: email || undefined,
        });

        console.log("✅ Client Secret généré :", paymentIntent.client_secret);
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'intention de paiement:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'intention de paiement', error });
    }
});

/**
 * ✅ 2. Webhook Stripe - Écoute les événements de paiement
 */
router.post('/webhook/stripe', express.json(), async (req, res) => {
  console.log("🔔 Webhook Stripe reçu !");
  
  // Vérification du corps de la requête
  console.log("📥 Requête reçue :", JSON.stringify(req.body, null, 2));

  const event = req.body;  // On récupère l'événement brut

  if (!event || !event.data || !event.data.object) {
      console.error("❌ Erreur : Événement mal formé !");
      return res.status(400).json({ message: "Erreur : événement mal formé" });
  }

  const paymentIntent = event.data.object;

  console.log("🔍 ID du paiement :", paymentIntent.id);
  console.log("💰 Montant reçu :", paymentIntent.amount_received);
  console.log("💳 Devise :", paymentIntent.currency);
  console.log("📧 Email reçu :", paymentIntent.receipt_email);

  try {
      const newPayment = new Payment({
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount_received / 100,
          status: "Paid",
          currency: paymentIntent.currency,
          email: paymentIntent.receipt_email || "N/A"
      });

      await newPayment.save();  // Sauvegarde en base

      console.log("✅ Paiement enregistré en base :", JSON.stringify(newPayment, null, 2));
      res.status(200).json({ received: true });
  } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde en base :", error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

/**
 * ✅ 3. Récupérer un paiement par `orderId`
 */
router.get('/:orderId', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({ message: "Aucun paiement trouvé pour cette commande." });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du paiement:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

/**
 * ✅ 4. Récupérer les paiements d'un utilisateur (par email)
 */
router.get('/user/:email', verifyToken, async (req, res) => {
    try {
        const { email } = req.params;
        const payments = await Payment.find({ email });

        if (!payments.length) {
            return res.status(404).json({ message: "Aucun paiement trouvé pour cet utilisateur." });
        }

        res.status(200).json(payments);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des paiements:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

/**
 * ✅ 5. Confirmer un paiement (changer le statut)
 */
router.patch('/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
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
        console.error('❌ Erreur lors de la confirmation du paiement:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

/**
 * ✅ 6. Supprimer un paiement
 */
router.delete('/:id', verifyToken, async (req, res) => {
    const payId = req.params.id;
    try {
        const deletedPayment = await Payment.findByIdAndDelete(payId);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'ID de paiement non trouvé' });
        }
        res.status(200).json(deletedPayment);
    } catch (error) {
        console.error('❌ Erreur lors de la suppression du paiement:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

/**
 * ✅ 7. Récupérer **tous** les paiements
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de tous les paiements:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

/**
 * ✅ 8. Récuperation du bug sur stripe 
 */
router.get('/debug/payments', async (req, res) => {
  try {
      const payments = await Payment.find();
      console.log("🔍 Paiements en base :", payments);
      res.status(200).json(payments);
  } catch (error) {
      console.error("❌ Erreur lors de la récupération des paiements :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;