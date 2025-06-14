import { Router, Response } from 'express';
// Assuming ResultFile model is a subdocument of ProcessingJob,
// we might not need a standalone ResultFile model for top-level queries.
// However, if ResultFile can be queried directly or needs its own APIs, it should be a model.
// For this example, let's assume results are primarily accessed via a ProcessingJob.
// If ResultFile schema is embedded, direct ResultFile model might not be used for these routes.
// Let's adjust based on the schema definition. If ResultFile is a subdocument, routes might change.

// Re-evaluating based on schema: ResultFileSchema is exported, but not as a model.
// This means it's intended as a subdocument.
// Routes for individual ResultFiles by their own ID are less common if they are subdocuments.
// We'll primarily get them via the job.
// The download route for a specific result file implies we can identify one, perhaps by an array index or a generated ID if subdocs get them.

import ProcessingJob from '../models/ProcessingJob';
// We need ResultFile model if we plan to query them directly or if they are not just subdocuments
// For now, let's assume we might need to query ProcessingJob and then extract results.
// If ResultFile has its own model, import it:
// import ResultFile from '../models/ResultFile';
import { protect, AuthenticatedRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = Router();

// @route   GET api/results/job/:jobId
// @desc    Get all result files for a specific processing job
// @access  Private
router.get('/job/:jobId', protect, async (req: AuthenticatedRequest, res: Response) => {
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

    // @ts-ignore - Ensure folderId is populated and has userId
    if (!job.folderId || (job.folderId as any).userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    // Results are subdocuments, so they are part of the job object
    res.json(job.results);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/results/:jobId/:resultId  (Changed from /:id to be more specific)
// @desc    Get a specific result file by its ID within a job
// @access  Private
router.get('/:jobId/:resultId', protect, async (req: AuthenticatedRequest, res: Response) => {
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

    // @ts-ignore
    if (!job.folderId || (job.folderId as any).userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    const resultFile = job.results.find(r => r.id === resultId); // Mongoose subdocs have an 'id' getter
    if (!resultFile) {
      return res.status(404).json({ msg: 'Result file not found in this job' });
    }

    // Exclude content from metadata response
    const responseResult = { ...resultFile.toObject() }; // Get plain object
    // @ts-ignore
    delete responseResult.content;
    res.json(responseResult);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/results/:jobId/:resultId/download
// @desc    Download a specific result file
// @access  Private
router.get('/:jobId/:resultId/download', protect, async (req: AuthenticatedRequest, res: Response) => {
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

    // @ts-ignore
    if (!job.folderId || (job.folderId as any).userId.toString() !== userId) {
      return res.status(403).json({ msg: 'User not authorized for this job' });
    }

    const resultFile = job.results.find(r => r.id === resultId);
    if (!resultFile || !resultFile.content) {
      return res.status(404).json({ msg: 'Result file not found or content is missing' });
    }

    res.setHeader('Content-Type', resultFile.type);
    res.setHeader('Content-Disposition', `attachment; filename="${resultFile.name}"`);
    res.send(resultFile.content);

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
