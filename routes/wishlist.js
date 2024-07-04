const express = require('express');
const WishlistItem = require('../models/WishlistItem');
const router = express.Router();

// Add an item to the wishlist
router.post('/', async (req, res) => {
  const { bookId } = req.body;
  try {
    let wishlistItem = await WishlistItem.findOne({ book: bookId });
    if (!wishlistItem) {
      wishlistItem = new WishlistItem({ book: bookId });
      await wishlistItem.save();
    }
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all items in the wishlist
router.get('/', async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find().populate('book');
    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove an item from the wishlist
router.delete('/:id', async (req, res) => {
  try {
    await WishlistItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
