const express = require('express');
const CartItem = require('../models/CartItem');
const router = express.Router();

// Add an item to the cart
router.post('/', async (req, res) => {
  const { bookId, quantity } = req.body;
  try {
    let cartItem = await CartItem.findOne({ book: bookId });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartItem({ book: bookId, quantity });
    }
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all items in the cart
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('book');
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove an item from the cart
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increase the quantity of an item in the cart
router.put('/:id/increment', async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (cartItem) {
      cartItem.quantity += 1; // Increase quantity by 1
      await cartItem.save();
      res.json(cartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error increasing cart item quantity:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Decrease the quantity of an item in the cart
router.put('/:id/decrement', async (req, res) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1; // Decrease quantity by 1
        await cartItem.save();
        res.json(cartItem);
      } else {
        await CartItem.findByIdAndDelete(req.params.id);
        res.status(204).end();
      }
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error decreasing cart item quantity:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
