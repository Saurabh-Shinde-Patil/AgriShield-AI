import Advisory from '../models/Advisory.js';
import Prediction from '../models/Prediction.js';
import { generateAdvisory as genAdv, saveAdvisory as saveAdv } from '../services/advisoryService.js';

// @desc    Get advisory for a prediction
// @route   GET /api/advisory/:predictionId
// @access  Public
export const getAdvisoryByPredictionId = async (req, res) => {
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

    const advisoryData = genAdv(prediction);
    advisory = await saveAdv(advisoryData, prediction._id);

    res.json({ success: true, data: advisory });
  } catch (error) {
    console.error('Advisory error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate advisory' });
  }
};

// @desc    Generate advisory from inline data
// @route   POST /api/advisory/generate
// @access  Public
export const generateInlineAdvisory = async (req, res) => {
  try {
    const advisoryData = genAdv(req.body);
    res.json({ success: true, data: advisoryData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate advisory' });
  }
};

// @desc    Get advisory history
// @route   GET /api/advisory/history/all
// @access  Public
export const getAdvisoryHistory = async (req, res) => {
  try {
    const advisories = await Advisory.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 20)
      .populate('predictionId');
    res.json({ success: true, data: advisories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch advisory history' });
  }
};
