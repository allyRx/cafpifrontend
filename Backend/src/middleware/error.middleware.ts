import { Request, Response, NextFunction } from 'express';

interface ErrorResponse extends Error {
  statusCode?: number;
}

const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
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

export { errorHandler, ErrorResponse };
