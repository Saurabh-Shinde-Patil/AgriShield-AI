const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeImage } = require('../services/imageAnalysisService');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/analyze-image - Upload and analyze crop image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const cropType = req.body.cropType || 'general';
    const imageName = req.file ? req.file.filename : 'demo-image';

    const result = analyzeImage(cropType, imageName);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Image analysis error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to analyze image' });
  }
});

module.exports = router;
