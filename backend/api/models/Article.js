const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: function () {
      return this.type === 'paragraph' || this.type === 'subtitle';
    },
  },
  src: {
    type: String,
    required: function () {
      return this.type === 'image';
    },
  },
  alt: {
    type: String,
    required: function () {
      return this.type === 'image';
    },
  },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String },
  date: { type: Date, required: true },
  author: { type: String, required: true },
  content: [contentSchema],
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;