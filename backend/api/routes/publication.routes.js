const express = require('express');
const router = express.Router();
const {
  getAllPublications,
  getPublicationById,
  addPublication,
  updatePublication,
  deletePublication,
} = require('../controllers/publicationController');
const { isAdmin } = require('../middlewares/authMiddleware');

// Routes pour gérer les publications
router.get('/', getAllPublications); // Récupérer toutes les publications
router.get('/:id', getPublicationById); // Récupérer une publication par ID
router.post('/', isAdmin, addPublication); // Ajouter une publication (admin)
router.put('/:id', isAdmin, updatePublication); // Mettre à jour une publication (admin)
router.delete('/:id', isAdmin, deletePublication); // Supprimer une publication (admin)

module.exports = router;
