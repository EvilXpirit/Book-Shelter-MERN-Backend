const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');

// Endpoint to get book sales data
router.get('/sales-data', async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: '$book',
          totalSales: { $sum: '$copiesPurchased' }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      }
    ]);
    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to get book genre data
router.get('/genre-data', async (req, res) => {
  try {
    const genreData = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(genreData);
  } catch (error) {
    console.error('Error fetching genre data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to get book availability data
router.get('/availability-data', async (req, res) => {
  try {
    const availabilityData = await Book.find({}, 'bookName copiesAvailable');
    res.json(availabilityData);
  } catch (error) {
    console.error('Error fetching availability data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
