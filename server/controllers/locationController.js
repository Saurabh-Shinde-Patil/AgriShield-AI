import { reverseGeocode, searchLocation as searchLocationService } from '../services/locationService.js';

// @desc    Reverse geocode coordinates to location name
// @route   GET /api/location/reverse/:lat/:lng
// @access  Public
export const reverseGeocodeLocation = async (req, res) => {
  try {
    const location = await reverseGeocode(parseFloat(req.params.lat), parseFloat(req.params.lng));
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get location' });
  }
};

// @desc    Search locations by name
// @route   GET /api/location/search
// @access  Public
export const searchLocation = async (req, res) => {
  try {
    const results = await searchLocationService(req.query.q || '');
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search location' });
  }
};
