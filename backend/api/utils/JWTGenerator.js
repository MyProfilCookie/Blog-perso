// Importer dotenv pour utiliser les variables d'environnement
require('dotenv').config();

// Importer jwt pour créer le token
const jwt = require('jsonwebtoken');

// Fonction pour générer le token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const options = {
    expiresIn: '1h', // Le token expirera dans 1 heure
  };

  // Générer le token en utilisant la clé secrète
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Exemple d'utilisateur
const user = { id: '123', email: 'test@example.com', isAdmin: true };

// Générer le token
const token = generateToken(user);

// Afficher le token dans la console
console.log('Generated JWT:', token);