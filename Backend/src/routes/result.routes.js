const { Router } = require('express');
const ProcessingJob = require('../models/ProcessingJob.js'); // .js
const { protect } = require('../middleware/auth.middleware.js'); // .js
const mongoose = require('mongoose');

const router = Router();

// @route   GET api/results/job/:jobId
// @desc    Get all result files for a specific processing job
// @access  Private
router.get('/job/:jobId', protect, async (req, res) => {
  const userId = req.user?.id;
  const jobId = req.params.jobId;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ msg: 'Invalid job ID format' });
  }

  try {
    const job = await ProcessingJob.findById(jobId).populate('folderId');
    if (!job) {
      return res.status(404).json({ msg: 'Processing job not found' });
    }

    if (!job.folderId || job.folderId.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    res.json(job.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/results/:jobId/:resultId
// @desc    Get a specific result file by its ID within a job
// @access  Private
router.get('/:jobId/:resultId', protect, async (req, res) => {
  const userId = req.user?.id;
  const { jobId, resultId } = req.params;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }
  if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(resultId)) {
    return res.status(400).json({ msg: 'Invalid job or result ID format' });
  }

  try {
    const job = await ProcessingJob.findById(jobId).populate('folderId');
    if (!job) {
      return res.status(404).json({ msg: 'Processing job not found' });
    }

    if (!job.folderId || job.folderId.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    const resultFile = job.results.find(r => r.id === resultId);
    if (!resultFile) {
      return res.status(404).json({ msg: 'Result file not found in this job' });
    }

    const responseResult = { ...resultFile.toObject() };
    delete responseResult.content;
    res.json(responseResult);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/results/:jobId/:resultId/download
// @desc    Download a specific result file
// @access  Private
router.get('/:jobId/:resultId/download', protect, async (req, res) => {
  const userId = req.user?.id;
  const { jobId, resultId } = req.params;

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(resultId)) {
    return res.status(400).json({ msg: 'Invalid job or result ID format' });
  }

  try {
    const job = await ProcessingJob.findById(jobId).populate('folderId');
    if (!job) {
      return res.status(404).json({ msg: 'Processing job not found' });
    }

    if (!job.folderId || job.folderId.userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    const resultFile = job.results.find(r => r.id === resultId);
    if (!resultFile || !resultFile.content) {
      return res.status(404).json({ msg: 'Result file not found or content is missing' });
    }

    res.setHeader('Content-Type', resultFile.type);
    res.setHeader('Content-Disposition', `attachment; filename="${resultFile.name}"`);
    res.send(resultFile.content);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
