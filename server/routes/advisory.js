import express from 'express';
import { 
  getAdvisoryByPredictionId, 
  generateInlineAdvisory, 
  getAdvisoryHistory 
} from '../controllers/advisoryController.js';

const router = express.Router();

// GET /api/advisory/:predictionId - Get advisory for a prediction
router.get('/:predictionId', getAdvisoryByPredictionId);

// POST /api/advisory/generate - Generate advisory from inline data
router.post('/generate', generateInlineAdvisory);

// GET /api/advisory/history/all - Get advisory history
router.get('/history/all', getAdvisoryHistory);

export default router;
