const express = require('express');
const router = express.Router();
const { reverseGeocode, searchLocation } = require('../services/locationService');

// GET /api/location/reverse/:lat/:lng - Reverse geocode
router.get('/reverse/:lat/:lng', async (req, res) => {
  try {
    const location = await reverseGeocode(parseFloat(req.params.lat), parseFloat(req.params.lng));
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get location' });
  }
});

// GET /api/location/search?q=query - Search locations
router.get('/search', async (req, res) => {
  try {
    const results = await searchLocation(req.query.q || '');
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search location' });
  }
});

module.exports = router;
