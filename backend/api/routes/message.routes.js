const express = require('express');
const router = express.Router();
const {
  getAllMessages,
  createMessage,
  getMessageById,
  deleteMessage,
} = require('../controllers/messageController');

// Route pour récupérer tous les messages
router.get('/', getAllMessages);

// Route pour créer un nouveau message
router.post('/', createMessage);

// Route pour récupérer un message par ID
router.get('/:id', getMessageById);

// Route pour supprimer un message par ID
router.delete('/:id', deleteMessage);

module.exports = router;
