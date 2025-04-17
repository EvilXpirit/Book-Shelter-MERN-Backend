const express = require('express');
const WishlistItem = require('../models/WishlistItem');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all wishlist routes
router.use(authMiddleware);

// Add an item to the wishlist
router.post('/', async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  try {
    let wishlistItem = await WishlistItem.findOne({ user: userId, book: bookId });
    if (!wishlistItem) {
      wishlistItem = new WishlistItem({ 
        user: userId,
        book: bookId 
      });
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
    const wishlistItems = await WishlistItem.find({ user: req.user.userId })
      .populate('book')
      .populate('user', 'username email');
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
