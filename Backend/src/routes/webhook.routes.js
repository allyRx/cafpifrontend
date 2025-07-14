const { Router } = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth.middleware.js');
const AnalysisResult = require('../models/AnalysisResult.js');

const router = Router();

const EXTERNAL_ENDPOINT = 'http://193.168.147.110:5678/webhook-test/cafpi-document-analysis';

// @route   POST api/webhook/cafpi-document-analysis
// @desc    Forward document analysis request to external service and save the result
// @access  Private
router.post('/cafpi-document-analysis', protect, async (req, res) => {
  const { dossier_number, borrower_name, document_base64, filename, comments } = req.body;
  const userId = req.user.id;

  if (!dossier_number || !borrower_name || !document_base64 || !filename) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    const externalResponse = await axios.post(EXTERNAL_ENDPOINT, {
      dossier_number,
      borrower_name,
      document_base64,
      filename,
      comments,
    });

    const analysisData = externalResponse.data;

    const newAnalysisResult = new AnalysisResult({
      ...analysisData,
      userId,
    });

    await newAnalysisResult.save();

    res.status(200).json(analysisData);
  } catch (error) {
    console.error('Error forwarding webhook:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
