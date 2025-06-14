import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import User from '../models/User'; // Assuming User model path
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // Optional: validate subscription if it has specific allowed values
    // body('subscription').optional().isIn(['basic', 'premium']).withMessage('Invalid subscription type')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { name, email, password, subscription } = req.body;

    try {
      let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Password will be hashed by the pre-save hook in the User model
    user = new User({
      name,
      email,
      password, // Provide plaintext password to model, it will be hashed
      subscription: subscription || 'basic', // Default to 'basic' if not provided
    });

    await user.save();

    // user.toJSON() will be called which should strip the password via transform
    res.status(201).json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token (placeholder)
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Select password explicitly as it's not selected by default in the schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    if (!user.password) { // Should not happen if user is found and password selected
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials - password missing'}] });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // user.toJSON() will be called which should strip the password
    // In a real app, generate and return a JWT here
    res.json(user);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
