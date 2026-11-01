const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  author: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  isbn: { type: String, trim: true, default: '' },
  price: { type: Number, required: true, min: 0 },
  totalCopies: { type: Number, required: true, min: 0, default: 1 },
  availableCopies: { type: Number, required: true, min: 0, default: 1 },
  description: { type: String, trim: true, default: '', maxlength: 1000 },
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', category: 'text' });
module.exports = mongoose.model('Book', bookSchema);
