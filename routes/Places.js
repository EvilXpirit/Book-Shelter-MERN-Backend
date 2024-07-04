const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

router.use(express.json()); // Parse JSON bodies

// GET all places
router.get('/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new place
router.post('/places', async (req, res) => {
  const { category_name, category_places } = req.body;

  try {
    const place = new Place({
      categories: [{
        category_name,
        category_places
      }]
    });

    const newPlace = await place.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
