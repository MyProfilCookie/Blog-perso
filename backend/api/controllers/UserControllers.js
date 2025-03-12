const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Ban = require("../models/ban");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");

// ========================
// 🔹 Inscription d'un utilisateur
// ========================
exports.signup = async (req, res) => {
  const { pseudo, nom, prenom, age, email, password } = req.body;

  if (!pseudo || !nom || !prenom || !age || !email || !password) {
    return res.status(400).json({ message: "Tous les champs doivent être remplis." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      pseudo,
      nom,
      prenom,
      age,
      email,
      password: hashedPassword,
      image: "/assets/default-avatar.webp",
    });

    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      message: "Inscription réussie",
      user: {
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        avatar: user.image,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// ========================
// 🔑 Connexion d'un utilisateur
// ========================
exports.login = async (req, res) => {
  const { email, pseudo, password } = req.body;

  if ((!email && !pseudo) || !password) {
    return res.status(400).json({ message: "Email ou pseudo, ainsi que le mot de passe sont requis." });
  }

  try {
    const user = await User.findOne(email ? { email } : { pseudo });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Votre compte a été banni." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        phone: user.phone,
        deliveryAddress: user.deliveryAddress,
        role: user.role,
        isAdmin: user.role === "admin",
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

// ========================
// 👤 Récupération de l'utilisateur actuel
// ========================
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ========================
// 👤 Récupération d'un utilisateur par ID
// ========================
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id === "me" ? req.userId : req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
};

// ========================
// 📌 Récupération de tous les utilisateurs
// ========================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

// ========================
// 🔄 Mise à jour d'un utilisateur
// ========================
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, phone, deliveryAddress } = req.body;

  if (!firstName || !lastName || !phone || !deliveryAddress) {
    return res.status(400).json({ message: "Tous les champs sont obligatoires." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          prenom: firstName,
          nom: lastName,
          phone,
          deliveryAddress,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

// ========================
// 🚫 Bannir un utilisateur
// ========================
exports.banUser = async (req, res) => {
  const { userId, reason } = req.body;

  if (!userId || !reason) {
    return res.status(400).json({ message: "Le motif et l'utilisateur sont requis." });
  }

  try {
    await User.findByIdAndUpdate(userId, { $set: { isBanned: true } });
    const ban = new Ban({ userId, reason });
    await ban.save();

    res.status(200).json({ message: "Utilisateur banni avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors du bannissement :", error);
    res.status(500).json({ message: "Erreur lors du bannissement." });
  }
};

// ========================
// 👑 Promotion en administrateur
// ========================
exports.makeAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin", isAdmin: true },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Utilisateur promu en administrateur.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la promotion en administrateur :", error);
    res.status(500).json({ message: "Erreur lors de la promotion en administrateur." });
  }
};

// ========================
// ❌ Suppression d'un utilisateur
// ========================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};