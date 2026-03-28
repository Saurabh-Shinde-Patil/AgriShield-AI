/**
 * Environmental Data Controller
 * Handles submission and retrieval of field sensor/observation data.
 *
 * FUTURE: This is the primary endpoint for hardware IoT sensors.
 * Sensors will POST temperature, humidity, and soil moisture data here.
 * Supported sources: 'manual' | 'sensor' | 'api'
 */
import EnvironmentalData from '../models/EnvironmentalData.js';

/**
 * @desc    Submit environmental / sensor data
 * @route   POST /api/environmental
 * @access  Public
 */
export const submitEnvironmentalData = async (req, res) => {
  try {
    const {
      temperature, humidity, soilMoisture, rainfall,
      cropType, lat, lng, locationName, source, deviceId, notes,
    } = req.body;

    // Validate required fields
    if (!temperature || !humidity || !soilMoisture || !cropType) {
      return res.status(400).json({
        success: false,
        error: 'Temperature, humidity, soil moisture, and crop type are required',
      });
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
      source: source || 'manual',   // 'sensor' when coming from hardware
      deviceId,                      // Hardware device identifier
      notes,
    });

    await data.save();
    res.json({ success: true, data, message: 'Environmental data saved successfully' });
  } catch (error) {
    console.error('Environmental data error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save environmental data' });
  }
};

/**
 * @desc    Get environmental data history
 * @route   GET /api/environmental/history
 * @access  Public
 */
export const getEnvironmentalHistory = async (req, res) => {
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
    console.error('Environmental history error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch environmental data' });
  }
};
