const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Toggle like/dislike
router.post('/toggle', likeController.toggleLike);

// Récupérer le statut de like d'un utilisateur
router.get('/status', likeController.getLikeStatus);

// Récupérer les statistiques de likes
router.get('/stats', likeController.getLikeStats);

// Récupérer les contenus likés d'un utilisateur
router.get('/user/:userId/liked', likeController.getUserLikedContent);

// Récupérer les contenus dislikés d'un utilisateur
router.get('/user/:userId/disliked', likeController.getUserDislikedContent);

module.exports = router;
