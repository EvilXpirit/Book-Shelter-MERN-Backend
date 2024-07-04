const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  categories: [
    {
      category_name: {
        type: String,
        required: true
      },
      category_places: [
        {
          name: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          },
          imageUrl: {
            type: String,
            required: true
          },
          location: {
            type: String,
            required: true
          }
        }
      ]
    }
  ]
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
