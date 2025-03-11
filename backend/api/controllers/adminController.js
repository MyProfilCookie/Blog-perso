const User = require('../models/User');
const Course = require('../models/Lesson');
const Article = require('../models/Article');
const Message = require('../models/message');

// Gestion des utilisateurs
exports.getAllArticles = async (req, res) => {
  try {
      const articles = await Article.find();
      res.status(200).json(articles);
  } catch (error) {
      console.error("❌ Erreur MongoDB :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des articles", error: error.message });
  }
};

exports.promoteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      role: 'admin',
      isAdmin: true,
    }, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur promu en administrateur', user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la promotion de l'utilisateur" });
  }
};

// Dans le contrôleur `adminController.js`
exports.demoteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, { role: "user" }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la rétrogradation de l'utilisateur" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

// Gestion des cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des cours" });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: 'Cours ajouté avec succès', course });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du cours' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    res.status(200).json({ message: 'Cours mis à jour avec succès', course });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du cours" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.status(200).json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du cours" });
  }
};

// Gestion des articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des articles" });
  }
};

exports.addArticle = async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json({ message: 'Article ajouté avec succès', article });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'article' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json({ message: 'Article mis à jour avec succès', article });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'article" });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }
    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'article" });
  }
};

// Gestion des messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'pseudo email');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des messages" });
  }
};
