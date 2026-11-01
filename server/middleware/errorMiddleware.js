function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (process.env.NODE_ENV !== 'test') console.error(error.stack || error.message);
  res.status(statusCode).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };
