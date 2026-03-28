/**
 * Location Controller
 * Reverse geocoding and location search via OpenWeatherMap Geo API.
 */
import { reverseGeocode, searchLocation as searchLocationService } from '../services/locationService.js';

/**
 * @desc    Reverse geocode coordinates to location name
 * @route   GET /api/location/reverse/:lat/:lng
 * @access  Public
 */
export const reverseGeocodeLocation = async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates' });
    }

    const location = await reverseGeocode(lat, lng);
    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Reverse geocode error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get location' });
  }
};

/**
 * @desc    Search locations by name
 * @route   GET /api/location/search?q=query
 * @access  Public
 */
export const searchLocation = async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }

    const results = await searchLocationService(query);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Location search error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to search location' });
  }
};
