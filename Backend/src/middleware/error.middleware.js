// Interface ErrorResponse (commented out)
// interface ErrorResponse extends Error {
//   statusCode?: number;
// }

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message); // Log the error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Avoid sending error details in production for non-operational errors if needed
  // For now, we send the error message that was provided or a generic one.

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// ErrorResponse interface is not exported.
module.exports = { errorHandler };
