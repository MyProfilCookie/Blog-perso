const Eleve = require('../models/Eleve');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    // Récupérer le nombre d'élèves (utilisateurs non-admin)
    const totalEleves = await User.countDocuments({ role: { $ne: 'admin' } });

    // Récupérer les autres statistiques via la méthode getStats
    const eleveStats = await Eleve.getStats();

    res.json({
      ...eleveStats,
      totalEleves: totalEleves // Remplacer par le vrai nombre d'élèves
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message 
    });
  }
}; 