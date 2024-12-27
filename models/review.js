const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  attraction: { type: mongoose.Schema.Types.ObjectId, ref: 'Attraction', required: true },
  visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
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

//a visitor cannot reviw the same attraction twice
reviewSchema.index({ visitor: 1, attraction: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
