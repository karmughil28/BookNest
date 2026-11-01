const Book = require('../models/Book');
const Student = require('../models/Student');

async function overview(req, res, next) {
  try {
    const [totalBooks, totalStudents, availableBooks, issuedBooks, recentBooks, recentStudents, categories] = await Promise.all([
      Book.countDocuments(),
      Student.countDocuments(),
      Book.aggregate([{ $group: { _id: null, copies: { $sum: '$availableCopies' } } }]),
      Book.aggregate([{ $group: { _id: null, copies: { $sum: { $subtract: ['$totalCopies', '$availableCopies'] } } } }]),
      Book.find().sort({ createdAt: -1 }).limit(5),
      Student.find().sort({ createdAt: -1 }).limit(5),
      Book.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]),
    ]);
    res.json({
      stats: {
        totalBooks,
        totalStudents,
        availableCopies: availableBooks[0]?.copies || 0,
        issuedCopies: issuedBooks[0]?.copies || 0,
      },
      recentBooks,
      recentStudents,
      categories,
    });
  } catch (error) { next(error); }
}

module.exports = { overview };
