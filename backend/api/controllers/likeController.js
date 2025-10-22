const Like = require('../models/Like');
const Article = require('../models/Article');
const Publication = require('../models/Publication');
const Blog = require('../models/Blog');

// Toggle like/dislike (ajouter ou retirer)
exports.toggleLike = async (req, res) => {
  try {
    const { userId, contentType, contentId, likeType } = req.body;

    if (!userId || !contentType || !contentId || !likeType) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    // Vérifier si l'utilisateur a déjà liké/disliké ce contenu
    const existingLike = await Like.findOne({ userId, contentType, contentId });

    if (existingLike) {
      // Si c'est le même type, on supprime (toggle off)
      if (existingLike.likeType === likeType) {
        await Like.deleteOne({ _id: existingLike._id });
        return res.status(200).json({
          message: 'Like retiré',
          action: 'removed',
          likeType: null
        });
      } else {
        // Si c'est un type différent, on met à jour
        existingLike.likeType = likeType;
        await existingLike.save();
        return res.status(200).json({
          message: 'Like mis à jour',
          action: 'updated',
          likeType
        });
      }
    } else {
      // Créer un nouveau like
      const newLike = new Like({ userId, contentType, contentId, likeType });
      await newLike.save();
      return res.status(201).json({
        message: 'Like ajouté',
        action: 'added',
        likeType
      });
    }
  } catch (error) {
    console.error('Erreur lors du toggle like:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer le statut de like d'un utilisateur pour un contenu
exports.getLikeStatus = async (req, res) => {
  try {
    const { userId, contentType, contentId } = req.query;

    if (!userId || !contentType || !contentId) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const like = await Like.findOne({ userId, contentType, contentId });

    if (like) {
      return res.status(200).json({ likeType: like.likeType });
    } else {
      return res.status(200).json({ likeType: null });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du like:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer les statistiques de likes pour un contenu
exports.getLikeStats = async (req, res) => {
  try {
    const { contentType, contentId } = req.query;

    if (!contentType || !contentId) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const likes = await Like.countDocuments({ contentType, contentId, likeType: 'like' });
    const dislikes = await Like.countDocuments({ contentType, contentId, likeType: 'dislike' });

    res.status(200).json({ likes, dislikes });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les contenus likés par un utilisateur
exports.getUserLikedContent = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId manquant' });
    }

    const likes = await Like.find({ userId, likeType: 'like' }).sort({ createdAt: -1 });

    // Récupérer les détails de chaque contenu
    const likedContent = await Promise.all(
      likes.map(async (like) => {
        let content = null;
        let model = null;

        switch (like.contentType) {
          case 'article':
            model = Article;
            break;
          case 'publication':
            model = Publication;
            break;
          case 'blog':
            model = Blog;
            break;
        }

        if (model) {
          content = await model.findById(like.contentId);
        }

        return {
          _id: like._id,
          contentType: like.contentType,
          contentId: like.contentId,
          likedAt: like.createdAt,
          content: content
        };
      })
    );

    // Filtrer les contenus qui n'existent plus
    const validContent = likedContent.filter(item => item.content !== null);

    res.status(200).json(validContent);
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus likés:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer tous les contenus dislikés par un utilisateur
exports.getUserDislikedContent = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId manquant' });
    }

    const dislikes = await Like.find({ userId, likeType: 'dislike' }).sort({ createdAt: -1 });

    // Récupérer les détails de chaque contenu
    const dislikedContent = await Promise.all(
      dislikes.map(async (like) => {
        let content = null;
        let model = null;

        switch (like.contentType) {
          case 'article':
            model = Article;
            break;
          case 'publication':
            model = Publication;
            break;
          case 'blog':
            model = Blog;
            break;
        }

        if (model) {
          content = await model.findById(like.contentId);
        }

        return {
          _id: like._id,
          contentType: like.contentType,
          contentId: like.contentId,
          dislikedAt: like.createdAt,
          content: content
        };
      })
    );

    // Filtrer les contenus qui n'existent plus
    const validContent = dislikedContent.filter(item => item.content !== null);

    res.status(200).json(validContent);
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus dislikés:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
