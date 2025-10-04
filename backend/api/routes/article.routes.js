const express = require('express');
const router = express.Router();
const {
  getAllArticles,
  getArticleById,
  addArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const { isAdmin } = require('../middlewares/authMiddleware');

// Routes pour gérer les articles
router.get('/', getAllArticles); // Route pour récupérer tous les articles (peut être public ou réservé)
router.get('/:id', getArticleById);
router.post('/', isAdmin, addArticle); // Ajouter un nouvel article (réservé aux admins)
router.put('/:id', isAdmin, updateArticle); // Mettre à jour un article (réservé aux admins)
router.delete('/:id', isAdmin, deleteArticle); // Supprimer un article (réservé aux admins)

module.exports = router;
