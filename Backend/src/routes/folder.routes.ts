import { Router, Response } from 'express';
import { body } from 'express-validator';
import Folder from '../models/Folder';
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// @route   POST api/folders
// @desc    Create a new folder
// @access  Private
router.post(
  '/',
  protect, // Auth middleware should come before validation if it populates req.user needed by validation/logic
  [body('name').notEmpty().withMessage('Folder name is required')],
  handleValidationErrors,
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, description } = req.body;
    const userId = req.user?.id; // Assuming protect middleware adds user to req

    if (!userId) {
      // This check might be redundant if protect middleware handles unauthenticated users
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    try {
      const newFolder = new Folder({
      name,
      description,
      userId,
      // fileCount and status will use defaults from schema
    });

    const folder = await newFolder.save();
    res.status(201).json(folder);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/folders
// @desc    Get all folders for the authenticated user
// @access  Private
router.get('/', protect, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const folders = await Folder.find({ userId });
    res.json(folders);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/folders/:id
// @desc    Get a specific folder by ID
// @access  Private
router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (err: any) {
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
router.put('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
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
    // You might want to update other fields like status if applicable

    folder = await folder.save();
    res.json(folder);
  } catch (err: any) {
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
router.delete('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId });

    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or not authorized' });
    }

    // In a real app, consider what to do with files and jobs associated with this folder.
    // For now, just deleting the folder document.
    await folder.deleteOne(); // or folder.remove() for older mongoose versions

    res.json({ msg: 'Folder removed' });
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Folder not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
