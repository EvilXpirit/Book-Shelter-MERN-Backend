const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Create a new book
// router.post('/', async (req, res) => {
//   try {
//     const book = new Book(req.body);
//     await book.save();
//     res.status(201).send(book);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

router.post('/', async (req, res) => {
  try {
    console.log("Request body:", req.body);  // Debugging line
    const books = req.body;
    await Book.insertMany(books);
    res.status(201).send('Books added successfully');
  } catch (error) {
    console.error("Error:", error);  // Debugging line
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Edit a book by ID
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Book.find().sort({ publishingDate: -1 }).limit(10); // Adjust the limit as needed
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
