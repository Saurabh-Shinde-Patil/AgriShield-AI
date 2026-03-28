const express = require('express');
const router = express.Router();
const { generatePrediction, savePrediction } = require('../services/predictionService');
const { getWeatherData } = require('../services/weatherService');
const Prediction = require('../models/Prediction');

// POST /api/predict - Generate prediction
router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, soilMoisture, rainfall, windSpeed, cropType, lat, lng, locationName, locationState } = req.body;

    let temp = temperature;
    let hum = humidity;
    let rain = rainfall || 0;
    let wind = windSpeed || 5;
    let soil = soilMoisture || 50;

    // If lat/lng provided but no manual data, use weather API
    if (lat && lng && (!temperature || !humidity)) {
      const weather = await getWeatherData(parseFloat(lat), parseFloat(lng));
      if (weather && weather.current) {
        temp = temp || weather.current.temp;
        hum = hum || weather.current.humidity;
        rain = rain || weather.current.rainfall || 0;
        wind = wind || weather.current.windSpeed || 5;
      }
    }

    if (!cropType) {
      return res.status(400).json({ success: false, error: 'Crop type is required' });
    }

    const prediction = generatePrediction({
      temperature: parseFloat(temp) || 28,
      humidity: parseFloat(hum) || 65,
      soilMoisture: parseFloat(soil),
      rainfall: parseFloat(rain),
      windSpeed: parseFloat(wind),
      cropType,
      locationState: locationState || ''
    });

    // Save to database
    const saved = await savePrediction(prediction, parseFloat(lat) || 0, parseFloat(lng) || 0, locationName || 'Unknown');

    res.json({ success: true, data: { ...prediction, _id: saved._id } });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate prediction' });
  }
});

// GET /api/predict/history - Get prediction history
router.get('/history', async (req, res) => {
  try {
    const { limit = 20, cropType, riskLevel } = req.query;
    const filter = {};
    if (cropType) filter.cropType = new RegExp(cropType, 'i');
    if (riskLevel) filter.$or = [{ pestRisk: riskLevel }, { diseaseRisk: riskLevel }];

    const predictions = await Prediction.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data: predictions });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

// GET /api/predict/:id - Get single prediction
router.get('/:id', async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ success: false, error: 'Prediction not found' });
    }
    res.json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch prediction' });
  }
});

module.exports = router;
