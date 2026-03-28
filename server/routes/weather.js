const express = require('express');
const router = express.Router();
const { getWeatherData } = require('../services/weatherService');

// GET /api/weather/:lat/:lng - Fetch weather data
router.get('/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const weather = await getWeatherData(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, data: weather });
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
