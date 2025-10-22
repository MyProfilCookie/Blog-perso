const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  image: String,
  img: String,
  date: {
    type: Date,
    default: Date.now,
  },
  author: String,
  category: String,
  content: mongoose.Schema.Types.Mixed,
  description: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Publication', publicationSchema);
