const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Invalid email format',
      },
    },
    visitedAttractions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attraction'
        }
    ]
})

module.exports = mongoose.model('Visitor', visitorSchema);
