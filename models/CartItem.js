const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
