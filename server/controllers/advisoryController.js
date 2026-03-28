/**
 * Advisory Controller
 * Generates smart crop protection recommendations from prediction data.
 */
import Advisory from '../models/Advisory.js';
import Prediction from '../models/Prediction.js';
import { generateAdvisory, saveAdvisory } from '../services/advisoryService.js';

/**
 * @desc    Get advisory for a specific prediction
 * @route   GET /api/advisory/:predictionId
 * @access  Public
 */
export const getAdvisoryByPredictionId = async (req, res) => {
  try {
    // Return cached advisory if it already exists
    let advisory = await Advisory.findOne({ predictionId: req.params.predictionId });
    if (advisory) {
      return res.json({ success: true, data: advisory });
    }

    // Generate a new advisory from the prediction
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
};

/**
 * @desc    Generate advisory from inline prediction data (no DB save)
 * @route   POST /api/advisory/generate
 * @access  Public
 */
export const generateInlineAdvisory = async (req, res) => {
  try {
    const advisoryData = generateAdvisory(req.body);
    res.json({ success: true, data: advisoryData });
  } catch (error) {
    console.error('Inline advisory error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate advisory' });
  }
};

/**
 * @desc    Get advisory history
 * @route   GET /api/advisory/history/all
 * @access  Public
 */
export const getAdvisoryHistory = async (req, res) => {
  try {
    const advisories = await Advisory.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 20)
      .populate('predictionId');

    res.json({ success: true, data: advisories });
  } catch (error) {
    console.error('Advisory history error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch advisory history' });
  }
};
