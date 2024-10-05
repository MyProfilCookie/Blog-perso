const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// ========================
// Gestion des utilisateurs
// ========================

// Route pour obtenir la liste de tous les utilisateurs (Accès réservé aux admins)
router.get('/users', isAdmin, adminController.getAllUsers);

// Route pour promouvoir un utilisateur en admin (Accès réservé aux admins)
router.post('/users/promote/:userId', isAdmin, adminController.promoteUser);

// Route pour supprimer un utilisateur avec un identifiant spécifique (Accès réservé aux admins)
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// ========================
// Gestion des cours
// ========================

// Route pour obtenir tous les cours (Accès réservé aux admins)
router.get('/courses', isAdmin, adminController.getAllCourses);

// Route pour ajouter un nouveau cours (Accès réservé aux admins)
router.post('/courses', isAdmin, adminController.addCourse);

// Route pour mettre à jour un cours avec un identifiant spécifique (Accès réservé aux admins)
router.put('/courses/:id', isAdmin, adminController.updateCourse);

// Route pour supprimer un cours avec un identifiant spécifique (Accès réservé aux admins)
router.delete('/courses/:id', isAdmin, adminController.deleteCourse);

// ========================
// Gestion des articles
// ========================

// Route pour obtenir tous les articles (Accès réservé aux admins)
router.get('/articles', isAdmin, adminController.getAllArticles);

// Route pour ajouter un nouvel article (Accès réservé aux admins)
router.post('/articles', isAdmin, adminController.addArticle);

// Route pour mettre à jour un article avec un identifiant spécifique (Accès réservé aux admins)
router.put('/articles/:id', isAdmin, adminController.updateArticle);

// Route pour supprimer un article avec un identifiant spécifique (Accès réservé aux admins)
router.delete('/articles/:id', isAdmin, adminController.deleteArticle);

// ========================
// Gestion des messages
// ========================

// Route pour obtenir tous les messages envoyés par les utilisateurs (Accès réservé aux admins)
router.get('/messages', isAdmin, adminController.getMessages);

module.exports = router;
