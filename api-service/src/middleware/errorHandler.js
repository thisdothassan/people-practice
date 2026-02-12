const { AppError } = require("../utils");

const errorHandler = (err, req, res, next) => {
  // Log error
  console.error("Error:", err);

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
      },
    });
  }

  // Handle Postgres errors
  if (err.code) {
    if (err.code === "23505") {
      // Unique violation
      return res.status(409).json({
        error: {
          message: "Resource already exists",
          status: 409,
        },
      });
    }
    if (err.code === "23503") {
      // Foreign key violation
      return res.status(400).json({
        error: {
          message: "Invalid reference",
          status: 400,
        },
      });
    }
  }

  // Default error
  res.status(500).json({
    error: {
      message: "Internal server error",
      status: 500,
    },
  });
};

module.exports = errorHandler;
