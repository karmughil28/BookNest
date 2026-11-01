const mongoose = require('mongoose');

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database is not connected yet. Check MONGODB_URI and your Atlas Network Access settings.' });
  }
  next();
}

module.exports = { requireDatabase };
