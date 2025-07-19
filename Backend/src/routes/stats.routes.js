const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware.js');
const AnalysisResult = require('../models/AnalysisResult.js');
const Folder = require('../models/Folder.js');
const UploadedFile = require('../models/UploadedFile.js');
const moment = require('moment');

const router = Router();

// @route   GET api/stats
// @desc    Get dashboard stats
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const totalDocuments = await UploadedFile.countDocuments({ userId });
    const documentsThisMonth = await UploadedFile.countDocuments({
      userId,
      createdAt: { $gte: moment().startOf('month').toDate() },
    });
    const completedJobs = await AnalysisResult.countDocuments({ userId, 'metadata.processing_status': 'completed' });
    const pendingJobs = await AnalysisResult.countDocuments({ userId, 'metadata.processing_status': { $in: ['processing', 'pending'] } });
    const totalJobs = await AnalysisResult.countDocuments({ userId });
    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
    const activeFolders = await Folder.countDocuments({ userId, status: 'active' });

    res.json({
      totalDocuments,
      documentsThisMonth,
      completedJobs,
      pendingJobs,
      successRate,
      activeFolders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
