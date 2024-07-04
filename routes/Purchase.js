const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order'); // Ensure this is the correct model

router.post('/', async (req, res) => {
  const { purchases } = req.body; // Assuming purchases is an array of purchase details

  try {
    // Array to store order creation promises
    const orderCreationPromises = [];

    // Process each purchase detail
    for (const purchase of purchases) {
      const { userId, bookId, copies, address } = purchase;

      // Fetch book details
      const book = await Book.findById(bookId);
      if (!book) {
        console.error(`Book with ID ${bookId} not found`);
        continue; // Skip this purchase and proceed with next
      }

      // Check if there are enough available copies
      if (book.copiesAvailable < copies) {
        console.error('Not enough available copies for book:', book.bookName);
        continue; // Skip this purchase and proceed with next
      }

      // Fetch customer details from User model
      const customer = await User.findById(userId);
      if (!customer) {
        console.error(`Customer with ID ${userId} not found`);
        continue; // Skip this purchase and proceed with next
      }

      // Deduct available copies and save book
      book.copiesAvailable -= copies;
      await book.save();

      // Create order
      const order = new Order({
        customer: userId,
        book: bookId,
        customerName: customer.fullName,
        customerNumber: customer.mobileNumber,
        customerEmail: customer.email,
        price: book.price * copies,
        copiesPurchased: copies,
        address,
      });

      // Save order creation promise
      orderCreationPromises.push(order.save());
    }

    // Wait for all order creation promises to resolve
    await Promise.all(orderCreationPromises);

    // Respond with success message
    res.status(200).json({ message: 'All purchases completed successfully' });
  } catch (error) {
    console.error('Error processing purchases:', error);
    res.status(500).json({ error: 'Failed to complete purchases' });
  }
});

router.get('/', async (req, res) => {
  try {
    // const orders = await Order.find().populate('book').populate('customer');
    const orders = await Order.find().populate({path: 'book', select: 'bookName'}).populate({path: 'customer', select: 'username'});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
