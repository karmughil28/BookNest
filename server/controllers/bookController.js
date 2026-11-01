const Book = require('../models/Book');

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listBooks(req, res, next) {
  try {
    const conditions = [];
    const { search, category, categories, minPrice, maxPrice, available, hasIsbn } = req.query;

    // $or: search title or author. The remaining filters are combined with $and.
    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      conditions.push({ $or: [{ title: pattern }, { author: pattern }, { category: pattern }] });
    }
    if (minPrice !== undefined && minPrice !== '') {
      const value = Number(minPrice);
      if (!Number.isFinite(value)) return res.status(400).json({ message: 'minPrice must be a number.' });
      conditions.push({ price: { $gt: value } });
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const value = Number(maxPrice);
      if (!Number.isFinite(value)) return res.status(400).json({ message: 'maxPrice must be a number.' });
      conditions.push({ price: { $lt: value } });
    }
    const categoryList = categories ? String(categories).split(',').map((v) => v.trim()).filter(Boolean) : (category ? [String(category)] : []);
    if (categoryList.length) conditions.push({ category: { $in: categoryList } });
    if (available === 'true') conditions.push({ availableCopies: { $gt: 0 } });
    if (available === 'false') conditions.push({ availableCopies: 0 });
    if (hasIsbn === 'true') conditions.push({ isbn: { $exists: true, $ne: '' } });
    if (hasIsbn === 'false') conditions.push({ $or: [{ isbn: { $exists: false } }, { isbn: '' }] });

    const filter = conditions.length ? { $and: conditions } : {};
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
    const [books, total] = await Promise.all([
      Book.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Book.countDocuments(filter),
    ]);
    res.json({ books, total, page, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
}

async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.json({ book });
  } catch (error) { next(error); }
}

async function createBook(req, res, next) {
  try {
    const { title, author, category, price, totalCopies = 1, availableCopies, isbn = '', description = '' } = req.body;
    if (!title || !author || !category || price === undefined) return res.status(400).json({ message: 'Title, author, category and price are required.' });
    const total = Number(totalCopies);
    const availableCount = availableCopies === undefined ? total : Number(availableCopies);
    if (!Number.isInteger(total) || total < 0 || !Number.isInteger(availableCount) || availableCount < 0 || availableCount > total) {
      return res.status(400).json({ message: 'Copy counts must be valid whole numbers, and available copies cannot exceed total copies.' });
    }
    const book = await Book.create({ title, author, category, price: Number(price), totalCopies: total, availableCopies: availableCount, isbn, description });
    res.status(201).json({ message: 'Book added successfully.', book });
  } catch (error) { next(error); }
}

async function updateBook(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.totalCopies !== undefined) updates.totalCopies = Number(updates.totalCopies);
    if (updates.availableCopies !== undefined) updates.availableCopies = Number(updates.availableCopies);
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book updated successfully.', book });
  } catch (error) { next(error); }
}

async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book deleted successfully.' });
  } catch (error) { next(error); }
}

async function bulkCreateBooks(req, res, next) {
  try {
    if (!Array.isArray(req.body.books) || req.body.books.length === 0) return res.status(400).json({ message: 'Send a non-empty books array.' });
    if (req.body.books.length > 100) return res.status(400).json({ message: 'You can insert up to 100 books at a time.' });
    const books = await Book.insertMany(req.body.books, { ordered: true });
    res.status(201).json({ message: `${books.length} books inserted.`, books });
  } catch (error) { next(error); }
}

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook, bulkCreateBooks };
