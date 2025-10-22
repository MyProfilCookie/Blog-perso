const Publication = require('../models/Publication');

// Récupérer toutes les publications
exports.getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find().sort({ date: -1 });
    res.status(200).json(publications);
  } catch (error) {
    console.error('Erreur lors de la récupération des publications:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer une publication par ID
exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }
    res.status(200).json(publication);
  } catch (error) {
    console.error('Erreur lors de la récupération de la publication:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Ajouter une nouvelle publication
exports.addPublication = async (req, res) => {
  try {
    const newPublication = new Publication(req.body);
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la publication:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour une publication
exports.updatePublication = async (req, res) => {
  try {
    const updatedPublication = await Publication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPublication) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }
    res.status(200).json(updatedPublication);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la publication:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer une publication
exports.deletePublication = async (req, res) => {
  try {
    const deletedPublication = await Publication.findByIdAndDelete(req.params.id);
    if (!deletedPublication) {
      return res.status(404).json({ message: 'Publication non trouvée' });
    }
    res.status(200).json({ message: 'Publication supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la publication:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
