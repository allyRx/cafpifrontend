const { Router } = require('express');
const multer = require('multer');
const UploadedFile = require('../models/UploadedFile.js'); // .js
const { protect } = require('../middleware/auth.middleware.js'); // .js

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const { originalname, mimetype, size, buffer } = req.file;

  try {
    const newUploadedFile = new UploadedFile({
      name: originalname,
      type: mimetype,
      size,
      content: buffer,
      userId,
      status: 'uploaded',
    });

    const uploadedFile = await newUploadedFile.save();
    const responseFile = uploadedFile.toJSON(); // Mongoose .toJSON() virtuals work
    delete responseFile.content; // Still good to explicitly remove if not done by toJSON

    res.status(201).json(responseFile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/upload
// @desc    Get all uploaded files for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const files = await UploadedFile.find({ userId }).select('-content');
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/upload/:id
// @desc    Get a specific uploaded file by ID (metadata only)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const file = await UploadedFile.findOne({ _id: req.params.id, userId }).select('-content');

    if (!file) {
      return res.status(404).json({ msg: 'File not found or not authorized' });
    }
    res.json(file);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'File not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/upload/:id
// @desc    Delete an uploaded file record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const file = await UploadedFile.findOne({ _id: req.params.id, userId });

    if (!file) {
      return res.status(404).json({ msg: 'File not found or not authorized' });
    }

    await file.deleteOne();
    res.json({ msg: 'Uploaded file record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'File not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
