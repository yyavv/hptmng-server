// Error handling middleware

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // PostgreSQL unique violation
  if (err.code === "23505") {
    const field = err.detail?.match(/Key \((.*?)\)/)?.[1] || "field";
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // PostgreSQL foreign key violation
  if (err.code === "23503") {
    error.message = "Referenced record does not exist";
    error.statusCode = 400;
  }

  // PostgreSQL not null violation
  if (err.code === "23502") {
    const field = err.column || "field";
    error.message = `${field} is required`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === "ValidationError") {
    error.message = err.message;
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 Not Found handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
