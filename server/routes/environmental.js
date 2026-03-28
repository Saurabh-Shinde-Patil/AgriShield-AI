const express = require('express');
const router = express.Router();
const EnvironmentalData = require('../models/EnvironmentalData');

// POST /api/environmental - Submit environmental/sensor data
router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, soilMoisture, rainfall, cropType, lat, lng, locationName, source, deviceId, notes } = req.body;

    if (!temperature || !humidity || !soilMoisture || !cropType) {
      return res.status(400).json({ success: false, error: 'Temperature, humidity, soil moisture, and crop type are required' });
    }

    const data = new EnvironmentalData({
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      soilMoisture: parseFloat(soilMoisture),
      rainfall: parseFloat(rainfall) || 0,
      cropType,
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      locationName: locationName || 'Unknown',
      source: source || 'manual',
      deviceId,
      notes
    });

    await data.save();
    res.json({ success: true, data, message: 'Environmental data saved successfully' });
  } catch (error) {
    console.error('Environmental data error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save environmental data' });
  }
});

// GET /api/environmental/history - Get environmental data history
router.get('/history', async (req, res) => {
  try {
    const { limit = 20, cropType, source } = req.query;
    const filter = {};
    if (cropType) filter.cropType = new RegExp(cropType, 'i');
    if (source) filter.source = source;

    const data = await EnvironmentalData.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch environmental data' });
  }
});

module.exports = router;
