const Produit = require("../models/products"); // Modèle Produit

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Produit.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des produits", error });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Produit.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du produit", error });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Produit(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du produit", error });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Produit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du produit", error });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Produit.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
};
