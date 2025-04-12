const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const subscriptionController = {
  // Obtenir les informations d'abonnement
  getSubscriptionInfo: async (req, res) => {
    try {
      console.log("🔍 Début getSubscriptionInfo");
      console.log("🔍 Headers:", req.headers);
      console.log("🔍 User:", req.user);
      console.log("🔍 ID utilisateur reçu:", req.user?.id);
      
      if (!req.user || !req.user.id) {
        console.log("🚨 Utilisateur non trouvé dans la requête");
        return res.status(401).json({
          success: false,
          message: "Utilisateur non authentifié"
        });
      }

      const user = await User.findById(req.user.id);
      console.log("🔍 Utilisateur trouvé:", user ? "Oui" : "Non");
      
      if (!user) {
        console.log("🚨 Utilisateur non trouvé dans la base de données");
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }
      
      console.log("🔍 Informations d'abonnement:", {
        type: user.subscription?.type,
        status: user.subscription?.status,
        startDate: user.subscription?.startDate,
        endDate: user.subscription?.endDate
      });
      
      return res.json({
        success: true,
        subscription: {
          type: user.subscription?.type || 'free',
          status: user.subscription?.status || 'active',
          startDate: user.subscription?.startDate || null,
          endDate: user.subscription?.endDate || null
        },
        role: user.role,
        dailyExerciseCount: user.dailyExerciseCount || 0
      });
    } catch (error) {
      console.error('🚨 Erreur détaillée:', error);
      console.error('🚨 Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des informations d'abonnement",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Créer une session de paiement Stripe
  createCheckoutSession: async (req, res) => {
    try {
      console.log("🔍 Début createCheckoutSession");
      console.log("🔍 Vérification des variables d'environnement");
      console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "✅ Présent" : "❌ Manquant");
      console.log("STRIPE_PRICE_ID:", process.env.STRIPE_PRICE_ID ? "✅ Présent" : "❌ Manquant");
      console.log("FRONTEND_URL:", process.env.FRONTEND_URL ? "✅ Présent" : "❌ Manquant");

      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.FRONTEND_URL) {
        throw new Error("Configuration Stripe incomplète");
      }

      const user = await User.findById(req.user.id);
      console.log("🔍 Utilisateur trouvé:", user ? "Oui" : "Non");
      
      if (!user) {
        console.log("🚨 Utilisateur non trouvé");
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }

      // Vérifier si l'utilisateur a déjà un abonnement premium actif
      if (user.subscription?.type === 'premium' && user.subscription?.status === 'active') {
        console.log("ℹ️ L'utilisateur a déjà un abonnement premium actif");
        return res.status(400).json({
          success: false,
          message: "Vous avez déjà un abonnement premium actif"
        });
      }

      console.log("🔍 Création de la session Stripe");
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
          userId: user._id.toString(),
          userEmail: user.email
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        locale: 'fr'
      });
      
      console.log("✅ Session Stripe créée avec succès:", session.id);
      
      res.json({
        success: true,
        sessionId: session.id
      });
    } catch (error) {
      console.error('🚨 Erreur détaillée:', error);
      console.error('🚨 Stack trace:', error.stack);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la session de paiement",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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