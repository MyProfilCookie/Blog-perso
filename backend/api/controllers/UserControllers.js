const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ban = require('../models/ban');

exports.signup = async (req, res) => {
  const { pseudo, nom, prenom, age, email, password } = req.body;

  if (!pseudo || !nom || !prenom || !age || !email || !password) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashage du mot de passe
    const user = new User({
      pseudo,
      nom,
      prenom,
      age,
      email,
      password: hashedPassword, // Stocker le mot de passe hashé
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Utilisateur inscrit avec succès',
      user: { id: user._id, pseudo: user.pseudo, email: user.email },
      token,
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Ajout du rôle à la réponse
    const isAdmin = user.role === 'admin'; // Vérifie si le rôle de l'utilisateur est "admin"

    //Date de création du compte
    const createdAt = user.createdAt; 

    // Envoi de la réponse avec les infos utilisateur, y compris le rôle et isAdmin
    res.status(200).json({
      message: 'Connexion réussie',
      user: { 
        id: user._id, 
        pseudo: user.pseudo, 
        email: user.email, 
        role: user.role, // Ajout du rôle à la réponse
        isAdmin, // Ajout de isAdmin à la réponse
        createdAt, // Ajout de la date de création du compte à la réponse
      },
      token,
    });
  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la sélection des utilisateurs :", error);
    return res.status(500).json({ message: "Erreur lors de la sélection des utilisateurs" });
  }
};

// Fonction pour supprimer un utilisateur par ID
exports.deleteUser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      // Code pour supprimer l'utilisateur
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Fonction pour promouvoir un utilisateur en administrateur
exports.makeAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { role: "admin", isAdmin: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur promu en administrateur",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur lors de la promotion en administrateur :", error);
    res.status(500).json({ message: "Erreur lors de la promotion en administrateur" });
  }
};

exports.banUser = async (req, res) => {
  const { userId, reason } = req.body;

  if (!reason || !userId) {
    return res.status(400).json({ message: 'Le motif et l\'utilisateur sont requis.' });
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier si l'utilisateur est Virginie
    if (user.email === 'virginie.ayivor@yahoo.fr') {
      return res.status(403).json({ message: 'Impossible de bannir cet utilisateur.' });
    }

    // Créer un nouveau bannissement
    const ban = new Ban({ userId, reason });
    await ban.save();
    
    // Optionnel : vous pouvez aussi désactiver ou supprimer l'utilisateur de la base de données.
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Utilisateur banni avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};