import express from 'express';
import { submitEnvironmentalData, getEnvironmentalHistory } from '../controllers/environmentalController.js';

const router = express.Router();

// POST /api/environmental - Submit environmental/sensor data
router.post('/', submitEnvironmentalData);

// GET /api/environmental/history - Get environmental data history
router.get('/history', getEnvironmentalHistory);

export default router;
