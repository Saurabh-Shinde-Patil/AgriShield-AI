import express from 'express';
import { 
  generatePredictionRoute, 
  getPredictionHistory, 
  getPredictionById 
} from '../controllers/predictionController.js';

const router = express.Router();

// POST /api/predict - Generate prediction
router.post('/', generatePredictionRoute);

// GET /api/predict/history - Get prediction history
router.get('/history', getPredictionHistory);

// GET /api/predict/:id - Get single prediction
router.get('/:id', getPredictionById);

export default router;
