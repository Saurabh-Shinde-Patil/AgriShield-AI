import express from 'express';
import { getWeatherByCoords } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather/:lat/:lng - Fetch weather data
router.get('/:lat/:lng', getWeatherByCoords);

export default router;
