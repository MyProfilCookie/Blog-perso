// controllers/messageController.js

// Exemple de base de données en mémoire (à remplacer par une vraie base de données)
const messages = [];

// Récupérer tous les messages
exports.getAllMessages = (req, res) => {
  res.status(200).json(messages);
};

// Créer un nouveau message
exports.createMessage = (req, res) => {
  const { nom, email, message, pseudo } = req.body;

  if (!nom || !email || !message || !pseudo) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const newMessage = {
    id: messages.length + 1,
    nom,
    email,
    message,
    date: new Date(),
    pseudo,
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
};

// Récupérer un message par ID
exports.getMessageById = (req, res) => {
  const { id } = req.params;
  const message = messages.find((msg) => msg.id === parseInt(id, 10));

  if (!message) {
    return res.status(404).json({ error: 'Message non trouvé' });
  }

  res.status(200).json(message);
};

// Supprimer un message par ID
exports.deleteMessage = (req, res) => {
  const { id } = req.params;
  const index = messages.findIndex((msg) => msg.id === parseInt(id, 10));

  if (index === -1) {
    return res.status(404).json({ error: 'Message non trouvé' });
  }

  messages.splice(index, 1);
  res.status(200).json({ message: 'Message supprimé avec succès' });
};
