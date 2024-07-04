const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  authorName: { type: String, required: true },
  publisherName: { type: String, required: true },
  publishingDate: { type: Date, required: true },
  copiesAvailable: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true }, // Adding description field
  genre: { type: String, required: true }, // Adding genre field
  price: { type: Number, required: true } // Adding price field
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
