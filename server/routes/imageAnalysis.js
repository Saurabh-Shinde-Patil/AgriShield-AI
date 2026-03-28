import express from 'express';
import upload from '../middleware/upload.js';
import { uploadAndAnalyzeImage } from '../controllers/imageAnalysisController.js';

const router = express.Router();

// POST /api/analyze-image - Upload and analyze crop image
router.post('/', upload.single('image'), uploadAndAnalyzeImage);

export default router;
