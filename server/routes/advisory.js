const express = require('express');
const router = express.Router();
const { generateAdvisory, saveAdvisory } = require('../services/advisoryService');
const Prediction = require('../models/Prediction');
const Advisory = require('../models/Advisory');

// GET /api/advisory/:predictionId - Get advisory for a prediction
router.get('/:predictionId', async (req, res) => {
  try {
    // Check if advisory already exists
    let advisory = await Advisory.findOne({ predictionId: req.params.predictionId });
    if (advisory) {
      return res.json({ success: true, data: advisory });
    }

    // Generate new advisory from prediction
    const prediction = await Prediction.findById(req.params.predictionId);
    if (!prediction) {
      return res.status(404).json({ success: false, error: 'Prediction not found' });
    }

    const advisoryData = generateAdvisory(prediction);
    advisory = await saveAdvisory(advisoryData, prediction._id);

    res.json({ success: true, data: advisory });
  } catch (error) {
    console.error('Advisory error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate advisory' });
  }
});

// POST /api/advisory/generate - Generate advisory from inline data
router.post('/generate', async (req, res) => {
  try {
    const advisoryData = generateAdvisory(req.body);
    res.json({ success: true, data: advisoryData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate advisory' });
  }
});

// GET /api/advisory/history/all - Get advisory history
router.get('/history/all', async (req, res) => {
  try {
    const advisories = await Advisory.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 20)
      .populate('predictionId');
    res.json({ success: true, data: advisories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch advisory history' });
  }
});

module.exports = router;
