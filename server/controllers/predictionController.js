/**
 * Prediction Controller
 * Handles pest & disease prediction requests.
 * Accepts both manual sensor input and weather API data.
 *
 * FUTURE: Hardware sensor data will flow through the same
 * prediction pipeline via the /api/environmental → /api/predict chain.
 */
import { generatePrediction, savePrediction } from '../services/predictionService.js';
import { getWeatherData } from '../services/weatherService.js';
import Prediction from '../models/Prediction.js';

/**
 * @desc    Generate pest & disease prediction
 * @route   POST /api/predict
 * @access  Public
 */
export const generatePredictionRoute = async (req, res) => {
  try {
    const {
      temperature, humidity, soilMoisture, rainfall, windSpeed,
      cropType, lat, lng, locationName, locationState,
    } = req.body;

    if (!cropType) {
      return res.status(400).json({ success: false, error: 'Crop type is required' });
    }

    // Start with user-provided values (may come from hardware sensors)
    let temp = temperature;
    let hum = humidity;
    let rain = rainfall || 0;
    let wind = windSpeed || 5;
    let soil = soilMoisture || 50;

    // Fall back to weather API if manual data is incomplete
    if (lat && lng && (!temperature || !humidity)) {
      const weather = await getWeatherData(parseFloat(lat), parseFloat(lng));
      if (weather?.current) {
        temp = temp || weather.current.temp;
        hum = hum || weather.current.humidity;
        rain = rain || weather.current.rainfall || 0;
        wind = wind || weather.current.windSpeed || 5;
      }
    }

    const predictionData = generatePrediction({
      temperature: parseFloat(temp) || 28,
      humidity: parseFloat(hum) || 65,
      soilMoisture: parseFloat(soil),
      rainfall: parseFloat(rain),
      windSpeed: parseFloat(wind),
      cropType,
      locationState: locationState || '',
    });

    // Persist to database
    const saved = await savePrediction(
      predictionData,
      parseFloat(lat) || 0,
      parseFloat(lng) || 0,
      locationName || 'Unknown',
    );

    res.json({ success: true, data: { ...predictionData, _id: saved._id } });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate prediction' });
  }
};

/**
 * @desc    Get prediction history
 * @route   GET /api/predict/history
 * @access  Public
 */
export const getPredictionHistory = async (req, res) => {
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
};

/**
 * @desc    Get a single prediction by ID
 * @route   GET /api/predict/:id
 * @access  Public
 */
export const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ success: false, error: 'Prediction not found' });
    }
    res.json({ success: true, data: prediction });
  } catch (error) {
    console.error('Prediction fetch error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch prediction' });
  }
};
