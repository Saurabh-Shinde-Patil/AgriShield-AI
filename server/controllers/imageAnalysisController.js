import { analyzeImage as detectImageDisease } from '../services/imageAnalysisService.js';

// @desc    Upload and analyze crop image
// @route   POST /api/analyze-image
// @access  Public
export const uploadAndAnalyzeImage = async (req, res) => {
  try {
    const cropType = req.body.cropType || 'general';
    const imageName = req.file ? req.file.filename : 'demo-image';

    const result = detectImageDisease(cropType, imageName);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Image analysis error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
};
