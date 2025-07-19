const { Router } = require('express');
const ProcessingJob = require('../models/ProcessingJob.js'); // .js
const Folder = require('../models/Folder.js'); // .js
const UploadedFile = require('../models/UploadedFile.js'); // .js
const { protect } = require('../middleware/auth.middleware.js'); // .js
const mongoose = require('mongoose');

const router = Router();

// @route   POST api/jobs/folder/:folderId
// @desc    Create a new processing job for a folder
// @access  Private
router.post('/folder/:folderId', protect, async (req, res) => {
  const userId = req.user?.id;
  const folderId = req.params.folderId;
  const { uploadedFileId, fileName } = req.body;

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
      jobFileName = file.name;
    } else if (!fileName) {
      return res.status(400).json({ msg: 'Either uploadedFileId or fileName must be provided' });
    }

    const newJob = new ProcessingJob({
      folderId,
      fileName: jobFileName,
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/folder/:folderId
// @desc    Get all processing jobs for a specific folder
// @access  Private
router.get('/folder/:folderId', protect, async (req, res) => {
  const userId = req.user?.id;
  const folderId = req.params.folderId;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return res.status(400).json({ msg: 'Invalid folder ID format' });
  }

  try {
    const folder = await Folder.findOne({ _id: folderId, userId });
    if (!folder) {
      return res.status(404).json({ msg: 'Folder not found or user not authorized' });
    }

    const jobs = await ProcessingJob.find({ folderId });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/:id
// @desc    Get a specific processing job by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const userId = req.user?.id;
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

    if (!job.folderId || job.folderId.userId.toString() !== userId) {
       return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found (ObjectId error)' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/jobs/:id
// @desc    Update job status/progress
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status, progress } = req.body;
  const jobId = req.params.id;
  const userId = req.user?.id;

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

    if (!job.folderId || job.folderId.userId.toString() !== userId) {
       return res.status(403).json({ msg: 'User not authorized to update this job' });
    }

    if (status) job.status = status;
    if (progress !== undefined) job.progress = progress;
    if (status === 'completed' && !job.completedAt) {
      job.completedAt = new Date();
    }

    job = await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all processing jobs for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user?.id;
  const { limit, sort } = req.query;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    let query = ProcessingJob.find().populate({
      path: 'folderId',
      match: { userId },
      select: 'userId'
    });

    if (sort) {
      const sortOptions = {};
      const sortFields = sort.split(':');
      sortOptions[sortFields[0]] = sortFields[1] === 'desc' ? -1 : 1;
      query = query.sort(sortOptions);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    let jobs = await query;
    jobs = jobs.filter(job => job.folderId);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
