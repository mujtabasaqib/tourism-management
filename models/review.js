const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  attraction: { type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' },
  score: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  }
})

module.exports = mongoose.model('Review', reviewSchema);
