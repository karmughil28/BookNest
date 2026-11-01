const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { protect } = require('./middleware/authMiddleware');
const { requireDatabase } = require('./middleware/requireDatabase');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mongoose = require('mongoose');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
  },
  credentials: false,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    service: 'BookNest API',
    database: connected ? 'connected' : 'disconnected',
    databaseName: connected ? mongoose.connection.name : null,
  });
});

app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/books', requireDatabase, protect, bookRoutes);
app.use('/api/students', requireDatabase, protect, studentRoutes);
app.use('/api/dashboard', requireDatabase, protect, dashboardRoutes);

app.use(notFound);
app.use(errorHandler);
module.exports = app;
