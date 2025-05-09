const express = require('express');
const router = express.Router();
const AIConversation = require('../../models/AIConversation');
const { authMiddleware: auth } = require('../middlewares/authMiddleware');

// Sauvegarder une nouvelle conversation et obtenir une réponse de l'IA
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Créer une nouvelle conversation ou récupérer la dernière
    let conversation = await AIConversation.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!conversation) {
      conversation = new AIConversation({
        userId,
        messages: []
      });
    }

    // Ajouter le message de l'utilisateur
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Préparer le contexte pour l'IA
    const context = `${conversation.context}\n\nHistorique de la conversation:\n${
      conversation.messages.map(m => `${m.role}: ${m.content}`).join('\n')
    }`;

    // Appeler l'API Mistral
    const aiResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [{
          role: 'user',
          content: context
        }],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.95,
        stream: false
      })
    });

    if (!aiResponse.ok) {
      throw new Error('Erreur lors de la communication avec l\'IA');
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Ajouter la réponse de l'IA
    conversation.messages.push({
      role: 'assistant',
      content: assistantMessage
    });

    await conversation.save();

    res.status(201).json({
      conversation: conversation,
      message: assistantMessage
    });
  } catch (error) {
    console.error('Erreur lors de la conversation avec l\'IA:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la conversation avec l\'IA',
      error: error.message 
    });
  }
});

// Récupérer les conversations d'un utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await AIConversation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
  }
});

// Récupérer une conversation spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la conversation' });
  }
});

module.exports = router; 