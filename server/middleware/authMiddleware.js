const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Please log in to continue.' });

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      return res.status(500).json({ message: 'Server authentication is not configured. Set JWT_SECRET in server/.env.' });
    }

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Your account could not be found. Please log in again.' });
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    next(error);
  }
}

module.exports = { protect };
