const { Router } = require('express');
const { body } = require('express-validator');
const User = require('../models/User.js');
const { protect } = require('../middleware/auth.middleware.js');
const { handleValidationErrors } = require('../middleware/validation.middleware.js');

const router = Router();

// @route   POST api/user/change-password
// @desc    Change user password
// @access  Private
router.post(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/user/export
// @desc    Export user data
// @access  Private
router.post('/export', protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // In a real application, you would generate a file (e.g., JSON, CSV)
    // and send it to the user, for example via email or direct download.
    // For this example, we'll just return the user data as JSON.
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/user
// @desc    Delete user account
// @access  Private
router.delete('/', protect, async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.deleteOne();

    res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
