const { Router } = require('express');
const { body } = require('express-validator');
const User = require('../models/User.js'); // Adjusted to .js
const { handleValidationErrors } = require('../middleware/validation.middleware.js'); // Adjusted to .js
// const jwt = require('jsonwebtoken'); // Commented out due to install issues

const router = Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
console.log("Defining route in auth.routes.js: POST /register");
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { name, email, password, subscription } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        subscription: subscription || 'basic',
      });

      await user.save();
      res.status(201).json(user); // user.toJSON() is called by Express
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (placeholder)
// @access  Public
console.log("Defining route in auth.routes.js: POST /login");
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      if (!user.password) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials - password missing' }] });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      }

    // const payload = {
    //   userId: user.id, // or user._id.toString()
    //   email: user.email,
    // };

    // // Ensure JWT_SECRET is loaded
    // if (!process.env.JWT_SECRET) {
    //   console.error('FATAL ERROR: JWT_SECRET is not defined.');
    //   return res.status(500).send('Server error (JWT_SECRET not configured)');
    // }

    // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      message: 'Login successful (JWT generation skipped due to install issues)',
      // token: token, // Token generation skipped
      user: { id: user.id, name: user.name, email: user.email, subscription: user.subscription },
    });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
