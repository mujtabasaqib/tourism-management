const express = require('express');
const Review = require('../models/review');
const Attraction = require('../models/attraction');
const router = express.Router();

// CREATE: Add a new review
router.post('/', async (req, res) => {
  const { attraction, visitor, score, comment } = req.body;

  try {
    // Check if the visitor has already posted a review for this attraction
    const existingReview = await Review.findOne({ attraction, visitor });

    if (existingReview) {
      return res.status(400).json({ message: 'Visitor has already reviewed this attraction' });
    }

    // If not, create new
    const newReview = new Review({ attraction, visitor, score, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// READ: Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('attraction visitor');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ: Get a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('attraction visitor');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE: Update a review by ID
router.put('/:id', async (req, res) => {
  const { score, comment } = req.body;

  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { score, comment },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a review by ID
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Custom business logic
//review for already visted attraction
router.post('/add-review', async (req, res) => {
  const { attraction, visitor, score, comment } = req.body;
  try {
    const foundVisitor = await Visitor.findById(visitor);
    if (!foundVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    if (!foundVisitor.visitedAttractions.includes(attraction)) {
      return res.status(400).json({ message: 'Visitor has not visited this attraction' });
    }

    const existingReview = await Review.findOne({ attraction, visitor });
    if (existingReview) {
      return res.status(400).json({ message: 'Visitor has already reviewed this attraction' });
    }

    const newReview = new Review({ attraction, visitor, score, comment });
    await newReview.save();

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update review with average rating
router.post('/update-attraction-rating', async (req, res) => {
  const { attraction, visitor, score, comment } = req.body;
  try {
    const foundVisitor = await Visitor.findById(visitor);
    if (!foundVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    if (!foundVisitor.visitedAttractions.includes(attraction)) {
      return res.status(400).json({ message: 'Visitor has not visited this attraction' });
    }

    const existingReview = await Review.findOne({ attraction, visitor });
    if (existingReview) {
      return res.status(400).json({ message: 'Visitor has already reviewed this attraction' });
    }

    const newReview = new Review({ attraction, visitor, score, comment });
    await newReview.save();

    const reviews = await Review.find({ attraction });
    const averageRating = reviews.reduce((total, review) => total + review.score, 0) / reviews.length;

    await Attraction.findByIdAndUpdate(attraction, { rating: averageRating });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
