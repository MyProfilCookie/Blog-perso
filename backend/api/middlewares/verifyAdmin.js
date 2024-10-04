const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour vérifier si l'utilisateur est admin
const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email; // Extraire l'email depuis le token décodé
    const user = await User.findOne({ email }); // Rechercher l'utilisateur dans la DB

    if (user && user.role === 'admin') {
        return next(); // Si l'utilisateur est admin, on passe au prochain middleware
    } else {
        return res.status(403).json({ message: "Accès refusé, admin requis" });
    }
};

module.exports = verifyAdmin;
