const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [3, 'Le titre doit avoir au moins 3 caractères'],
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    minlength: [10, 'La description doit avoir au moins 10 caractères'],
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    minlength: [50, 'Le contenu doit avoir au moins 50 caractères']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['Sensibilisation', 'Témoignages', 'Conseils', 'Recherche'],
      message: 'La catégorie doit être Sensibilisation, Témoignages, Conseils ou Recherche'
    }
  },
  author: {
    type: String,
    required: [true, 'L’auteur est requis'],
    trim: true,
    minlength: [2, 'Le nom de l’auteur doit avoir au moins 2 caractères'],
    maxlength: [50, 'Le nom de l’auteur ne peut pas dépasser 50 caractères']
  },
  imageUrl: {
    type: String,
    default: 'https://example.com/images/default-autism.jpg',
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'L’URL de l’image doit être valide (jpg, jpeg, png, gif)']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

blogSchema.index({ category: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;