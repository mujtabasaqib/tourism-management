const express = require('express');
const Attraction = require('../models/attraction'); 
const router = express.Router();

// CREATE: Add a new attraction
router.post('/', async (req, res) => {
  const { name, location, entryFee, rating } = req.body;

  try {
    const newAttraction = new Attraction({ name, location, entryFee, rating });
    await newAttraction.save();
    res.status(201).json(newAttraction); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Get all attractions
router.get('/', async (req, res) => {
  try {
    const attractions = await Attraction.find();
    res.status(200).json(attractions); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

// READ: Get a single attraction by ID
router.get('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id); 
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' }); 
    }
    res.status(200).json(attraction); 
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

// UPDATE: Update an attraction by ID
router.put('/:id', async (req, res) => {
  const { name, location, entryFee, rating } = req.body;

  try {
    const attraction = await Attraction.findByIdAndUpdate(
      req.params.id,
      { name, location, entryFee, rating },
      { new: true } 
    );
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' }); 
    }
    res.status(200).json(attraction); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete an attraction by ID
router.delete('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id); 
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' }); 
    }
    res.status(200).json({ message: 'Attraction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message }); 
  }
});

//Custom business logic
//route for adding new attraction without rating
router.post('/add-attraction', async (req, res) => {
  const { name, location, entryFee } = req.body;

  try {
    const newAttraction = new Attraction({ name, location, entryFee });
    await newAttraction.save();
    res.status(201).json(newAttraction); 
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//top 5 attractions with the highest ratings
router.get('/top-rated', async (req, res) => {
  try {
    const topAttractions = await Attraction.find({})
      .sort({ rating: -1 })
      .limit(3);             

    res.status(200).json(topAttractions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
