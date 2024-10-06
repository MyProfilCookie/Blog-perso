const Article = require('../models/article');

// Obtenir tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des articles", error });
  }
};

// Ajouter un nouvel article
exports.addArticle = async (req, res) => {
  const { title, subtitle, image, date, author, content } = req.body;

  try {
    const newArticle = new Article({
      title,
      subtitle,
      image,
      date,
      author,
      content,
    });

    await newArticle.save();
    res.status(201).json({ message: "Article créé avec succès", article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'article", error });
  }
};

// Mettre à jour un article existant
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, image, date, author, content } = req.body;

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, subtitle, image, date, author, content },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json({ message: "Article mis à jour avec succès", article: updatedArticle });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'article", error });
  }
};

// Supprimer un article
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'article", error });
  }
};
