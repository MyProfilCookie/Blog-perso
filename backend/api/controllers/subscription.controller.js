const User = require('../models/user.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const subscriptionController = {
  // Obtenir les informations d'abonnement
  getSubscriptionInfo: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }
      
      return res.json({
        success: true,
        subscription: {
          type: user.subscription.type,
          status: user.subscription.status,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate
        },
        role: user.role,
        dailyExerciseCount: user.dailyExerciseCount
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations d\'abonnement:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des informations d'abonnement"
      });
    }
  },
  
  // Créer une session de paiement Stripe
  createCheckoutSession: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
        customer_email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      res.json({
        success: true,
        sessionId: session.id
      });
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la session de paiement"
      });
    }
  },
  
  // Webhook Stripe pour gérer les événements de paiement
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.userId;
      
      // Mettre à jour l'abonnement de l'utilisateur
      await User.findByIdAndUpdate(userId, {
        'subscription.type': 'premium',
        'subscription.status': 'active',
        'subscription.startDate': new Date(),
        'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
      });
    }
    
    res.json({received: true});
  }
};

module.exports = subscriptionController; 