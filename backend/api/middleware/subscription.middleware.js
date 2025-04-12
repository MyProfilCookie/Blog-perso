const User = require('../models/user.model');

const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    
    // Les admins ont toujours accès
    if (user.role === 'admin') {
      return next();
    }
    
    // Vérifier l'accès aux exercices
    if (req.path.includes('/exercises')) {
      if (!user.canAccessExercise()) {
        return res.status(403).json({
          success: false,
          message: "Limite quotidienne d'exercices atteinte. Passez à la version premium pour un accès illimité !",
          upgradeRequired: true
        });
      }
    }
    
    // Vérifier l'accès aux statistiques détaillées
    if (req.path.includes('/stats') && user.subscription.type === 'free') {
      return res.status(403).json({
        success: false,
        message: "Cette fonctionnalité est réservée aux abonnés premium",
        upgradeRequired: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Erreur de vérification d\'abonnement:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de l'abonnement"
    });
  }
};

module.exports = checkSubscription; 