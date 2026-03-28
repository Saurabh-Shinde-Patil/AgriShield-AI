/**
 * Global error handling middleware
 * Catches all unhandled errors from route handlers and returns
 * a structured JSON response. Hides stack traces in production.
 */
const errorHandler = (err, req, res, _next) => {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  // ── Mongoose Validation Error ─────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fields = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${fields.join(', ')}`;
  }

  // ── Mongoose Bad ObjectId ─────────────────────────────────────
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // ── MongoDB Duplicate Key ─────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value for: ${field}`;
  }

  // Log the error (full stack in development only)
  console.error(`[${req.method} ${req.originalUrl}] ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export { errorHandler };
