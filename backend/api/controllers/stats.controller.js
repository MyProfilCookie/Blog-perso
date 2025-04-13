const Eleve = require('../models/Eleve');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    // Récupérer le nombre d'élèves (tous les utilisateurs sauf les admins)
    const totalEleves = await User.countDocuments({ role: { $ne: 'admin' } });
    console.log('Nombre total d\'élèves trouvés:', totalEleves);

    // Récupérer les statistiques des élèves
    const eleves = await Eleve.find().populate('userId');
    
    // Calculer la moyenne générale
    const totalAverage = eleves.reduce((sum, eleve) => sum + (eleve.overallAverage || 0), 0);
    const averageScore = eleves.length > 0 ? totalAverage / eleves.length : 0;

    // Calculer la progression
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const previousCount = await User.countDocuments({
      role: { $ne: 'admin' },
      createdAt: { $lt: oneMonthAgo }
    });

    const progression = previousCount > 0 
      ? ((totalEleves - previousCount) / previousCount) * 100 
      : 100;

    // Envoyer les statistiques
    res.json({
      totalEleves,
      averageScore: averageScore.toFixed(2),
      progression: progression.toFixed(2)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
}; 