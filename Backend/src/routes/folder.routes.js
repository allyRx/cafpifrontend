const { Router } = require('express');
const { body } = require('express-validator');
const Folder = require('../models/Folder.js'); // .js
const { protect } = require('../middleware/auth.middleware.js'); // .js, AuthenticatedRequest removed
const { handleValidationErrors } = require('../middleware/validation.middleware.js'); // .js

const router = Router();

// @route   POST api/folders
// @desc    Create a new folder
// @access  Private
router.post(
  '/',
  protect,
  [body('name').notEmpty().withMessage('Folder name is required')],
  handleValidationErrors,
  async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: 'User not authenticated (should be handled by protect middleware)' });
    }

    try {
      const newFolder = new Folder({
        name,
        description,
        userId,
      });

      const folder = await newFolder.save();
      res.status(201).json(folder);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

const UploadedFile = require('../models/UploadedFile.js');

// @route   GET api/folders
// @desc    Get all folders for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const folders = await Folder.find({ userId }).lean();

    const foldersWithFileCounts = await Promise.all(
      folders.map(async (folder) => {
        const fileCount = await UploadedFile.countDocuments({ folderId: folder._id });
        return { ...folder, fileCount };
      })
    );

    res.json(foldersWithFileCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/folders/:id
// @desc    Get a specific folder by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId });

    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or not authorized' });
    }
    res.json(folder);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/folders/:id
// @desc    Update folder details
// @access  Private
router.put('/:id', protect, async (req, res) => { // Added validation for name and description if needed
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    let folder = await Folder.findOne({ _id: req.params.id, userId });

    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or not authorized' });
    }

    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;

    folder = await folder.save();
    res.json(folder);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/folders/:id
// @desc    Delete a folder
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId });

    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or not authorized' });
    }
    await folder.deleteOne();
    res.json({ msg: 'Folder removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
