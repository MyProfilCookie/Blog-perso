const express = require('express');
const router = express.Router();
const Blog = require('../controllers/blogController');


// GET : Récupérer tous les articles avec pagination
router.get('/', Blog.getAllBlogs);
// GET : Récupérer un article par ID
router.get('/:id', Blog.getBlogById);
// POST : Créer un nouvel article
router.post('/', Blog.createBlog);
// PUT : Mettre à jour un article
router.put('/:id', Blog.updateBlog);
// DELETE : Supprimer un article
router.delete('/:id', Blog.deleteBlog);
module.exports = router;