require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = Number(process.env.PORT || 5000);
let retryTimer;
let isConnecting = false;

async function connectWithRetry() {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to server/.env. The API will stay online, but database routes will return 503.');
    return;
  }
  isConnecting = true;
  try {
    await connectDB();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Check the Atlas username/password and Network Access IP allowlist. Retrying in 10 seconds.');
    retryTimer = setTimeout(connectWithRetry, 10000);
    retryTimer.unref?.();
  } finally {
    isConnecting = false;
  }
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`BookNest API running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  connectWithRetry();
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down BookNest API.`);
  clearTimeout(retryTimer);
  server.close(async () => {
    await mongoose.connection.close().catch(() => {});
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
