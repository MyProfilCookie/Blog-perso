const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

/**
 * Génère un access token (valide 15 minutes)
 * @param {string|Object} userId - L'ID de l'utilisateur
 * @returns {string} - Access token JWT
 */
const generateAccessToken = (userId) => {
  // S'assurer que l'ID est une chaîne valide
  const id = userId.toString();
  console.log("🔑 Génération Access Token pour l'ID:", id, "Type:", typeof id);
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

/**
 * Génère un refresh token (valide 7 jours)
 * @param {string|Object} userId - L'ID de l'utilisateur
 * @returns {string} - Refresh token JWT
 */
const generateRefreshToken = (userId) => {
  // S'assurer que l'ID est une chaîne valide
  const id = userId.toString();
  console.log("🔑 Génération Refresh Token pour l'ID:", id, "Type:", typeof id);
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/**
 * Inscription d'un nouvel utilisateur
 */
exports.signup = async (req, res) => {
  try {
    const { pseudo, nom, prenom, age, email, password, phone, deliveryAddress } = req.body;

    // Vérification des champs obligatoires
    if (!pseudo || !nom || !prenom || !age || !email || !password) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Vérifier si le pseudo existe déjà
    const pseudoExists = await User.findOne({ pseudo });
    if (pseudoExists) {
      return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({
      pseudo,
      nom,
      prenom,
      age,
      email,
      password: hashedPassword,
      phone,
      deliveryAddress
    });

    // Définir isAdmin si c'est l'email administrateur
    if (email === process.env.ADMIN_EMAIL) {
      newUser.role = "admin";
      newUser.isAdmin = true;
    }

    // Enregistrement de l'utilisateur
    const savedUser = await newUser.save();
    console.log("✅ Nouvel utilisateur créé, ID:", savedUser._id);
    
    // Génération des tokens
    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    // Retourner la réponse sans le mot de passe
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Inscription réussie!",
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    
    // Erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    console.log("📧 Tentative de connexion avec l'email:", email);
    
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'email:", email);
      return res.status(404).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("❌ Mot de passe incorrect pour l'email:", email);
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    console.log("✅ Connexion réussie pour l'utilisateur:", user.pseudo, "ID:", user._id);
    
    // Génération des tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Préparer la réponse utilisateur sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Connexion réussie!",
      user: userResponse,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

/**
 * Récupération de tous les utilisateurs
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Suppression d'un utilisateur
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id).catch(err => {
      console.log("❌ Erreur lors de la suppression:", err.message);
      return null;
    });
    
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Promotion d'un utilisateur en administrateur
 */
exports.makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    user.role = "admin";
    user.isAdmin = true;
    await user.save();
    
    res.status(200).json({ 
      message: "L'utilisateur a été promu administrateur avec succès.",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("❌ Erreur lors de la promotion de l'utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Mise à jour des informations d'un utilisateur
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Si le mot de passe doit être mis à jour, le hasher
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").catch(err => {
      console.log("❌ Erreur lors de la mise à jour:", err.message);
      return null;
    });
    
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    res.status(200).json({
      message: "Profil mis à jour avec succès!",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du profil:", error);
    
    // Erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
};

/**
 * Récupération des informations de l'utilisateur actuel
 */
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("🔍 Tentative de récupération de l'utilisateur actuel");
    
    if (!req.user) {
      console.log("🚨 Utilisateur non authentifié");
      return res.status(401).json({ message: "Non autorisé." });
    }
    
    const userId = req.user._id || req.user.id;
    console.log("🔍 ID utilisateur:", userId);
    
    const user = await User.findById(userId).select("-password").catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé pour l'ID:", userId);
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    console.log("✅ Utilisateur trouvé:", user.pseudo);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * Récupération des informations d'un utilisateur par son ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select("-password").catch(err => {
      console.log("❌ Erreur lors de la recherche:", err.message);
      return null;
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Exportation des fonctions de génération de tokens
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;