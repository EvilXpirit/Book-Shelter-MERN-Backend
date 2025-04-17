// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//   quantity: { type: Number, required: true },
// });

// const CartItem = mongoose.model('CartItem', cartItemSchema);

// module.exports = CartItem;

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true },
}, { timestamps: true });

// Compound index to ensure unique book per user
cartItemSchema.index({ user: 1, book: 1 }, { unique: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;