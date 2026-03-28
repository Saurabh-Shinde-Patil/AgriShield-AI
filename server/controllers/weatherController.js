import { getWeatherData as fetchWeather } from '../services/weatherService.js';

// @desc    Fetch weather data for coordinates
// @route   GET /api/weather/:lat/:lng
// @access  Public
export const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const weather = await fetchWeather(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, data: weather });
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather data' });
  }
};
