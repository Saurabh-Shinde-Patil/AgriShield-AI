import { generatePrediction as genPred, savePrediction as savePred } from '../services/predictionService.js';
import { getWeatherData } from '../services/weatherService.js';
import Prediction from '../models/Prediction.js';

// @desc    Generate prediction
// @route   POST /api/predict
// @access  Public
export const generatePredictionRoute = async (req, res) => {
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

    const predictionData = genPred({
      temperature: parseFloat(temp) || 28,
      humidity: parseFloat(hum) || 65,
      soilMoisture: parseFloat(soil),
      rainfall: parseFloat(rain),
      windSpeed: parseFloat(wind),
      cropType,
      locationState: locationState || ''
    });

    // Save to database
    const saved = await savePred(predictionData, parseFloat(lat) || 0, parseFloat(lng) || 0, locationName || 'Unknown');

    res.json({ success: true, data: { ...predictionData, _id: saved._id } });
  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate prediction' });
  }
};

// @desc    Get prediction history
// @route   GET /api/predict/history
// @access  Public
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

// @desc    Get single prediction
// @route   GET /api/predict/:id
// @access  Public
export const getPredictionById = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return res.status(404).json({ success: false, error: 'Prediction not found' });
    }
    res.json({ success: true, data: prediction });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch prediction' });
  }
};
