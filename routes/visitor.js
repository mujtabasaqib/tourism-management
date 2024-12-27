const express = require('express');
const Visitor = require('../models/visitor');
const router = express.Router();

// CREATE: Add a new visitor
router.post('/', async (req, res) => {
  const { name, email, visitedAttractions } = req.body;

  try {
    const newVisitor = new Visitor({ name, email, visitedAttractions });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ: Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('visitedAttractions');
    res.status(200).json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ: Get a single visitor by ID
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('visitedAttractions');
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE: Update a visitor by ID
router.put('/:id', async (req, res) => {
  const { name, email } = req.body;

  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json(visitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a visitor by ID
router.delete('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Custom business logic
//register a new visitor
router.post('/add-visitor', async (req, res) => {
  const { name, email } = req.body;
  try {
    const existingVisitor = await Visitor.findOne({ email });

    if (existingVisitor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newVisitor = new Visitor({ name, email });
    await newVisitor.save();

    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//list of visitors with the count of attractions they have reviewed
router.get('/activity', async (req, res) => {
  try {
    const visitorsWithReviewCount = await Review.aggregate([
      {
        $group: {
          _id: "$visitor", 
          reviewCount: { $count: {} }
        }
      },
      {
        $lookup: {
          from: 'visitors', 
          localField: '_id',
          foreignField: '_id', 
          as: 'visitorDetails'
        }
      },
      {
        $unwind: "$visitorDetails" 
      },
      {
        $project: {
          _id: 0, 
          visitor: "$visitorDetails", 
          reviewCount: 1 
        }
      }
    ]);

    res.status(200).json(visitorsWithReviewCount);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
