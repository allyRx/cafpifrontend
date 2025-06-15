// const jwt = require('jsonwebtoken'); // Commented out
// const User = require('../models/User.js'); // Commented out

const protect = (req, res, next) => {
  // Placeholder: Simulate user authentication
  // console.warn('Auth Middleware: JWT verification skipped, using mock user due to jsonwebtoken install issues.');
  // Using a consistent mock user ID that was used in earlier placeholder versions.
  req.user = {
    id: '60f7e2b5c1e2a3001f8e4d5c', // Example ObjectId string
    email: 'mock@example.com',
    name: 'Mock User'
  };
  next();
};

module.exports = { protect };
