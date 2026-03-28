/**
 * Weather Controller
 * Fetches real-time weather data and 7-day forecast for given coordinates.
 */
import { getWeatherData } from '../services/weatherService.js';

/**
 * @desc    Fetch weather data for coordinates
 * @route   GET /api/weather/:lat/:lng
 * @access  Public
 */
export const getWeatherByCoords = async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const lng = parseFloat(req.params.lng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, error: 'Invalid coordinates' });
    }

    const weather = await getWeatherData(lat, lng);
    res.json({ success: true, data: weather });
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
};
