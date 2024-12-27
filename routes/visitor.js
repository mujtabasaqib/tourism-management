const express = require('express');
const Visitor = require('../models/visitor');
const router = express.Router();

// CREATE: Add a new visitor
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    const newVisitor = new Visitor({ name, email });
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

module.exports = router;
