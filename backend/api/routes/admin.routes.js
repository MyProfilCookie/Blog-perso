const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

// Route protégée : accès uniquement aux administrateurs
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/users/promote/:userId', isAdmin, adminController.promoteUser);
router.delete('/users/:id', isAdmin, adminController.deleteUser);

router.get('/courses', isAdmin, adminController.getAllCourses);
router.post('/courses', isAdmin, adminController.addCourse);
router.put('/courses/:id', isAdmin, adminController.updateCourse);
router.delete('/courses/:id', isAdmin, adminController.deleteCourse);

router.get('/articles', isAdmin, adminController.getAllArticles);
router.post('/articles', isAdmin, adminController.addArticle);
router.put('/articles/:id', isAdmin, adminController.updateArticle);
router.delete('/articles/:id', isAdmin, adminController.deleteArticle);

router.get('/messages', isAdmin, adminController.getMessages);

module.exports = router;
