const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');

// Route pour récupérer la leçon du jour
router.get('/lesson-of-the-day', lessonsController.getLessonOfTheDay);

// Créer une nouvelle leçon
router.post('/', lessonsController.createLesson);

// Obtenir toutes les leçons
router.get('/', lessonsController.getAllLessons);

// Obtenir une leçon par ID
router.get('/:id', lessonsController.getLessonById);

// Mettre à jour une leçon
router.put('/:id', lessonsController.updateLesson);

// Supprimer une leçon
router.delete('/:id', lessonsController.deleteLesson);

module.exports = router;
