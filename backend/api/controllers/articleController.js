const Article = require("../models/Article");

// Obtenir tous les articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    
    // Mapper les champs avec emojis vers les champs standards
    const mappedArticles = articles.map(article => {
      const articleObj = article.toObject();
      const mapped = {
        _id: articleObj._id,
        id: articleObj._id.toString(),
        title: articleObj['📌 titre'] || articleObj.title || 'Titre non disponible',
        subtitle: articleObj['📝 sous-titre'] || articleObj.subtitle || '',
        image: articleObj['🔗 imageUrl'] || articleObj.image || '/assets/default-article.jpg',
        img: articleObj['🔗 imageUrl'] || articleObj.image || '/assets/default-article.jpg',
        date: articleObj['📅 date'] || articleObj.date || new Date().toISOString(),
        author: articleObj['✍️ auteur'] || articleObj.author || 'Auteur inconnu',
        category: articleObj['📂 category'] || articleObj.category || 'Non classé',
        content: articleObj['📖 content'] || articleObj.content || '',
        description: articleObj['🧠 description'] || articleObj.description || ''
      };
      return mapped;
    });
    
    res.status(200).json(mappedArticles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des articles", error });
  }
};

// Obtenir un article par ID
exports.getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // Mapper les champs avec emojis vers les champs standards
    const articleObj = article.toObject();
    const mappedArticle = {
      _id: articleObj._id,
      id: articleObj._id.toString(),
      title: articleObj['📌 titre'] || articleObj.title || 'Titre non disponible',
      subtitle: articleObj['📝 sous-titre'] || articleObj.subtitle || '',
      image: articleObj['🔗 imageUrl'] || articleObj.image || '/assets/default-article.jpg',
      img: articleObj['🔗 imageUrl'] || articleObj.image || '/assets/default-article.jpg',
      date: articleObj['📅 date'] || articleObj.date || new Date().toISOString(),
      author: articleObj['✍️ auteur'] || articleObj.author || 'Auteur inconnu',
      category: articleObj['📂 category'] || articleObj.category || 'Non classé',
      content: articleObj['📖 content'] || articleObj.content || '',
      description: articleObj['🧠 description'] || articleObj.description || ''
    };

    return res.status(200).json(mappedArticle);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'article", error });
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
    res
      .status(201)
      .json({ message: "Article créé avec succès", article: newArticle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'article", error });
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
      { new: true },
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res
      .status(200)
      .json({
        message: "Article mis à jour avec succès",
        article: updatedArticle,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'article", error });
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
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'article", error });
  }
};
