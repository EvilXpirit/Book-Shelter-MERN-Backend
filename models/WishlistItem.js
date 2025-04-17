// const mongoose = require('mongoose');

// const wishlistItemSchema = new mongoose.Schema({
//   book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
// });

// const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

// module.exports = WishlistItem;

const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
}, { timestamps: true });

// Compound index to ensure unique book per user
wishlistItemSchema.index({ user: 1, book: 1 }, { unique: true });

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;