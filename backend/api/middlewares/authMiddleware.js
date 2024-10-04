const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Accès refusé, token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Accès refusé, vous devez être administrateur.' });
    }

    req.user = user; // Ajoute les infos de l'utilisateur à la requête
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

