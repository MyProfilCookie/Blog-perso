const mongoose = require('mongoose');

const banSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: ['Violation des règles', 'Spam', 'Harcèlement', 'Autre'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Ban = mongoose.model('Ban', banSchema);

module.exports = Ban;
