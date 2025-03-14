
const express = require('express');
const { body, validationResult } = require('express-validator');
const Entry = require('../models/Entry');

const router = express.Router();

// Get all entries for the current user
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const entries = await Entry.findByUserId(db, req.user.id);
    res.json(entries);
  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new entry
router.post(
  '/',
  [
    body('date').notEmpty().withMessage('Date is required'),
    body('score').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { date, score, category, description } = req.body;
      const db = req.app.locals.db;

      const entry = new Entry({
        userId: req.user.id,
        date,
        score,
        category,
        description,
      });

      await entry.save(db);
      res.status(201).json(entry);
    } catch (error) {
      console.error('Add entry error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update an entry
router.put(
  '/:id',
  [
    body('score').optional().isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { id } = req.params;
      const updates = req.body;
      const db = req.app.locals.db;

      // Find entry and check ownership
      const entry = await Entry.findById(db, id);
      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }

      if (entry.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      // Update entry
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          entry[key] = updates[key];
        }
      });

      await entry.update(db);
      res.json(entry);
    } catch (error) {
      console.error('Update entry error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete an entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    // Find entry and check ownership
    const entry = await Entry.findById(db, id);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (entry.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete entry
    await Entry.deleteById(db, id);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
