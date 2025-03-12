const User = require("../models/User");
const Course = require("../models/Lesson");
const Article = require("../models/Article");
const Message = require("../models/message");

// ========================
// 🔹 Gestion des utilisateurs
// ========================

// 📌 Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    console.log("✅ Utilisateurs récupérés :", users.length);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
  }
};

// 📌 Promouvoir un utilisateur en administrateur
exports.promoteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin", isAdmin: true },
      { new: true }
    );

    if (!user) {
      console.warn("⚠️ Utilisateur non trouvé :", userId);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("✅ Utilisateur promu en administrateur :", user);
    res.status(200).json({ message: "Utilisateur promu en administrateur", user });
  } catch (error) {
    console.error("❌ Erreur lors de la promotion :", error);
    res.status(500).json({ message: "Erreur lors de la promotion de l'utilisateur" });
  }
};

// 📌 Rétrograder un administrateur en utilisateur normal
exports.demoteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, { role: "user", isAdmin: false }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("✅ Utilisateur rétrogradé :", user);
    res.status(200).json({ message: "Utilisateur rétrogradé en utilisateur normal", user });
  } catch (error) {
    console.error("❌ Erreur lors de la rétrogradation :", error);
    res.status(500).json({ message: "Erreur lors de la rétrogradation de l'utilisateur" });
  }
};

// 📌 Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    console.log("✅ Utilisateur supprimé :", user);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

// ========================
// 📘 Gestion des cours
// ========================

// 📌 Obtenir tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    console.log("✅ Cours récupérés :", courses.length);
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des cours :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des cours" });
  }
};

// 📌 Ajouter un nouveau cours
exports.addCourse = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: "Titre et contenu sont requis" });
    }

    const course = new Course(req.body);
    await course.save();
    console.log("✅ Cours ajouté :", course);
    res.status(201).json({ message: "Cours ajouté avec succès", course });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du cours :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du cours" });
  }
};

// 📌 Mettre à jour un cours
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    console.log("✅ Cours mis à jour :", course);
    res.status(200).json({ message: "Cours mis à jour avec succès", course });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du cours :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du cours" });
  }
};

// 📌 Supprimer un cours
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    console.log("✅ Cours supprimé :", course);
    res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du cours :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du cours" });
  }
};

// ========================
// 📰 Gestion des articles
// ========================

// 📌 Obtenir tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    console.log("✅ Articles récupérés :", articles.length);
    res.status(200).json(articles);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des articles :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des articles" });
  }
};

// 📌 Ajouter un article
exports.addArticle = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ message: "Titre et contenu sont requis" });
    }

    const article = new Article(req.body);
    await article.save();
    console.log("✅ Article ajouté :", article);
    res.status(201).json({ message: "Article ajouté avec succès", article });
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de l'article :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'article" });
  }
};

// 📌 Mettre à jour un article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    console.log("✅ Article mis à jour :", article);
    res.status(200).json({ message: "Article mis à jour avec succès", article });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'article :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'article" });
  }
};

// 📌 Supprimer un article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    console.log("✅ Article supprimé :", article);
    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'article :", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'article" });
  }
};

// ========================
// 📩 Gestion des messages
// ========================

// 📌 Obtenir tous les messages des utilisateurs
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "pseudo email");
    console.log("✅ Messages récupérés :", messages.length);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des messages :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};
