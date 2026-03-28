import express from 'express';
import { getAlerts } from '../controllers/alertsController.js';

const router = express.Router();

// GET /api/alerts/:lat/:lng - Get active alerts for a location
router.get('/:lat/:lng', getAlerts);

export default router;
