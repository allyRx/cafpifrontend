import { Router, Response } from 'express';
import ProcessingJob from '../models/ProcessingJob';
import Folder from '../models/Folder';
import UploadedFile from '../models/UploadedFile'; // Assuming you might want to link to original uploaded file
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';


const router = Router();

// @route   POST api/jobs/folder/:folderId
// @desc    Create a new processing job for a folder
// @access  Private
router.post('/folder/:folderId', protect, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const folderId = req.params.folderId;
  const { uploadedFileId, fileName } = req.body; // fileName is a fallback or manual entry

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return res.status(400).json({ msg: 'Invalid folder ID format' });
  }

  try {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or user not authorized for this folder' });
    }

    let jobFileName = fileName;

    if (uploadedFileId) {
      if (!mongoose.Types.ObjectId.isValid(uploadedFileId)) {
        return res.status(400).json({ msg: 'Invalid uploaded file ID format' });
      }
      const file = await UploadedFile.findOne({ _id: uploadedFileId, userId });
      if (!file) {
        return res.status(404).json({ msg: 'Uploaded file not found or user not authorized' });
      }
      jobFileName = file.name; // Use the name from the uploaded file record
    } else if (!fileName) {
      return res.status(400).json({ msg: 'Either uploadedFileId or fileName must be provided' });
    }

    const newJob = new ProcessingJob({
      folderId,
      fileName: jobFileName, // This is the name of the file being processed
      // userId will be set by pre-save hook or manually if needed from req.user.id
      // status and progress use schema defaults ('queued', 0)
      // results array is empty by default
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/folder/:folderId
// @desc    Get all processing jobs for a specific folder
// @access  Private
router.get('/folder/:folderId', protect, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const folderId = req.params.folderId;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return res.status(400).json({ msg: 'Invalid folder ID format' });
  }

  try {
    // Ensure user has access to the folder first (optional, but good practice)
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or user not authorized' });
    }

    const jobs = await ProcessingJob.find({ folderId });
    res.json(jobs);
  } catch (err: any) - {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get a specific processing job by ID
// @access  Private
router.get('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id; // Used to ensure job belongs to user via folder
  const jobId = req.params.id;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ msg: 'Invalid job ID format' });
  }

  try {
    const job = await ProcessingJob.findById(jobId).populate('folderId');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // @ts-ignore
    // Check if the user owns the folder associated with the job
    // This assumes folderId field in ProcessingJob is populated and is not just an ID
    if (!job.folderId || (job.folderId as any).userId.toString() !== userId) {
       return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    res.json(job);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found (ObjectId error)' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/jobs/:id
// @desc    Update job status/progress
// @access  Private (should be protected, perhaps only by system services or specific user roles)
router.put('/:id', protect, async (req: AuthenticatedRequest, res: Response) => {
  const { status, progress } = req.body;
  const jobId = req.params.id;
  const userId = req.user?.id; // For authorization check

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ msg: 'Invalid job ID format' });
  }

  try {
    let job = await ProcessingJob.findById(jobId).populate('folderId');

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // @ts-ignore
    if (!job.folderId || (job.folderId as any).userId.toString() !== userId) {
       return res.status(403).json({ msg: 'User not authorized to update this job' });
    }

    if (status) job.status = status;
    if (progress !== undefined) job.progress = progress;
    if (status === 'completed' && !job.completedAt) {
      job.completedAt = new Date();
    }

    job = await job.save();
    res.json(job);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;
