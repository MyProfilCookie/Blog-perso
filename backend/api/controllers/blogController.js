const Blog = require('../models/Blog'); // Assumes que le modèle est dans models/Blog.js

// GET : Récupérer tous les articles avec pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Tri par date décroissante
    const total = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      message: 'Articles récupérés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des articles',
      error: error.message
    });
  }
};

// GET : Récupérer un article par ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }
    res.status(200).json({
      blog,
      message: 'Article récupéré avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de l’article',
      error: error.message
    });
  }
};

// POST : Créer un nouvel article
const createBlog = async (req, res) => {
  try {
    const { _id, title, description, content, category, author, imageUrl, createdAt } = req.body;

    // Vérification manuelle des champs obligatoires (bien que Mongoose le fasse aussi)
    if (!_id || !title || !description || !content || !category || !author) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const newBlog = new Blog({
      _id,
      title,
      description,
      content,
      category,
      author,
      imageUrl,
      createdAt: createdAt || Date.now() // Utilise la date fournie ou maintenant
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({
      blog: savedBlog,
      message: 'Article créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l’article',
      error: error.message
    });
  }
};

// PUT : Mettre à jour un article
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    // Mise à jour avec les nouvelles données, en préservant createdAt
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, createdAt: blog.createdAt },
      { new: true, runValidators: true } // Retourne le document mis à jour et valide les champs
    );

    res.status(200).json({
      blog: updatedBlog,
      message: 'Article mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l’article',
      error: error.message
    });
  }
};

// DELETE : Supprimer un article
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de l’article',
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};